import userInstance, { apiConfig } from "@/api/request";

export const getSettings = () => {
  return userInstance.get(apiConfig.settingsBaseURL)
}

export const setNewSettings = (loginForm) => {
  return userInstance.post(apiConfig.settingsBaseURL, loginForm)
}