import bcrypt from 'bcryptjs'
import { getByUsername } from './user.service.js'
import jwt from 'jsonwebtoken'
import { JWT_SECRET, JWT_EXPIRES_IN } from '../utils/jwt.js'

export const login = async (username, pwd) => {
  if (!username || !pwd) return { error: '用户名和密码不能为空' }

  const user = getByUsername(username)
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
