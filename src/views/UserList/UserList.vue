<script setup>
import { ElMessage } from "element-plus";
import { onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import isEqual from 'lodash/isEqual';
import { useUserStore } from "@/stores/user.store";
import { storeToRefs } from "pinia";
import { addNewUser, deleteUser, updateUser } from "@/api/user";
import { setNewSettings } from "@/api/settings";
import SearchBar from "./components/SearchBar.vue";
import UserTable from "./components/UserTable.vue";
import UserFormDialog from "./components/UserFormDialog.vue";
import DeleteUserDialog from "./components/DeleteUserDialog.vue";

const userStore = useUserStore()
const { getUserList, setLoginUser } = userStore
const { loginUser, userlist } = storeToRefs(userStore)

let saveTimer = null

const tableList = ref([])
const total = ref(0)

const editUserId = ref(null)
const deleteUserId = ref(null)
const editUserData = ref({})

const formDialogVisible = ref(false)
const formDialogMode = ref('add')
const deleteDialogVisible = ref(false)

const searchMessage = reactive({
  keyWord: '',
  role: 'All',
  currentPage: 1,
  pageSize: 4
})

onMounted(() => handleSearch())
watch(userlist, () => handleSearch(), { deep: true, immediate: true })
onBeforeUnmount(() => { if (saveTimer) clearTimeout(saveTimer) })

function handleSearch() {
  let newList = Array.isArray(userlist.value) ? [...userlist.value] : []
  if (!newList.length && !Array.isArray(userlist.value)) return

  if (searchMessage.keyWord) {
    const keyWord = searchMessage.keyWord.trim().toLowerCase()
    const matchFuzzy = (text, pattern) => {
      let pi = 0
      for (const c of text) {
        if (c === pattern[pi]) pi++
        if (pi === pattern.length) return true
      }
      return false
    }
    newList = newList.filter(item => {
      const idx = item.email.lastIndexOf("@")
      const email = item.email.slice(0, idx).toLowerCase()
      return matchFuzzy(item.username.toLowerCase(), keyWord) || matchFuzzy(email, keyWord)
    })
  }

  if (searchMessage.role !== 'All') {
    newList = newList.filter(item => item.role === searchMessage.role)
  }

  total.value = newList.length
  const start = (searchMessage.currentPage - 1) * searchMessage.pageSize
  tableList.value = newList.slice(start, start + searchMessage.pageSize)
}

// --- SearchBar events ---
const handleSearchClick = () => {
  searchMessage.currentPage = 1
  handleSearch()
}

const handleReset = () => {
  Object.assign(searchMessage, { keyWord: '', role: 'All', currentPage: 1, pageSize: 4 })
  handleSearch()
}

const handleRoleChange = (command) => {
  searchMessage.role = command
  searchMessage.currentPage = 1
  handleSearch()
}

const handlePageChange = (page) => {
  searchMessage.currentPage = page
  handleSearch()
}

// --- Table events ---
const handleOpenEdit = (_index, row) => {
  editUserId.value = row.id
  editUserData.value = { ...row }
  formDialogMode.value = 'edit'
  formDialogVisible.value = true
}

const handleOpenDelete = (_index, row) => {
  deleteUserId.value = row.id
  deleteDialogVisible.value = true
}

// --- Form dialog save (add & edit) ---
const handleFormSave = (formData) => {
  if (formDialogMode.value === 'edit') {
    handleSaveEdit(formData)
  } else {
    handleSaveAdd(formData)
  }
}

const handleSaveEdit = (editData) => {
  if (!isEqual(loginUser.value, editData)
    && loginUser.value.role !== 'Admin'
    && loginUser.value.id !== editUserId.value) {
    return ElMessage.error('非管理员只能编辑自身')
  }

  if (saveTimer) clearTimeout(saveTimer)

  saveTimer = setTimeout(async () => {
    try {
      const res = await updateUser(editUserId.value, editData)
      const updatedUser = res.data.data

      if (loginUser.value.id === editUserId.value) {
        setLoginUser(updatedUser)
        await setNewSettings(updatedUser)
      }

      const newList = await getUserList()
      if (!newList) return ElMessage.error("获取最新用户数据失败")
      formDialogVisible.value = false
    } catch (error) {
      const msg = error?.response?.data?.message || "表单校验失败"
      return ElMessage.error(msg)
    } finally {
      saveTimer = null
    }
  }, 500)
}

const handleSaveAdd = async (addData) => {
  // 直接拿 store 里的数据判重，不再额外拉一次 API
  const currentList = Array.isArray(userlist.value) ? userlist.value : []

  if (currentList.find(item => item.username === addData.username)) {
    return ElMessage.error('用户名重复')
  }

  if (saveTimer) clearTimeout(saveTimer)

  saveTimer = setTimeout(async () => {
    try {
      let newUser = { ...addData }
      const lastId = userlist.value?.length
        ? userlist.value[userlist.value.length - 1].id
        : 100
      newUser = Object.assign({ id: lastId + 1 }, newUser)
      newUser.pwd = "123123"
      newUser.profile = '暂无'

      await addNewUser(newUser)

      const newList = await getUserList()
      if (!newList) return ElMessage.error('获取最新用户数据失败')

      formDialogVisible.value = false

      const lastPage = Math.ceil((userlist.value?.length ?? 0) / searchMessage.pageSize) || 1
      searchMessage.currentPage = lastPage
      handleSearch()
      ElMessage.success('新增用户成功')
    } catch (error) {
      const msg = error?.response?.data?.message || '表单校验失败'
      return ElMessage.error(msg)
    } finally {
      saveTimer = null
    }
  }, 500)
}

const handleFormCancel = () => {
  formDialogVisible.value = false
  editUserId.value = null
  editUserData.value = {}
}

// --- Delete events ---
const handleDeleteConfirm = async () => {
  if (loginUser.value.role !== "Admin") {
    deleteDialogVisible.value = false
    return ElMessage.error("非管理员用户无法删除用户数据")
  }

  if (!userlist.value) return

  const idx = userlist.value.findIndex(item => item.id === deleteUserId.value)
  if (idx === -1) return

  if (userlist.value[idx].id === loginUser.value.id) {
    deleteDialogVisible.value = false
    return ElMessage.error("不可以删除当前正在登录的用户")
  }

  try {
    await deleteUser(deleteUserId.value)
    const newList = await getUserList()
    if (!newList) return ElMessage.error("获取最新用户数据失败")

    if ((searchMessage.currentPage - 1) * searchMessage.pageSize >= userlist.value.length && searchMessage.currentPage > 1) {
      searchMessage.currentPage -= 1
    }

    ElMessage.success('删除用户成功')
  } catch {
    ElMessage.error("删除用户失败")
  } finally {
    deleteDialogVisible.value = false
    deleteUserId.value = null
    handleSearch()
  }
}

const handleDeleteCancel = () => {
  deleteDialogVisible.value = false
  deleteUserId.value = null
}
</script>

<template>
  <div class="container">
    <h2 class="header">User List Page</h2>

    <SearchBar :search-message="searchMessage" @search="handleSearchClick" @reset="handleReset"
      @enter="handleSearchClick" @role-change="handleRoleChange"
      @open-add="formDialogMode = 'add'; formDialogVisible = true" />

    <UserTable :table-list="tableList" :total="total" :search-message="searchMessage" @edit="handleOpenEdit"
      @delete="handleOpenDelete" @page-change="handlePageChange" />

    <UserFormDialog v-model:visible="formDialogVisible" :mode="formDialogMode" :initial-data="editUserData"
      @save="handleFormSave" @cancel="handleFormCancel" />

    <DeleteUserDialog v-model:visible="deleteDialogVisible" @confirm="handleDeleteConfirm"
      @cancel="handleDeleteCancel" />
  </div>
</template>

<style scoped>
.container {
  padding: 15px;
  color: var(--app-text);
}

.header {
  padding-bottom: 10px;
  border-bottom: 1px solid var(--app-border);
  color: var(--app-text);
}
</style>
