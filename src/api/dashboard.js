import userInstance, { apiConfig } from "@/api/request";

export function getDashboardData() {
  return userInstance.get(apiConfig.dashboardBaseURL)
}