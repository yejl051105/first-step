# Vue3 Admin System

一个基于 `Vue3 + Vite + Pinia + Element Plus + ECharts + Express + JWT` 的前后端分离后台管理系统项目。

## 项目简介

本项目围绕“后台管理系统”这一典型业务场景实现了完整的基础链路：

- 登录鉴权
- 路由拦截
- 用户列表展示
- 搜索筛选与分页
- 用户新增、编辑、删除
- 个人资料编辑
- 数据看板统计
- 前后端接口联调

前端负责页面交互、状态管理、请求封装与可视化展示；后端提供登录认证、JWT 鉴权以及用户数据的增删改查接口。

## 技术栈

### 前端

- Vue 3
- Vite
- Pinia
- Vue Router
- Axios
- Element Plus
- ECharts

### 后端

- Node.js
- Express
- JWT
- 本地 JSON 文件模拟数据持久化

## 核心功能

### 1. 登录鉴权

- 基于用户名和密码完成登录校验
- 登录成功后由后端签发 JWT
- 前端保存登录态，并在请求拦截器中自动携带 `Authorization: Bearer token`
- 未登录用户访问受保护页面时，路由守卫会拦截并跳转到登录页

### 2. 用户管理

- 支持用户列表展示
- 支持按用户名/邮箱模糊搜索
- 支持按角色筛选
- 支持分页浏览
- 支持新增、编辑、删除用户
- 对普通用户增加了权限限制，只能编辑自身，不能删除当前登录用户

### 3. 个人设置

- 当前登录用户可以修改个人基础信息
- 保存后会同步更新后端数据和前端状态

### 4. 可视化看板

- 基于 ECharts 展示总用户数、活跃用户数、非活跃用户数、管理员数量
- 用户数据变化后图表会同步刷新

## 项目亮点

- 采用前后端分离开发方式，前端通过 Axios 调用 Express 接口完成联调
- 使用 Pinia 管理登录用户与用户列表状态
- 封装请求拦截器统一注入 JWT，提升接口调用一致性
- 使用路由守卫控制页面访问权限，形成基础权限链路
- 通过本地 JSON 模拟数据库，完成了完整的 CRUD 业务闭环
- 对管理台常见场景做了完整拆分，包括登录、列表、表单、弹窗、可视化和设置页

## 项目结构

```text
first-step/
├── src/
│   ├── Login/              # 登录页
│   ├── Home/               # 后台布局页
│   ├── UserList/           # 用户管理页
│   ├── Dashboard/          # 数据看板页
│   ├── Setting/            # 个人设置页
│   ├── api/                # 接口请求封装
│   ├── request/            # axios 实例与登录态存储
│   ├── router/             # 路由与权限控制
│   └── stores/             # Pinia 状态管理
├── backend/
│   ├── controller/         # 控制器层
│   ├── routes/             # 路由层
│   ├── middleware/         # JWT 鉴权中间件
│   └── config/             # JWT 配置
└── README.md
```

## 本地运行

### 1. 安装前端依赖

```bash
npm install
```

### 2. 安装后端依赖

```bash
cd backend
npm install
```

### 3. 启动后端服务

```bash
cd backend
npm run dev
```

后端默认地址：

```text
http://localhost:8080
```

### 4. 启动前端项目

```bash
npm run dev
```

前端默认地址：

```text
http://localhost:5173
```

## 演示账号

可以使用以下测试账号进行登录：

- 用户名：`ethan.clark`
- 密码：`123123`

## 已实现接口

### 登录接口

- `POST /api/login`

### 用户接口

- `GET /api/users`
- `POST /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`
- `POST /api/users/newUserList`

## 简历描述参考

### 简历项目描述版本

- 基于 `Vue3 + Vite + Pinia + Element Plus + ECharts` 搭建后台管理系统，独立完成登录鉴权、路由守卫、用户管理、搜索筛选、分页展示、个人信息编辑和数据可视化模块。
- 使用 `Axios` 封装请求层并联调 `Express + JWT` 后端接口，实现用户信息增删改查、登录态校验以及前后端分离开发。
- 使用 Pinia 管理登录用户与用户列表状态，结合表单校验、弹窗交互和权限限制，提升后台系统的可维护性和交互完整性。

## 面试可讲点

- 为什么选择 Pinia 而不是组件内层层传值
- 登录成功后 token 如何保存、请求如何统一携带
- 路由守卫如何拦截未登录访问
- 用户列表页的搜索、筛选、分页是如何组织数据流的
- 设置页保存后为什么既要更新后端，也要同步更新本地登录用户状态
- 为什么用 JSON 文件模拟数据库，以及这种方案的优缺点

## 后续可优化方向

- 接入 refresh token，实现 access token 过期后的无感刷新
- 将 JWT 密钥迁移到环境变量配置
- 增加接口异常兜底与全局错误提示
- 拆分更细粒度的角色权限控制
- 增加单元测试与组件测试
