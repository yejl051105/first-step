const userModel = require('../model/user.model')

const getAll = () => {
  return userModel.readAll()
}

const getById = (id) => {
  return userModel.findById(id)
}

const getByUsername = (username) => {
  return userModel.findByUsername(username)
}

const deleteById = (id) => {
  const users = userModel.readAll()
  const index = users.findIndex(item => item.id === Number(id))

  if (index === -1) return null

  const deleted = users.splice(index, 1)
  userModel.writeAll(users)
  return deleted[0]
}

const create = (userData) => {
  const users = userModel.readAll()

  // 如果重名则拒绝
  const exists = users.find(item => item.username === userData.username)
  if (exists) return { error: '用户名已存在' }

  if (!userData.id) {
    userData.id = Date.now()
  }

  users.push(userData)
  userModel.writeAll(users)
  return userData
}

const update = (id, userData) => {
  const users = userModel.readAll()
  const index = users.findIndex(item => item.id === Number(id))

  if (index === -1) return null

  users[index] = {
    ...users[index],
    ...userData,
    id: Number(id)
  }

  userModel.writeAll(users)
  return users[index]
}

const replaceAll = (newUserList) => {
  if (!Array.isArray(newUserList)) return { error: '请求数据格式不正确' }

  userModel.writeAll(newUserList)
  return newUserList
}

module.exports = { getAll, getById, getByUsername, deleteById, create, update, replaceAll }
