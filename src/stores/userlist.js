import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getAllUser } from '@/api/user'
import {
  getAccessToken,
  getStoredLoginUser,
  removeAccessToken,
  removeStoredLoginUser,
  setAccessToken,
  setStoredLoginUser
} from '@/request/auth-storage'

export const useUserStore = defineStore('user', () => {
  // 当前登录的用户
  const loginUser = ref(getStoredLoginUser())

  // 登录凭证 token
  const token = ref(getAccessToken())

  // 初始的用户列表数据
  const userlist = ref(null)

  // 用来排除前端输入的密码字段
  const sanitizeLoginUser = (currentLoginUser) => {
    if (!currentLoginUser) return null

    const { pwd: _pwd, ...safeLoginUser } = currentLoginUser
    return safeLoginUser
  }

  // action方法都是用来修改state和getter数据的 很多时候都是更新和删除这个states和getter的值用的
  // 很少用来获取states和getter 因为可以直接用states和getter获取值

  // 获取用户数据数组
  async function getUserList() {
    try {
      const res = await getAllUser()
      userlist.value = Array.isArray(res.data.data) ? res.data.data : []
      return userlist.value
    } catch (error) {
      console.log("获取用户数据数组失败")
      return null
    }
  }

  // 设置新的用户列表数据
  function setUserList(newUserListArray) {
    userlist.value = Array.isArray(newUserListArray) ? newUserListArray : []
    return userlist.value
  }

  // 同步某一位用户到本地列表
  function syncUserInList(updatedUser) {
    if (!updatedUser || !Array.isArray(userlist.value)) return

    const targetIndex = userlist.value.findIndex((item) => item.id === updatedUser.id)
    if (targetIndex === -1) return

    userlist.value.splice(targetIndex, 1, updatedUser)
  }

  // 设置新的token
  function setToken(newToken) {
    // 设置新的登录态
    token.value = newToken
    setAccessToken(newToken)
  }

  // 删除原来的旧token
  function removeToken() {
    // 清空token的值 同时本地存储会删除token
    token.value = null
    removeAccessToken()
  }

  // 登录成功时候 设置一下登录的用户信息
  function setLoginUser(newLoginUser) {
    const safeLoginUser = sanitizeLoginUser(newLoginUser)
    loginUser.value = safeLoginUser

    if (safeLoginUser) {
      setStoredLoginUser(safeLoginUser)
    } else {
      removeStoredLoginUser()
    }
  }

  //退出登录的时候 设置登录的用户信息为null
  function removeLoginUser() {
    loginUser.value = null
    removeStoredLoginUser()
  }

  function clearAuth() {
    removeToken()
    removeLoginUser()
  }

  // 暴露出去 才能在外部使用
  return {
    userlist,
    token,
    loginUser,
    getUserList,
    setUserList,
    syncUserInList,
    setToken,
    removeToken,
    setLoginUser,
    removeLoginUser,
    clearAuth
  }
})
