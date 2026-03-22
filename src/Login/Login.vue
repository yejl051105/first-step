<script setup>
import router from "@/router"
import { ref, reactive } from "vue"

// 定义密码或用户名错误提示的动态样式
const errorMessage = ref(false)
// 定义表单校验错误的动态样式
const requiredMessage = ref(false)

// 获取表单实例
const FormRef = ref()

// 表单绑定
const FormData = ref({
  username: '',
  password: ''
})

// 登录事件
const login = async (FormData) => {
  if(!FormRef.value) return 
  try {
    await FormRef.value.validate()
  } catch (error) {
    requiredMessage.value = true
    return
  }

  // 姓名或密码错误 登录失败
  if (FormData.username !== 'zhangsan' || FormData.password !== '123123') {
    console.log('登录失败')
    errorMessage.value = true
    return
  }
  // 登录成功
  FormData.username = FormData.password = ''
  errorMessage.value = false
  router.push('/home')
  console.log('登录成功')

}

// 表单校验规则
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 8, message: '名字长度在3-8个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 3, max: 6, message: '密码长度在3-6个字符', trigger: 'blur' },
  ]
})

</script>

<template>
  <!-- 最外层登录大盒子 -->
  <div class="container">
    <!-- 登录盒子上半表单部分 -->
    <div class="container-top">
      <!-- 表单标题 -->
      <h2 class="title">Vue3 Demo Admin</h2>
      <!-- 表单部分 -->
      <el-form class="container-form" :model="FormData" :rules="rules" ref="FormRef">
        <el-form-item prop="username">
          <el-input v-model="FormData.username" placeholder="Username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" show-password v-model="FormData.password" placeholder="Password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox>Remember Me</el-checkbox>
        </el-form-item>
      </el-form>
      <div class="btn">
        <el-button @click="login(FormData)" class="btn">Login</el-button>
        <div>Forgot Password?</div>
      </div>
    </div>
    <!-- 登录盒子下半提醒部分 -->
    <div :class="{ containerBottom: errorMessage }">
      <!-- 提醒部分 密码或者姓名错了才显示-->
      <div v-if="errorMessage">Error:Invaild username or password</div>
      <!-- 提醒部分 表单检验失败就显示 -->
      <div v-if="requiredMessage">Error:Illegal username or password</div>
    </div>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  width: 310px;
  margin: auto;
  border: 1px solid grey;
  border-radius: 5px;
}

.title {
  width: 100%;
  padding: 30px;
  text-align: center;
}

.container-form {
  width: 100%;
  padding: 5px 20px;
}

.btn {
  width: 100%;
  padding: 0 20px;
}

.btn div {
  margin: 20px 0;
  font-size: 12px;
  text-align: right;
}

.containerBottom {
  border-top: 1px solid grey;
  padding: 20px;
  text-align: center;
}
</style>