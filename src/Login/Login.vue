<script setup>
import { getUserList } from "@/api/handleUserList"
import { userList } from "@/mock/table_list"
import router from "@/router"
import { ElMessage } from "element-plus"
import 'element-plus/es/components/message/style/css'
import { ref, reactive } from "vue"

// 获取表单实例
const FormRef = ref()

// 获取本地存储的用户数据 用来判断密码和账号是否正确
const userlist = getUserList(userList)

// 假的token 因为我们还没写后端
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkbWluIiwiaWF0IjoxNTE2MjM5MDIyfQ.qS8B_p7rX9jXv-Bq3u_Lp9qG_uP9M_fW8B_p7rX9jXv'

// 表单绑定
const FormData = ref({
  username: '',
  password: ''
})

// 防抖函数
function debounce(fn, delay = 300) {
  let timer = null
  return function (...args) {
    if (timer != null) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(() => {
      fn.call(this, ...args)
    }, delay);
  }
}

// 登录事件
const login = async (FormData) => {
  // 获取不到表单元素 防止报错
  if (!FormRef.value) return
  try {
    // 表单校验
    await FormRef.value.validate()
  } catch (error) {
    return
  }

  // 姓名或密码错误 登录失败
  for (let i = 0; i <= userlist.length; i++) {
    // 如果有一个匹配的账号和密码 就直接退出循环 进入登录成功的后续程序
    if (i === userlist.length) {
      ElMessage.error('姓名或密码错误,请重新输入')
      FormData.username = FormData.password = ''
      return
    }
    if (FormData.username === userlist[i].username && FormData.password === userlist[i].pwd) break
  }

  // 登录成功
  FormData.username = FormData.password = ''
  ElMessage({
    message: "登录成功,即将跳转首页",
    type: "success",
    placement: "top"
  })
  // 把token登录凭证存入本地
  if (!localStorage.getItem('Token')) {
    localStorage.setItem("Token", token)
    console.log(222)
  }
  setTimeout(() => {
    router.push('/home')
  }, 1000)
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
          <el-button @click="login(FormData)" class="btn">Login</el-button>
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
}

.container {
  width: 310px;
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

.el-form-item {
  padding-top: 15px;
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
</style>