import * as loginService from '../service/login.service.js'
import { success, error } from '../utils/response.js'

export const login = async (req, res) => {
  try {
    const { username, pwd } = req.body || {}
    const result = await loginService.login(username, pwd)

    if (result.error) {
      const statusCode = result.error === '用户名不存在' ? 404 :
        result.error === '密码错误' ? 401 : 400
      return error(res, result.error, statusCode)
    }

    success(res, result, '登录成功')
  } catch (err) {
    error(res, '登录失败')
  }
}
