// 获取本地数据（类似数据库）
let userlist = require("../userData/userData")

// 获取用户的数据
exports.getALlUser = (req, res) => {
  res.json({
    code: 200,
    data: userlist,
    message: '获取用户数据成功'
  })
}

// 删除用户数据
exports.deleteUser = (req, res) => {
  try {
    // 获取删除用户的id
    // 因为req是url地址 获取的id是字符串类型的 所以需要先转换成数字类型的id
    const deleteUserId = Number(req.params.id)
    // 删除用户数据（模拟数据库操作）
    // 先找到删除的用户的索引
    const deleteUserIndex = userlist.findIndex(item => item.id === deleteUserId)
    // 要删除的用户
    const deleteUser = userlist[deleteUserIndex]
    if (deleteUserIndex !== -1) {
      userlist.splice(deleteUserIndex, 1)
    } else {
      throw new error("用户不存在")
    }
    res.json({
      code: 200,
      message: '删除用户成功',
      data: deleteUser
    })
  } catch (error) {
    res.json({
      code: 500,
      message: '删除用户失败',
    })
  }
}

// 新增用户数据
exports.addUser = (req, res) => {
  try {
    const newUser = req.body
    userlist.push(newUser)
    res.json({
      code: 201,
      message: '新增用户成功',
      data: newUser
    })
  } catch (error) {
    res.json({
      code: 400,
      message: '新增用户失败'
    })
  }

}

// 更新用户数据
exports.updateUser = (req, res) => {
  try {
    // 获取到更新的用户的id
    const updateUserId = Number(req.params.id)
    // 找到这个需要更新的用户在userlist的索引位置
    const updateUserIndex = userlist.findIndex(item => item.id === updateUserId)
    // 先判断能否找到这个用户
    if (updateUserIndex === -1) {
      return res.json({
        code: 404,
        message: '该用户资源不存在,无法进行更新'
      })
    }
    // 删除原来索引上的用户 并且更新为新的用户数据
    userlist[updateUserIndex] = {
      ...userlist[updateUserIndex],
      ...req.body,
      id: updateUserId // 防止 req.body 中带有的 id 篡改原始 id
    }
    res.json({
      code: 200,
      message: '更新用户成功',
      data: userlist[updateUserIndex]
    })
  } catch (error) {
    res.json({
      code: 400,
      message: '更新用户失败'
    })
  }
}

// 设置新的用户数据
exports.setNewUserList = (req, res) => {
  try {
    const newUserListArray = req.body
    if (newUserListArray) {
      userlist.splice(0, userlist.length, ...newUserListArray)
      console.log(userlist)
      res.json({
        code: 201,
        message: "设置新的用户数据成功",
        data: newUserListArray
      })
    }
  } catch (error) {
    res.json({
      code: 500,
      message: "设置新的用户数据失败"
    })
  }
}