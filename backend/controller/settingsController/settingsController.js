const fs = require("fs")
const { SETTINGS_PATH } = require("../../config/path")

// 设置新的个人资料信息
exports.setNewSettings = (req, res) => {
  try {
    // 根据前端的登录信息表单 获取到个人资料需要的信息
    const { username, email, role, profile, status, id } = req.body
    const newSettingsInfo = { username, email, role, profile, status, id }

    // 写入到settings.json文件的时候需要先转换为JSON字符串才行
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(newSettingsInfo, null, 2))
    res.status(200).json({
      code: 200,
      message: '设置个人资料信息成功',
      data: newSettingsInfo
    })
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "服务器错误"
    })
  }
}

// 读取当前的个人资料信息
exports.getSettings = (req, res) => {
  try {
    // 先获取到文件内的个人资料信息
    const fileContent = fs.readFileSync(SETTINGS_PATH, "utf-8")

    // 解析文件内容 因为你写入的时候是JSON字符串 所以你读取文件的内容也是JSON字符串 想要进行正确的操作 就必须先把JSON字符串解析了
    const realFileContent = JSON.parse(fileContent)
    
    // 返回给前端获取到的个人资料设置数据
    res.status(200).json({
      code: 200,
      message: '获取个人资料信息成功',
      data: realFileContent
    })
  } catch (error) {
    res.status(500).json({
      code: 50,
      message: "获取个人资料信息失败"
    })
  }
}