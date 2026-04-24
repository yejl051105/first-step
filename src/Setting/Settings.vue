<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/userlist'
import { storeToRefs } from 'pinia'
import { updateUser } from '@/api/user'

const userStore = useUserStore()
const { loginUser, userlist } = storeToRefs(userStore)
const { setLoginUser, syncUserInList } = userStore

const createSettingsForm = () => ({
  username: loginUser.value?.username ?? '',
  email: loginUser.value?.email ?? '',
  role: loginUser.value?.role ?? '',
  profile: loginUser.value?.profile ?? '',
  status: loginUser.value?.status ?? '',
  id: loginUser.value?.id ?? null
})

// 根据当前登录的用户 绑定settings表单数据 回填信息
let settingsForm = ref(createSettingsForm())

watch(loginUser, () => {
  Object.assign(settingsForm.value, createSettingsForm())
}, { immediate: true })

// 获取表单实例
const formRef = ref(null)

// 表单校验规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 15, message: '用户名长度需在 3 到 15 个字符之间', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
    { required: true, message: '请输入邮箱', trigger: 'blur' },
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

// cancel按钮事件
const reset = () => {
  // 直接获取最近一次更新的loginuser的数据填充即可
  Object.assign(settingsForm.value, createSettingsForm())
  ElMessage.success('表单重置成功')
}

// save changes按钮事件
const saveChanges = async () => {
  if (!loginUser.value?.id) {
    return ElMessage.error('当前登录用户信息异常')
  }

  try {
    // 先判断表单字段是否符合表单校验规则
    await formRef.value.validate()
    const res = await updateUser(settingsForm.value.id, settingsForm.value)
    const updatedUser = res.data.data

    setLoginUser(updatedUser)
    syncUserInList(updatedUser)

    if (Array.isArray(userlist.value)) {
      const index = userlist.value.findIndex(item => item.id === updatedUser.id)
      if (index !== -1) {
        Object.assign(settingsForm.value, userlist.value[index])
      }
    }

    ElMessage.success('更新个人资料成功')
  } catch (error) {
    const message = error?.response?.data?.message || '表单校验失败或保存失败'
    return ElMessage.error(message)
  }
}

const options = [
  {
    value: 'Admin',
    label: 'Admin',
  },
  {
    value: 'User',
    label: 'User',
  }
]
</script>

<template>
  <div class="container">
    <h2 class="header">Basic Settings</h2>
    <div class="information">
      <el-form label-position="top" class="form" ref="formRef" :model="settingsForm" :rules="rules">
        <el-form-item label="Username:" class="item" prop="username">
          <el-input v-model="settingsForm.username" style="width: 360px"> </el-input>
        </el-form-item>
        <el-form-item label="Email:" class="item" prop="email">
          <el-input v-model="settingsForm.email" style="width: 360px"> </el-input>
        </el-form-item>
        <el-form-item label="Role:" class="item" prop="role">
          <el-select v-model="settingsForm.role" placeholder="Select" style="width: 360px">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"
              :disabled="true" />
          </el-select>
        </el-form-item>
        <el-form-item label="Profile:" class="item">
          <el-input type="textarea" v-model="settingsForm.profile" maxlength="100" style="width: 360px" resize="none"
            show-word-limit :autosize="{ maxrows: 3 }"></el-input>
        </el-form-item>
      </el-form>
      <div class="bottom">
        <el-button class="restbtn" @click="reset">Reset</el-button>
        <el-button class="savebtn" @click="saveChanges">Save Changes</el-button>
      </div>
    </div>
  </div>

</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  display: flex;
  flex-direction: column;
  padding: 15px;
  color: var(--app-text);
}

.header {
  padding-bottom: 10px;
  border-bottom: 1px solid var(--app-border);
  color: var(--app-text);
}

.information {
  margin: 30px;
  padding: 20px;
  flex: 1;
  background-color: var(--app-surface);
  border: 1px solid var(--app-border);
  color: var(--app-text);
}

.item {
  margin: 20px;
}

.bottom {
  display: flex;
  justify-content: right;
  margin-top: 8vh;
  padding-top: 30px;
  border-top: 1px solid pink;
}

.restbtn {
  width: 10%;
}

.savebtn {
  width: 15%;
}

:deep(.el-form-item__label) {
  color: var(--app-text-muted);
}

.bottom :deep(.el-button:last-child) {
  background-color: var(--app-primary);
  border-color: var(--app-primary);
  color: #ffffff;
}

.bottom :deep(.el-button:first-child) {
  background-color: #eef2f7;
  border-color: var(--app-border);
  color: var(--app-text-muted);
}
</style>
