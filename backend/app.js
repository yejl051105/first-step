const express = require('express');
const cors = require('cors');
const app = express();
const { verifyToken } = require("./middleware/authMiddleware");

// 中间件配置
app.use(cors()); // 允许跨域，前端才能调通
app.use(express.json()); // 解析前端发来的 JSON

// 引入路由文件
const loginRoutes = require("./routes/loginRoutes")
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes")
// const settingsRoutes = require("./routes/settingsRoutes")

// 挂载路由到（设置api统一前缀）
app.use("/api/login", loginRoutes)
app.use("/api/users", verifyToken, userRoutes)
app.use("/api/dashboard", dashboardRoutes)
// app.use("/api/settings", settingsRoutes)

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`API Server 运行在 http://localhost:${PORT}/api/users`);
});
