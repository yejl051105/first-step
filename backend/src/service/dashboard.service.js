const userService = require('./user.service')

const getDashboardData = () => {
  const users = userService.getAll()

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

module.exports = { getDashboardData }
