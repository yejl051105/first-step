const bcrypt = require('bcryptjs')
const userService = require('./user.service')
const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../utils/jwt')

const login = async (username, pwd) => {
  if (!username || !pwd) return { error: '用户名和密码不能为空' }

  const user = userService.getByUsername(username)
  if (!user) return { error: '用户名不存在' }

  const isMatch = await bcrypt.compare(pwd, user.pwd)
  if (!isMatch) return { error: '密码错误' }

  const { pwd: _pwd, ...safeUser } = user
  const token = jwt.sign(
    { id: safeUser.id, username: safeUser.username, role: safeUser.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )

  return { token, userInfo: safeUser }
}

module.exports = { login }
