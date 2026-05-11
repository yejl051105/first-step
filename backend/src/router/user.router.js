const express = require('express')
const router = express.Router()
const { getAllUser, deleteUser, addUser, updateUser, setNewUserList } = require('../controller/user.controller')

router.get('/', getAllUser)
router.delete('/:id', deleteUser)
router.post('/', addUser)
router.put('/:id', updateUser)
router.post('/newUserList', setNewUserList)

module.exports = router
