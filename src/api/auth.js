import axios from "axios";
import { apiConfig } from "@/api/request";

export function loginByPassword(payload) {
  return axios.post(apiConfig.loginBaseURL, payload); // 注意这里暴露的是axios请求 不是user实例请求了 因为登录页面谁都能够访问 不需要看有没有登录 即是否存在了token
}
