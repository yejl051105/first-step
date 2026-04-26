<script setup>
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/userlist'
import { storeToRefs } from 'pinia'
import { updateUser } from '@/api/user'
import { getSettings, setNewSettings } from "../api/settings"

const userStore = useUserStore()
const { loginUser } = storeToRefs(userStore)
const { setLoginUser, syncUserInList } = userStore

const createSettingsForm = () => ({
  username: loginUser.value?.username ?? '',
  email: loginUser.value?.email ?? '',
  role: loginUser.value?.role ?? '',
  profile: loginUser.value?.profile ?? '',
  status: loginUser.value?.status ?? '',
  id: loginUser.value?.id ?? null
})

let settingsForm = ref(createSettingsForm())

// 从后端获取个人资料信息
const fetchSettings = async () => {
  try {
    const res = await getSettings()
    const backendData = res.data?.data
    if (backendData) {
      settingsForm.value = { ...backendData }
    } else {
      settingsForm.value = createSettingsForm()
    }
  } catch {
    settingsForm.value = createSettingsForm()
  }
}

onMounted(() => {
  fetchSettings()
})

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
const reset = async () => {
  await fetchSettings()
  formRef.value?.clearValidate()
  ElMessage.success('表单重置成功')
}

// save changes按钮事件
const saveChanges = async () => {
  if (!settingsForm.value?.id) {
    return ElMessage.error('当前登录用户信息异常')
  }

  try {
    await formRef.value.validate()

    const res = await updateUser(settingsForm.value.id, settingsForm.value)

    // 获取修改完的新用户 用于更新个人资料和pinia存储当前登录的用户
    const updatedUser = res.data.data

    // 同步到用户列表和登录用户状态
    syncUserInList(updatedUser)
    setLoginUser(updatedUser)

    // 同步到后端 settings 文件
    await setNewSettings(updatedUser)
    
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
