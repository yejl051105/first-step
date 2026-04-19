import { defineStore } from 'pinia'
import { userList } from '@/mock/table_list'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 当前登录的用户
  const loginUser = ref(null)

  // 登录凭证 token
  const token = ref(null)

  // 初始的用户列表数据
  const userlist = ref(null)

  // action方法都是用来修改state和getter数据的 很多时候都是更新和删除这个states和getter的值用的
  // 很少用来获取states和getter 因为可以直接用states和getter获取值

  // 获取当前的用户列表数据
  function getUserList() {
    return userlist.value
  }

  // 设置新的用户列表数据
  function setUserList(newUserList = null) {
    // 先判断当前userlist.value是否有值 如果没有就使用mock的数据
    if (!userlist.value) userlist.value = userList
    else if (!newUserList && userlist.value) {
      // 如果没有传参数进来 而且这个userlist.value还有值 那么就使用原来的userlist的值
      return
    }
    else if (newUserList) {
      // 如果传递了参数进来 就是更新userlist.value的值 
      userlist.value = newUserList
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