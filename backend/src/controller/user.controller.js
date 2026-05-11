const userService = require('../service/user.service')
const { success, error } = require('../utils/response')

exports.getAllUser = (req, res) => {
  try {
    const users = userService.getAll()
    success(res, users, '获取用户数据成功')
  } catch (err) {
    error(res, '获取用户数据失败')
  }
}

exports.deleteUser = (req, res) => {
  try {
    const deleted = userService.deleteById(req.params.id)
    if (!deleted) return error(res, '用户不存在', 404)
    success(res, deleted, '删除用户成功')
  } catch (err) {
    error(res, '删除用户失败')
  }
}

exports.addUser = (req, res) => {
  try {
    const result = userService.create(req.body)
    if (result.error) return error(res, result.error, 400)
    success(res, result, '新增用户成功', 201)
  } catch (err) {
    error(res, '新增用户失败', 400)
  }
}

exports.updateUser = (req, res) => {
  try {
    const updated = userService.update(req.params.id, req.body)
    if (!updated) return error(res, '用户不存在', 404)
    success(res, updated, '更新用户成功')
  } catch (err) {
    error(res, '更新用户失败', 400)
  }
}

exports.setNewUserList = (req, res) => {
  try {
    const result = userService.replaceAll(req.body)
    if (result.error) return error(res, result.error, 400)
    success(res, result, '设置用户数据成功', 201)
  } catch (err) {
    error(res, '设置用户数据失败')
  }
}
