import userInstance from "@/api/request";

// 注意返回的都是 "promise"
// 设置新的用户数据
export function setNewUser(newUserListArray) {
  return userInstance.post("/newUserList", newUserListArray)
}

// 查找所有用户数据
export function getAllUser() {
  return userInstance.get("/")
}

// 更新某个用户数据
export function updateUser(id, newUser) {
  return userInstance.put(`/${id}`, newUser)
}

// 删除某个用户数据
export function deleteUser(id) {
  return userInstance.delete(`/${id}`)
}

// 添加新用户
export function addNewUser(newUser) {
  return userInstance.post('/', newUser)
}
