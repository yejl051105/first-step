import userInstance from "@/api/request";
import { settingsBaseURL } from "@/config/axios-baseURL";

export const getSettings = () => {
  return userInstance.get(settingsBaseURL)
}

export const setNewSettings = (loginForm) => {
  return userInstance.post(settingsBaseURL, loginForm)
}