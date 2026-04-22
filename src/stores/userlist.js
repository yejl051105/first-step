import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getAllUser, setNewUser } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  // 当前登录的用户
  const loginUser = ref(null)

  // 登录凭证 token
  const token = ref(null)

  // 初始的用户列表数据
  const userlist = ref(null)

  // action方法都是用来修改state和getter数据的 很多时候都是更新和删除这个states和getter的值用的
  // 很少用来获取states和getter 因为可以直接用states和getter获取值

  // 获取用户数据数组
  async function getUserList() {
    try {
      const res = await getAllUser()
      userlist.value = res.data.data
      return userlist.value
    } catch (error) {
      console.log("获取用户数据数组失败")
    }
  }

  // 设置新的用户列表数据
  async function setUserList(newUserListArray) {
    try {
      const res = await setNewUser(newUserListArray)
      // 设置了新的用户列表数据 那么要重新设置userlist的值
      userlist.value = res.data.data
    } catch (error) {
      return console.log("设置新的用户数据数组失败")
    }
  }

  // 设置新的token
  function setToken(newToken) {
    // 设置新的登录态
    token.value = newToken
  }

  // 删除原来的旧token
  function removeToken() {
    // 清空token的值 同时本地存储会删除token
    token.value = null
  }

  // 登录成功时候 设置一下登录的用户信息
  function setLoginUser(newLoginUser) {
    loginUser.value = newLoginUser
  }

  //退出登录的时候 设置登录的用户信息为null
  function removeLoginUser() {
    loginUser.value = null
  }

  // 暴露出去 才能在外部使用
  return {
    userlist,
    token,
    loginUser,
    getUserList,
    setUserList,
    setToken,
    removeToken,
    setLoginUser,
    removeLoginUser
  }
},
  {
    persist: true
  })