import express from 'express'
import cors from 'cors'
import { verifyToken } from './middleware/auth.middleware.js'

const app = express()

// 中间件
app.use(cors())
app.use(express.json())

// 路由
import loginRouter from './router/login.router.js'
import userRouter from './router/user.router.js'
import dashboardRouter from './router/dashboard.router.js'
import settingsRouter from './router/settings.router.js'

app.use('/api/login', loginRouter)
app.use('/api/users', verifyToken, userRouter)
app.use('/api/dashboard', verifyToken, dashboardRouter)
app.use('/api/settings', verifyToken, settingsRouter)

export { app }
