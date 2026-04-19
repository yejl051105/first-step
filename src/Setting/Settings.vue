<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/userlist'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { loginUser, userlist } = storeToRefs(userStore)

// 根据当前登录的用户 绑定settings表单数据 回填信息
let settingsForm = ref({
  username: loginUser.value.username ?? '',
  email: loginUser.value.email ?? '',
  role: loginUser.value.role ?? '',
  profile: loginUser.value.profile ?? '',
  status: loginUser.value.status ?? '',
  id: loginUser.value.id
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
const reset = () => {
  // 直接获取最近一次更新的loginuser的数据填充即可
  Object.assign(settingsForm.value,loginUser.value)
  ElMessage.success('表单重置成功')
}

// save changes按钮事件
const saveChanges = async () => {
  try {
    // 先判断表单字段是否符合表单校验规则
    await formRef.value.validate()
    // 先找到这个loginuser在数组的位置 再更新这个值到原来的位置 这样就完成了用户数组的更新
    const index = userlist.value.findIndex(item => item.id === settingsForm.value.id)
    Object.assign(userlist.value[index], settingsForm.value)
    // 还需要更新loginuser的值 这是因为Home组件使用了loginuser的用户名 如果只更新了userlist 不更新loginuser 那么Home组件的欢迎标题不会改变的
    // 这里用了浅拷贝 是因为 如果用 loginUser.value = settingsForm.value 相当于把地址给了loginUser.value loginUser是ref对象 这个值变了就会一起变
    // 如果settingsForm.value 变了 就会导致loginUser也跟着同步变
    Object.assign(loginUser.value,settingsForm.value)
    ElMessage.success('更新个人资料成功')
  } catch (error) {
    return ElMessage.error('表单校验失败')
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
