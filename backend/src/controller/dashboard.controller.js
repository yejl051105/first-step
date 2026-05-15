import * as dashboardService from '../service/dashboard.service.js'
import { success, error } from '../utils/response.js'

export const getDashboardData = (req, res) => {
  try {
    const data = dashboardService.getDashboardData()
    if (data.error) return error(res, data.error)
    success(res, data, '获取看板数据成功')
  } catch (err) {
    error(res, '获取看板数据失败')
  }
}
