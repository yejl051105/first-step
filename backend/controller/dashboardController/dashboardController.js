const { readUserList } = require("../userController/userController")

exports.getDashboardData = (req, res) => {
  // 获取用户数据
  const userList = readUserList()

  if (userList && Array.isArray(userList)) {
    // 获取用户总数
    const userLength = userList.length

    let activeUsersCount = 0
    let adminUsersCount = 0

    userList.forEach(item => {
      // 统计活跃用户数量
      if (item.status === "Active") activeUsersCount++

      // 统计管理员用户数量
      if (item.role === "Admin") adminUsersCount++
    })

    // 统计非活跃用户数量
    let inactiveUsersCount = userLength - activeUsersCount

    return res.status(200).json({
      code: 200,
      message: "获取看板数据成功",
      data: {
        userLength,
        activeUsersCount,
        adminUsersCount,
        inactiveUsersCount
      }
    })

  }

  // 如果不是数组或者没有数据就返回服务器错误
  if (!userList || !Array.isArray(userList)) {
    return res.status(500).json({
      code: 500,
      message: "服务器错误，请稍后再试"
    })
  }
}