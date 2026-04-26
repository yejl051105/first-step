// __API_HOST__ 由 vite.config.js 的 define 在构建时注入
// 生产环境 → Render 后端地址，开发环境 → localhost:8080
const API_HOST = __API_HOST__

export const apiBaseURL = `${API_HOST}/api`
export const userBaseURL = `${apiBaseURL}/users`
export const loginBaseURL = `${apiBaseURL}/login`
export const settingsBaseURL = `${apiBaseURL}/settings`
export const dashboardBaseURL = `${apiBaseURL}/dashboard`

export const baseURL = userBaseURL
