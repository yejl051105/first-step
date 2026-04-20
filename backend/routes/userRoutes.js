const express = require("express")
const router = express.Router()
const { getALlUser, deleteUser, addUser, updateUser } = require("../controller/userController/userController")

// 获取用户数据
router.get('/', getALlUser)

// 删除用户数据
router.delete('/:id', deleteUser)

// 新增用户数据
router.post('/',addUser)

// 更新用户数据
router.put('/:id',updateUser)

module.exports = router

