import axios from "axios";
import { baseURL } from "@/config/axios-baseURL";
import { clearAuthStorage, getAccessToken } from "@/request/auth-storage";

const userInstance = axios.create({
  baseURL,
  timeout: 5000
});

// 添加请求拦截器
userInstance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const token = getAccessToken()
  // 如果 token 存在 需要存储在请求头中的token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

userInstance.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if (error.response?.status === 401) {
    clearAuthStorage()

    if (window.location.pathname !== "/login") {
      window.location.href = "/login"
    }
  }

  return Promise.reject(error);
});

export default userInstance
