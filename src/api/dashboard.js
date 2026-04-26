import userInstance from "@/api/request";
import { dashboardBaseURL } from "@/config/axios-baseURL";

export function getDashboardData() {
  return userInstance.get(dashboardBaseURL)
}