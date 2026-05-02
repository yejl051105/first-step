# Vue3 Admin System

基于 `Vue3 + Vite + Pinia + Element Plus + ECharts` 的前后端分离后台管理系统，后端使用 `Express + JWT` 提供接口鉴权，数据以本地 JSON 文件持久化。

## 项目简介

围绕"后台管理系统"这一典型业务场景，实现完整的登录鉴权 → 路由拦截 → 用户 CRUD → 数据看板 → 个人设置闭环：

- 登录页调用后端接口，返回 JWT 并写入 Pinia + localStorage
- Axios 请求拦截器自动注入 `Authorization: Bearer token`，响应拦截器收到 401 自动清空登录态并跳转登录页
- 路由守卫 `beforeEach` 校验 Token，无 Token 禁止访问后台页面
- 后端所有数据接口均经 JWT 中间件验证，未登录请求直接返回 401
- 用户管理支持模糊搜索、角色筛选、分页、新增/编辑/删除，含表单校验与权限限制
- Dashboard 通过后端统计接口返回总用户数/活跃/非活跃/管理员数量，ECharts 柱状图联动刷新
- 个人设置从后端读取当前用户资料，保存时写回后端并同步 Pinia，取消时从后端返回的当前的用户资料

## 技术栈

| 层 | 技术 |
|---|------|
| 框架 | Vue 3 (Composition API) |
| 构建 | Vite |
| 状态管理 | Pinia + pinia-plugin-persistedstate |
| 路由 | Vue Router |
| HTTP 客户端 | Axios（封装统一实例 + 请求/响应拦截器） |
| UI 组件库 | Element Plus |
| 图表 | ECharts |
| 后端 | Node.js + Express |
| 鉴权 | JWT（jsonwebtoken） |
| 数据存储 | 本地 JSON 文件 |

## 项目结构

```
first-step/
├── src/
│   ├── Login/                # 登录页
│   ├── Home/                 # 后台布局页（Header + 侧边栏 + RouterView）
│   ├── UserList/             # 用户管理页（搜索/筛选/分页/CRUD/权限控制）
│   ├── Dashboard/            # 数据看板页（4 张统计卡片 + ECharts 柱状图）
│   ├── Setting/              # 个人设置页（资料读取/编辑/重置）
│   ├── api/                  # 接口请求函数（auth/user/dashboard/settings）
│   ├── config/               # 环境配置（API 基础地址）
│   ├── request/              # Axios 实例 + 登录态存储工具
│   ├── router/               # 路由配置 + beforeEach 守卫
│   ├── stores/               # Pinia store
│   └── utils/                # 工具函数
├── backend/
│   ├── controller/           # 控制器（login/user/dashboard/settings）
│   ├── routes/               # 路由注册
│   ├── middleware/           # JWT 验证中间件
│   └── config/               # JWT 密钥与过期时间配置
└── README.md
```

## 本地运行

### 前置要求

Node.js >= 20.19.0

### 1. 安装依赖

```bash
# 前端
npm install

# 后端
cd backend && npm install
```

### 2. 启动后端

```bash
cd backend
npm start
```

后端运行在 `http://localhost:8080`

### 3. 启动前端

```bash
npm run dev
```

前端运行在 `http://localhost:5173`

## 演示账号

| 用户名 | 密码 | 角色 |
|--------|------|------|
| `ethan.clark` | `123123` | Admin |
| `emma.scott` | `123123` | User |

Admin 账号可体验完整权限（增删改所有用户），User 账号仅可编辑自身且无法删除用户。

## 接口清单

### 登录

| 方法 | 路径 | 说明 | JWT |
|------|------|------|-----|
| POST | `/api/login` | 用户名密码登录，返回 token + userInfo | — |

### 用户管理

| 方法 | 路径 | 说明 | JWT |
|------|------|------|-----|
| GET | `/api/users` | 获取全部用户列表 | ✅ |
| POST | `/api/users` | 新增用户 | ✅ |
| PUT | `/api/users/:id` | 编辑用户 | ✅ |
| DELETE | `/api/users/:id` | 删除用户 | ✅ |

### 数据看板

| 方法 | 路径 | 说明 | JWT |
|------|------|------|-----|
| GET | `/api/dashboard` | 获取统计数据（总数/活跃/非活跃/管理员） | ✅ |

### 个人设置

| 方法 | 路径 | 说明 | JWT |
|------|------|------|-----|
| GET | `/api/settings` | 获取当前用户的个人资料 | ✅ |
| POST | `/api/settings` | 保存个人资料 | ✅ |

## 鉴权流程

```
登录 → 后端签发 JWT → 前端存入 Pinia + localStorage
  │
  ▼
后续请求 → Axios 请求拦截器自动注入 Authorization: Bearer <token>
  │
  ▼
后端 JWT 中间件验证签名 → 有效则放行，无效/过期返回 401
  │
  ▼
前端响应拦截器捕获 401 → 清空登录态 → 跳转 /login
```

路由守卫 `beforeEach` 作为前端兜底：无 Token 时直接拦截页面访问，不发起请求。


## 页面展示

```
![登录页面](../vue3%20admin%20system/docs/01_登录页面.png)

![数据看板](../vue3%20admin%20system/docs/02_数据看板.png)

![用户列表](../vue3%20admin%20system/docs/03_用户列表.png)

![设置资料](../vue3%20admin%20system/docs/04_设置资料.png)

![权限管理1](../vue3%20admin%20system/docs/05_权限管理1.png)

![权限管理2](../vue3%20admin%20system/docs/05_权限管理2.png)

![权限管理3](../vue3%20admin%20system/docs/05_权限管理3.png)
```