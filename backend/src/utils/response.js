const success = (res, data, message = '操作成功', statusCode = 200) => {
  return res.status(statusCode).json({ code: statusCode, message, data })
}

const error = (res, message = '服务器错误', statusCode = 500) => {
  return res.status(statusCode).json({ code: statusCode, message })
}

module.exports = { success, error }
