import { Router } from 'express'
import { getDashboardData } from '../controller/dashboard.controller.js'

const router = Router()

router.get('/', getDashboardData)

export default router
