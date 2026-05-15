import axios from "axios";

const API_HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8080'
const apiBaseURL = `${API_HOST}/api`

export const apiConfig = {
  loginBaseURL: `${apiBaseURL}/login`,
  userBaseURL: `${apiBaseURL}/users`,
  settingsBaseURL: `${apiBaseURL}/settings`,
  dashboardBaseURL: `${apiBaseURL}/dashboard`,
}

const STORE_KEY = 'user'

function getToken() {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (!raw) return null
    return JSON.parse(raw).token || null
  } catch {
    return null
  }
}

const userInstance = axios.create({
  baseURL: apiConfig.userBaseURL,
  timeout: 10000
});

userInstance.interceptors.request.use(function (config) {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

userInstance.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if (error.response?.status === 401) {
    localStorage.removeItem(STORE_KEY)

    if (window.location.pathname !== "/login") {
      window.location.href = "/login"
    }
  }

  return Promise.reject(error);
});

export default userInstance
