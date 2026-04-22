import axios from "axios";
import { loginBaseURL } from "@/config/axios-baseURL";

export function loginByPassword(payload) {
  return axios.post(loginBaseURL, payload);
}
