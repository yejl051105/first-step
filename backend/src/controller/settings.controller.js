import * as settingsService from '../service/settings.service.js'
import { success, error } from '../utils/response.js'

export const getSettings = (req, res) => {
  try {
    const data = settingsService.getSettings()
    if (!data) return error(res, '获取个人资料信息失败', 500)
    success(res, data, '获取个人资料信息成功')
  } catch (err) {
    error(res, '获取个人资料信息失败')
  }
}

export const setNewSettings = (req, res) => {
  try {
    const data = settingsService.setSettings(req.body)
    success(res, data, '设置个人资料信息成功')
  } catch (err) {
    error(res, '服务器错误')
  }
}
