<script setup>
import { reactive } from 'vue'
import { getLoginUser, updateSettings } from '@/api/handleUserList'
import { ElMessage } from 'element-plus'

// 获取当前登录的用户 为了回填个人资料信息
const loginUser = getLoginUser()[0] ?? {}

// 根据当前登录的用户 绑定settings表单数据 回填信息
let settingsForm = reactive({
  username: loginUser.username ?? '',
  email: loginUser.email ?? '',
  role: loginUser.role ?? '',
  profile: loginUser.profile ?? '',
  status: loginUser.status ?? '',
  id: loginUser.id
})

// 表单校验规则

// cancel按钮事件
const reset = () => {
  // 如果重置之前已经保存了一遍新的个人资料 需要重新获取新的用户数据为
  const newLoginUser = getLoginUser()[0]
  if (newLoginUser) {
    Object.assign(settingsForm, newLoginUser)
    ElMessage.success('表单重置成功')
  }
}

// save changes按钮事件
const saveChanges = () => {
  updateSettings({ ...settingsForm })
  ElMessage.success('更新个人资料成功')
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
      <el-form label-position="top" class="form" :model="settingsForm">
        <el-form-item label="Username:" class="item">
          <el-input v-model="settingsForm.username" style="width: 360px"> </el-input>
        </el-form-item>
        <el-form-item label="Email:" class="item">
          <el-input v-model="settingsForm.email" style="width: 360px"> </el-input>
        </el-form-item>
        <el-form-item label="Role:" class="item">
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
