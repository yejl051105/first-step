const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/jwt");

exports.verifyToken = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        code: 401,
        message: "未登录或登录已过期"
      });
    }

    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      code: 401,
      message: "无效的登录凭证"
    });
  }
};
