import axios from "axios";
import { baseURL } from "@/config/axios-baseURL";

const userInstance = axios.create({
  baseURL,
  timeout: 5000
});

// 添加请求拦截器
userInstance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const token = localStorage.getItem("token")
  // 如果 token 存在 需要存储在请求头中
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添全局加响应拦截器 不只是这个用户实例 而是全部axios实例都可以
axios.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么 
  // 这样以后就不用再麻烦的写 res.data.data 写两个data了
  return response.data;
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(error);
});

export default userInstance