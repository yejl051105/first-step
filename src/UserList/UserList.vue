<script setup>
import { getLoginUser, getUserList, setUserList } from "@/api/handleUserList";
import { userList } from "@/mock/table_list";
import { ElMessage } from "element-plus";
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import isEqual from 'lodash/isEqual';

// 设置防抖的定时器
let saveTimer = null

// 获取用户数据和给表格数组赋值
const localUserList = getUserList(userList)
let tableList = ref(localUserList)

// 获取选中的用户
const editUserId = ref(null)
const deleteUserId = ref(null)
const total = ref(tableList.value.length)

// 控制编辑框的显示和隐藏
const editDialogVisible = ref(false)
const addDialogVisible = ref(false)
const deleteDialogVisible = ref(false)

// 获取到表单对象
const addFormRef = ref(null)
const editFormRef = ref(null)

// 表单校验规则
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 15, message: '用户名长度需在 3 到 15 个字符之间', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
})

// 编辑用户的表单数据
const editUserMessage = reactive({
  username: '',
  email: '',
  role: '',
  status: ''
})

// 新增用户的表单数据
const addUserMessage = reactive({
  username: '',
  email: '',
  role: '',
  status: ''
})

// 查找的信息  
const searchMessage = reactive({
  keyWord: '',
  role: 'All',
  currentPage: 1,
  pageSize: 4
})

onMounted(() => {
  // 进入页面就显示对应的pageSize的数据
  handleSearch(searchMessage)
})

// 在组件卸载前 都必须把定时器都清除掉
onBeforeUnmount(() => {
  if (saveTimer) clearTimeout(saveTimer)
})

// 处理输入框回车事件
const handleEnter = () => {
  searchMessage.currentPage = 1
  handleSearch(searchMessage)
}

// 处理下拉菜单某一项被点击事件
const handleCommand = (command) => {
  searchMessage.role = command
  searchMessage.currentPage = 1
  handleSearch(searchMessage)
}

// 处理切换页数
const handleCurrentChange = (currentPage) => {
  searchMessage.currentPage = currentPage
  handleSearch(searchMessage)
}

// 处理点击搜索按钮事件
const handleSearchClick = () => {
  searchMessage.currentPage = 1
  handleSearch(searchMessage)
}

// 处理搜索事件 刷新用户数据
const handleSearch = (searchMessage) => {
  let newList = getUserList()
  // 如果本地用户数据存在 才能进行下面的操作
  if (newList) {
    // 如果传入了关键字
    if (searchMessage.keyWord) {
      // 获取关键字
      const keyWord = searchMessage.keyWord.trim().toLowerCase()
      // 字符串匹配完成模糊搜索
      const matchFuzzy = (text, pattern) => {
        let patternIndex = 0
        for (const char of text) {
          if (char === pattern[patternIndex]) {
            patternIndex += 1
          }
          // 遍历完整个字符串 如果可以和关键字的长度匹配就返回true
          if (patternIndex === pattern.length) {
            return true
          }
        }
        // 遍历完整个字符串，还没有找到和关键字等长的字符就返回false
        return false
      }
      // 遍历数组找到对应关键字的数据
      const fileterList = newList.filter(item => {
        const index = item.email.lastIndexOf("@")
        const email = item.email.slice(0, index).toLowerCase()
        const username = item.username.toLowerCase()
        return matchFuzzy(username, keyWord) || matchFuzzy(email, keyWord)
      })
      newList = fileterList
    }
    // 如果传入了角色分类
    if (searchMessage.role !== 'All') {
      // 获取角色分类
      const role = searchMessage.role
      // 遍历userList数组 获得角色为role的新数据数组
      newList = newList.filter((item) => item.role === role)
    }
    total.value = newList.length
    // 最后根据判断后的用户数据显示第几页的分页数据
    const startIndex = (searchMessage.currentPage - 1) * searchMessage.pageSize
    newList = newList.slice(startIndex, startIndex + searchMessage.pageSize)
    tableList.value = newList
  }
}

// 处理重置搜索条件事件
const handleRest = () => {
  const newSearchMessage = {
    keyWord: '',
    role: 'All',
    currentPage: 1,
    pageSize: 4
  }
  Object.assign(searchMessage, newSearchMessage)
  handleSearch(searchMessage)
}

// 处理编辑事件
const handleEdit = (scope, index, row) => {
  // 开启编辑弹窗
  editDialogVisible.value = true
  // 获取编辑框的用户信息
  const oldUserMessage = {
    username: row.username,
    email: row.email,
    role: row.role,
    status: row.status
  }
  // 防止丢失响应式数据
  Object.assign(editUserMessage, oldUserMessage)
  // 获取当前编辑用户的id
  editUserId.value = row.id
}

// 处理编辑用户的保存事件，使用防抖避免短时间内重复点击多次保存
const handleSaveOfEdit = () => {
  // 设置保存按钮防抖
  if (saveTimer) clearTimeout(saveTimer)

  saveTimer = setTimeout(async () => {
    // 表单校验
    try {
      await editFormRef.value.validate()
      // 关闭编辑弹窗
      editDialogVisible.value = false
      // 获取本地的用户数据数组
      const userList = getUserList()
      // 如果本地用户数据存在 才能进行下面的操作
      if (userList) {
        userList.forEach(item => {
          if (item.id === editUserId.value) {
            Object.assign(item, editUserMessage)
          }
        })
        setUserList(userList)
        handleSearch(searchMessage)
      }
    } catch (error) {
      return ElMessage.error("表单校验失败")
    } finally {
      saveTimer = null
    }
  }, 500)
}

// 处理编辑用户编辑框的cancel按钮点击事件
const handleEditCancel = () => {
  editFormRef.value.resetFields()
  editDialogVisible.value = false
}

// 点击弹窗中的 Yes 后，才真正执行删除
const handleComfirm = () => {
  // 先获取登录的用户 判断是否有删除用户的权限
  const loginUser = getLoginUser()[0]
  if (loginUser.role !== "Admin") {
    deleteDialogVisible.value = false
    return ElMessage.error("非管理员用户无法删除用户数据")
  }

  // 获取当前本地存储的用户数据
  const currentUserList = getUserList()

  // 如果本地用户数据存在 才执行下面的操作
  if (currentUserList) {
    const deleteUserIndex = currentUserList.findIndex(item => item.id === deleteUserId.value)

    if (deleteUserIndex !== -1) {
      // 获取当前删除的用户
      const currentUser = currentUserList[deleteUserIndex]

      // 判断当前登录的用户和删除的用户是否一样 如果用户一样就无法删除
      if (isEqual(currentUser, loginUser)) {
        deleteDialogVisible.value = false
        return ElMessage.error("不可以删除当前正在登录的用户")
      }

      currentUserList.splice(deleteUserIndex, 1)
      setUserList(currentUserList)
    }

    // 如果当前页删空了，就自动退回上一页
    if ((searchMessage.currentPage - 1) * searchMessage.pageSize >= currentUserList.length && searchMessage.currentPage > 1) {
      searchMessage.currentPage -= 1
    }

    deleteDialogVisible.value = false
    deleteUserId.value = null
    handleSearch(searchMessage)
  }
}

// 取消删除时只关闭弹窗，并清空当前待删除的用户 id 这样避免了无法在comfirm的事件中无法获取到row的问题
const handleCancelDelete = () => {
  deleteDialogVisible.value = false
  deleteUserId.value = null
}

// 处理删除用户事件
const handleDelete = (scope, index, row) => {
  // 先记录当前要删除的用户，再打开确认弹窗
  deleteUserId.value = row.id
  deleteDialogVisible.value = true
}

// 处理新增用户的保存事件
const handleSaveOfAdd = () => {
  // 设置保存按钮防抖
  if (saveTimer) clearTimeout(saveTimer)
  // 表单校验
  saveTimer = setTimeout(async () => {
    try {
      await addFormRef.value.validate()
      // 获取到新用户的数据
      let newUser = addUserMessage
      // 先获取本地存储的用户数据数组
      const userList = JSON.parse(localStorage.getItem("userList"))
      // 当用户数据列表为空时
      if (!userList.length) {
        const lastID = 0
        // 为新添加的用户添加新的对象属性 id 并且把id属性放在对象属性的最前面
        const id = lastID + 1
        newUser = Object.assign({ id }, newUser)
        newUser.pwd = "123123"
      } else {
        // 当用户数据列表不为空时 获取到当前本地用户数据数组的最后一位用户的id
        const lastID = userList[userList.length - 1].id
        // 为新添加的用户添加新的对象属性 id 并且把id属性放在对象属性的最前面
        const id = lastID + 1
        newUser = Object.assign({ id }, newUser)
        newUser.pwd = "123123"
      }
      // 在本地用户数据数组的末尾插入新的用户数据
      userList.push(newUser)
      // 把新的用户数据数组重新存储到本地
      localStorage.setItem("userList", JSON.stringify(userList))
      // 关闭新增用户弹窗
      addDialogVisible.value = false
      // 清空新增用户表单数据
      const newAddUserMessage = {
        username: '',
        email: '',
        role: '',
        status: ''
      }
      Object.assign(addUserMessage, newAddUserMessage)
      // 新增用户后能立刻看到新增的用户数据
      let currentPage = Math.ceil(userList.length / searchMessage.pageSize)
      searchMessage.currentPage = currentPage
      // 按当前搜索条件重新刷新表格数据
      handleSearch(searchMessage)
    } catch (error) {
      return ElMessage.error('表单校验失败')
    } finally {
      saveTimer = null
    }
  }, 500)
}

// 处理新增用户编辑框的cancel按钮点击事件
const handleAddCancel = () => {
  addFormRef.value.resetFields()
  addDialogVisible.value = false
}
</script>

<template>
  <div class="container">
    <h2 class="header">User List Page</h2>
    <div class="table-header">
      <!-- 左边 -->
      <div class="keyWord">
        <span class="title">Search:</span>
        <el-input placeholder="keyWord" @keyup.enter="handleEnter" v-model="searchMessage.keyWord"></el-input>
        <el-button @click="handleRest">reset</el-button>
        <el-button @click="addDialogVisible = true">Add User</el-button>
      </div>
      <!-- 中间 -->
      <div class="role">
        <span class="title">Role:</span>
        <el-dropdown split-button trigger="click" @command="handleCommand">
          {{ searchMessage.role }}
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="All">All</el-dropdown-item>
              <el-dropdown-item command="User">User</el-dropdown-item>
              <el-dropdown-item command="Admin">Admin</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <!-- 右边 -->
      <div class="search">
        <el-button @click="handleSearchClick">Search</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table">
      <el-table :data="tableList" style="width: 100%;" stripe>
        <el-table-column label="ID" prop="id"></el-table-column>
        <el-table-column label="Username" prop="username"></el-table-column>
        <el-table-column label="Email" prop="email"></el-table-column>
        <el-table-column label="Role" prop="role"></el-table-column>
        <el-table-column label="Status" prop="status"></el-table-column>
        <!-- 编辑用户按钮 -->
        <el-table-column label="Edit">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope, scope.$index, scope.row)">
              Edit
            </el-button>
          </template>
        </el-table-column>
        <!-- 删除用户按钮 -->
        <el-table-column label="Oporate">
          <template #default="scope">
            <el-button size="small" @click="handleDelete(scope, scope.$index, scope.row)">Delete</el-button>
          </template>
        </el-table-column>
        <!-- 当数据为空时显示 -->
        <template #empty>
          <div style="width: 100%; height: 100%;">数据为空</div>
        </template>
      </el-table>
    </div>
    <!-- 分页组件 -->
    <div class="pagination">
      <el-pagination background layout="prev, pager, next" :page-size="searchMessage.pageSize" :total=total
        @current-change="handleCurrentChange" v-model:current-page="searchMessage.currentPage" />
      <div class="records">Total:{{ total }} records</div>
    </div>
    <!-- 编辑用户编辑框 -->
    <el-dialog v-model="editDialogVisible" title="Edit User" width="500" align-center :show-close="false">
      <el-form class="form-container" ref="editFormRef" :rules="rules" label-position="top" :model="editUserMessage">
        <el-form-item label="Username" prop="username">
          <el-input v-model="editUserMessage.username" maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="editUserMessage.email"></el-input>
        </el-form-item>
        <el-form-item label="Role" prop="role">
          <el-select v-model="editUserMessage.role" placeholder="Select" style="width: 240px">
            <el-option value="User">User</el-option>
            <el-option value="Admin">Admin</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Status" prop="status">
          <el-radio-group v-model="editUserMessage.status">
            <el-radio value="Active">Active</el-radio>
            <el-radio value="Inactive">Inactive</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSaveOfEdit">
            Save
          </el-button>
          <el-button @click="handleEditCancel">Cancel</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 新增用户编辑框 -->
    <el-dialog v-model="addDialogVisible" title="Add User" width="500" align-center :show-close="false">
      <el-form class="form-container" ref="addFormRef" :rules="rules" label-position="top" :model="addUserMessage">
        <el-form-item label="Username" prop="username">
          <el-input v-model="addUserMessage.username" maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="addUserMessage.email"></el-input>
        </el-form-item>
        <el-form-item label="Role" prop="role">
          <el-select v-model="addUserMessage.role" placeholder="Select" style="width: 240px">
            <el-option value="User">User</el-option>
            <el-option value="Admin">Admin</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Status" prop="status">
          <el-radio-group v-model="addUserMessage.status">
            <el-radio value="Active">Active</el-radio>
            <el-radio value="Inactive">Inactive</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSaveOfAdd">
            Save
          </el-button>
          <el-button @click="handleAddCancel">Cancel</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 删除确认框 -->
    <el-dialog v-model="deleteDialogVisible" title="Delete User" width="500" align-center>
      <span>
        Are you sure to delete this user?
      </span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCancelDelete">No</el-button>
          <el-button type="primary" @click="handleComfirm">Yes</el-button>
        </div>
      </template>
    </el-dialog>
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

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  color: var(--app-text);
}

.title {
  margin-right: 5px;
  color: var(--app-text-muted);
}

.keyWord {
  display: flex;
  align-items: center;
}

.role {
  display: flex;
  align-items: center;
  justify-content: center;
}

.search {
  display: flex;
  align-items: center;
}

.table {
  margin-top: 20px;
  --el-table-border-color: var(--app-border);
  --el-table-header-bg-color: var(--app-surface-soft);
  --el-table-header-text-color: var(--app-text);
  --el-table-text-color: var(--app-text);
  --el-table-tr-bg-color: var(--app-surface);
  --el-table-row-hover-bg-color: #f8fbff;
  --el-table-current-row-bg-color: #eef4ff;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: right;
  padding: 20px;
  margin-top: 35px;
  border-top: 1px solid var(--app-border);
  color: var(--app-text-muted);
}

.records {
  margin-left: 10px;
  color: var(--app-text-muted);
}

.form-container {
  border-top: 1px solid var(--app-border);
  border-bottom: 1px solid var(--app-border);
  padding: 20px;
  color: var(--app-text);
}

.table :deep(.el-table__empty-text) {
  color: var(--app-text-muted);
}

.keyWord :deep(.el-button:nth-of-type(1)) {
  background-color: #eef2f7;
  border-color: var(--app-border);
  color: var(--app-text-muted);
}

.keyWord :deep(.el-button:nth-of-type(2)),
.search :deep(.el-button) {
  background-color: var(--app-primary);
  border-color: var(--app-primary);
  color: #ffffff;
}

.keyWord :deep(.el-button:nth-of-type(2)):hover,
.search :deep(.el-button):hover {
  background-color: #1e40af;
  border-color: #1e40af;
}

.dialog-footer :deep(.el-button:not(.el-button--primary)) {
  background-color: #eef2f7;
  border-color: var(--app-border);
  color: var(--app-text-muted);
}
</style>
