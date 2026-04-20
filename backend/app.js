const express = require('express');
const cors = require('cors');
const app = express();

// 中间件配置
app.use(cors()); // 允许跨域，前端才能调通
app.use(express.json()); // 解析前端发来的 JSON

// 引入路由文件
const userRoutes = require("./routes/userRoutes");

// 挂载路由到（设置api统一前缀）
app.use("/api/users",userRoutes)

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`API Server 运行在 http://localhost:${PORT}/api/users`);
});
