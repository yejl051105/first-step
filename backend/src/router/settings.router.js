import { Router } from 'express'
import { getSettings, setNewSettings } from '../controller/settings.controller.js'

const router = Router()

router.get('/', getSettings)
router.post('/', setNewSettings)

export default router
