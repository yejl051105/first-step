import bcrypt from 'bcryptjs'
import * as userModel from '../model/user.model.js'

const SALT_ROUNDS = 10

export const getAll = () => {
  return userModel.readAll()
}

export const getById = (id) => {
  return userModel.findById(id)
}

export const getByUsername = (username) => {
  return userModel.findByUsername(username)
}

export const deleteById = (id) => {
  const users = userModel.readAll()
  const index = users.findIndex(item => item.id === Number(id))

  if (index === -1) return null

  const deleted = users.splice(index, 1)
  userModel.writeAll(users)
  return deleted[0]
}

export const create = async (userData) => {
  const users = userModel.readAll()

  // 如果重名则拒绝
  const exists = users.find(item => item.username === userData.username)
  if (exists) return { error: '用户名已存在' }

  if (!userData.id) {
    userData.id = Date.now()
  }

  if (userData.pwd) {
    userData.pwd = await bcrypt.hash(userData.pwd, SALT_ROUNDS)
  }

  users.push(userData)
  userModel.writeAll(users)
  return userData
}

export const update = async (id, userData) => {
  const users = userModel.readAll()
  const index = users.findIndex(item => item.id === Number(id))

  if (index === -1) return null

  if (userData.pwd) {
    userData.pwd = await bcrypt.hash(userData.pwd, SALT_ROUNDS)
  }

  users[index] = {
    ...users[index],
    ...userData,
    id: Number(id)
  }

  userModel.writeAll(users)
  return users[index]
}

export const replaceAll = (newUserList) => {
  if (!Array.isArray(newUserList)) return { error: '请求数据格式不正确' }

  userModel.writeAll(newUserList)
  return newUserList
}
