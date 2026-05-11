const dashboardService = require('../service/dashboard.service')
const { success, error } = require('../utils/response')

exports.getDashboardData = (req, res) => {
  try {
    const data = dashboardService.getDashboardData()
    if (data.error) return error(res, data.error)
    success(res, data, '获取看板数据成功')
  } catch (err) {
    error(res, '获取看板数据失败')
  }
}
