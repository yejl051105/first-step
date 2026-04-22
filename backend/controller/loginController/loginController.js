const jwt = require("jsonwebtoken");
const { readUserList } = require("../userController/userController.js");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../../config/jwt");

exports.login = (req, res) => {
  try {
    const { username, pwd } = req.body || {};

    if (!username || !pwd) {
      return res.status(400).json({
        code: 400,
        message: "用户名和密码不能为空"
      });
    }

    const userlist = readUserList();
    // 因为设置了用户名不能重复 所以用这个来定位唯一的用户
    const currentUser = userlist.find((item) => item.username === username);

    if (!currentUser) {
      return res.status(404).json({
        code: 404,
        message: "用户名不存在"
      });
    }

    if (currentUser.pwd !== pwd) {
      return res.status(401).json({
        code: 401,
        message: "密码错误"
      });
    }

    const { pwd: _pwd, ...safeUser } = currentUser;
    const token = jwt.sign(
      {
        id: safeUser.id,
        username: safeUser.username,
        role: safeUser.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.json({
      code: 200,
      message: "登录成功",
      data: {
        token,
        userInfo: safeUser
      }
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "登录失败"
    });
  }
};
