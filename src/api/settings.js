import axios from "axios";
import { settingsBaseURL } from "@/config/axios-baseURL";

export const getSettings = () => {
  return axios.get(settingsBaseURL)
}

export const setNewSettings = (loginForm) => {
  return axios.post(settingsBaseURL, loginForm)
}