import { ref } from 'vue'

const readLoginUserFromStorage = () => {
  const loginUser = localStorage.getItem('loginUser')
  const parsedLoginUser = loginUser ? JSON.parse(loginUser) : []
  return parsedLoginUser[0] ?? null
}

export const loginUserState = ref(readLoginUserFromStorage())

// 从本地获取用户列表数据
export function getUserList(userList) {
  // 获取用户数据先从本地获取 
  const localUserList = localStorage.getItem("userList")

  // 如果本地用户数据是被删除为空数组
  if (Array.isArray(localUserList) && localUserList.length === 0) {
    return []
  }

  // 如果本地获取不到用户数据 就设置用户数据
  if (!localUserList) {
    setUserList(userList)
    return JSON.parse(localStorage.getItem("userList"))
  }

  // 如果本地获取到了用户数据 直接返回
  return JSON.parse(localStorage.getItem("userList"))
}

// 更新用户列表数据到本地
export function setUserList(userList, isUpdate) {
  // 如果是更新资料的时候设置本地用户数据
  if (isUpdate) {
    let currentUserList = JSON.parse(localStorage.getItem('userList'))
    const newUserid = userList.id
    const newUserIndex = currentUserList.findIndex(item => item.id === newUserid)
    const newUser = Object.assign(currentUserList[newUserIndex], userList)
    currentUserList.splice(newUserIndex, 1, newUser)
    return localStorage.setItem("userList", JSON.stringify(currentUserList))
  }

  return localStorage.setItem("userList", JSON.stringify(userList))
}

// 计算active用户数量和inactive用户数量
export const caculateStatus = (userlist, totalLength) => {
  let activeUsers = 0
  let inActiveUsers = 0
  userlist.forEach(item => {
    // 计算active用户
    if (item.status === 'Active') {
      ++activeUsers
    }
  })
  // 计算inactive用户
  inActiveUsers = length.value - activeUsers
  return activeUsers
}

// 计算管理员用户数量
export const caculateAdmins = (userlist, length) => {
  let adminUsers = 0
  userlist.forEach((item) => {
    if (item.role === "Admin") {
      ++adminUsers
    }
  })
  return adminUsers
}

// 记录当前登录的用户
export const recordUser = (currentUser) => {
  const nextLoginUser = { ...currentUser }
  loginUserState.value = nextLoginUser
  return localStorage.setItem("loginUser", JSON.stringify([nextLoginUser]))
}

// 更新当前个人资料设置
export const updateSettings = (SettingsForm) => {
  const nextSettings = { ...SettingsForm }
  recordUser(nextSettings)  
  setUserList(nextSettings, true)
}

// 退出登录 清除当前登录的用户和登录凭证
export const logout = () => {
  loginUserState.value = null
  localStorage.removeItem('loginUser')
  localStorage.removeItem("Token")
}

// 获取当前登录的用户
export const getLoginUser = () => {
  return loginUserState.value ? [{ ...loginUserState.value }] : []
}
