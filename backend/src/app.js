const express = require('express')
const cors = require('cors')
const { verifyToken } = require('./middleware/auth.middleware')

const app = express()

// 中间件
app.use(cors())
app.use(express.json())

// 路由
const loginRouter = require('./router/login.router')
const userRouter = require('./router/user.router')
const dashboardRouter = require('./router/dashboard.router')
const settingsRouter = require('./router/settings.router')

app.use('/api/login', loginRouter)
app.use('/api/users', verifyToken, userRouter)
app.use('/api/dashboard', verifyToken, dashboardRouter)
app.use('/api/settings', verifyToken, settingsRouter)

module.exports = app
