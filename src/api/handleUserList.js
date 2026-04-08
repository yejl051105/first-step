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

// 存储用户列表数据到本地
export function setUserList(userList) {
  localStorage.setItem("userList", JSON.stringify(userList))
}

