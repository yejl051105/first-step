import { Router } from 'express'
import { getAllUser, deleteUser, addUser, updateUser, setNewUserList } from '../controller/user.controller.js'

const router = Router()

router.get('/', getAllUser)
router.delete('/:id', deleteUser)
router.post('/', addUser)
router.put('/:id', updateUser)
router.post('/newUserList', setNewUserList)

export default router
