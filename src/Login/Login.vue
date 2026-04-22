<script setup>
import router from "@/router"
import { ElMessage } from "element-plus"
import "element-plus/es/components/message/style/css"
import { ref, reactive } from "vue"
import { useUserStore } from "@/stores/userlist"
import { loginByPassword } from "@/api/auth"

const userStore = useUserStore()
const { setLoginUser, setToken } = userStore

// 获取表单实例
const FormRef = ref(null)
const loginLoading = ref(false)

// 表单绑定
const FormData = ref({
  username: '',
  password: ''
})

// 登录事件
const login = async () => {
  // 获取不到表单元素 防止报错
  if (!FormRef.value) return
  try {
    // 表单校验
    await FormRef.value.validate()
  } catch (error) {
    return ElMessage.error("请先正确填写登录表单")
  }

  try {
    loginLoading.value = true

    const res = await loginByPassword({
      username: FormData.value.username,
      pwd: FormData.value.password
    })

    const { token, userInfo } = res.data.data

    setLoginUser(userInfo)
    setToken(token)

    FormData.value.username = ""
    FormData.value.password = ""
    ElMessage.success("登录成功,即将跳转首页")

    setTimeout(() => {
      router.push("/home")
    }, 1000)
  } catch (error) {
    const message = error?.response?.data?.message || "登录失败，请稍后重试"
    return ElMessage.error(message)
  } finally {
    loginLoading.value = false
  }
}

// 表单校验规则
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '名字长度在3-20个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 3, max: 6, message: '密码长度在3-6个字符', trigger: 'blur' },
  ]
})

</script>

<template>
  <!-- 最外层登录大盒子 -->
  <div class="parent">
    <div class="container">
      <!-- 登录盒子上半表单部分 -->
      <div class="container-top">
        <!-- 表单标题 -->
        <h2 class="title">Vue3 Demo Admin</h2>
        <!-- 表单部分 -->
        <el-form class="container-form" :model="FormData" :rules="rules" ref="FormRef">
          <el-form-item class="el-form-item" prop="username">
            <el-input v-model="FormData.username" placeholder="Username"></el-input>
          </el-form-item>
          <el-form-item class="el-form-item" prop="password">
            <el-input type="password" show-password v-model="FormData.password" placeholder="Password"></el-input>
          </el-form-item>
          <el-form-item class="el-form-item">
            <el-checkbox>Remember Me</el-checkbox>
          </el-form-item>
        </el-form>
        <div class="btn">
          <el-button :loading="loginLoading" @click="login" class="btn">Login</el-button>
          <div>Forgot Password?</div>
        </div>
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

.parent {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #0f172a 0%, #1d4ed8 58%, #dbeafe 100%);
}

.container {
  width: 310px;
  background-color: rgba(255, 255, 255, 0.96);
  border: 1px solid var(--app-border);
  border-radius: 5px;
  color: var(--app-text);
}

.title {
  width: 100%;
  padding: 30px;
  text-align: center;
  color: var(--app-text);
}

.container-form {
  width: 100%;
  padding: 5px 20px;
}

.el-form-item {
  padding-top: 15px;
}

.btn {
  width: 100%;
  padding: 0 20px;
}

.btn.el-button {
  background-color: var(--app-primary);
  border-color: var(--app-primary);
  color: #ffffff;
}

.btn.el-button:hover {
  background-color: #1e40af;
  border-color: #1e40af;
}

.btn div {
  margin: 20px 0;
  font-size: 12px;
  text-align: right;
  color: var(--app-text-muted);
}

.container :deep(.el-checkbox__label) {
  color: var(--app-text-muted);
}
</style>
