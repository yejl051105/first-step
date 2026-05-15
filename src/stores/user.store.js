import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getAllUser } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  const loginUser = ref(null)
  const token = ref(null)
  const userlist = ref(null)

  const sanitizeLoginUser = (currentLoginUser) => {
    if (!currentLoginUser) return null
    const { pwd: _pwd, ...safeLoginUser } = currentLoginUser
    return safeLoginUser
  }

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

  function setUserList(newUserListArray) {
    userlist.value = Array.isArray(newUserListArray) ? newUserListArray : []
    return userlist.value
  }

  function syncUserInList(updatedUser) {
    if (!updatedUser || !Array.isArray(userlist.value)) return
    const targetIndex = userlist.value.findIndex((item) => item.id === updatedUser.id)
    if (targetIndex === -1) return
    userlist.value.splice(targetIndex, 1, updatedUser)
  }

  function setToken(newToken) {
    token.value = newToken
  }

  function removeToken() {
    token.value = null
  }

  function setLoginUser(newLoginUser) {
    loginUser.value = sanitizeLoginUser(newLoginUser)
  }

  function removeLoginUser() {
    loginUser.value = null
  }

  function clearAuth() {
    removeToken()
    removeLoginUser()
  }

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
}, {
  persist: {
    pick: ['token', 'loginUser'],
  }
})
