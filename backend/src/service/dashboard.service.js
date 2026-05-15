import { getAll } from './user.service.js'

export const getDashboardData = () => {
  const users = getAll()

  if (!Array.isArray(users)) return { error: '服务器错误，请稍后再试' }

  const userLength = users.length
  let activeUsersCount = 0
  let adminUsersCount = 0

  users.forEach(item => {
    if (item.status === 'Active') activeUsersCount++
    if (item.role === 'Admin') adminUsersCount++
  })

  return {
    userLength,
    activeUsersCount,
    adminUsersCount,
    inactiveUsersCount: userLength - activeUsersCount,
  }
}
