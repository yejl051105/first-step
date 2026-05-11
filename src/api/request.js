import axios from "axios";
import { clearAuthStorage, getAccessToken } from "@/utils/storage";

const API_HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8080'
const apiBaseURL = `${API_HOST}/api`

export const apiConfig = {
  loginBaseURL: `${apiBaseURL}/login`,
  userBaseURL: `${apiBaseURL}/users`,
  settingsBaseURL: `${apiBaseURL}/settings`,
  dashboardBaseURL: `${apiBaseURL}/dashboard`,
}

const userInstance = axios.create({
  baseURL: apiConfig.userBaseURL,
  timeout: 10000
});

userInstance.interceptors.request.use(function (config) {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

userInstance.interceptors.response.use(function (response) {
  return response;
  // 如果网络响应的状态码不是2开头的 就会进入失败的回调
}, function (error) {
  // 401是没有权限
  if (error.response?.status === 401) {
    clearAuthStorage()

    // 如果不是在登录页面就返回到登录页面
    if (window.location.pathname !== "/login") {
      window.location.href = "/login"
    }
  }

  return Promise.reject(error);
});

export default userInstance
