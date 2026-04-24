import { dashboardBaseURL } from "@/config/axios-baseURL";
import axios from "axios";

export function getDashboardData() {
  return axios.get(dashboardBaseURL)
}