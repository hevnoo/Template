const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  // 从请求头或查询参数或 Cookie 中获取 Token
  const token =
    req.headers.authorization || req.query.token || req.cookies.token;

  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  try {
    // 验证并解码 Token
    const decoded = jwt.verify(token, "your-secret-key");

    // 在 req 对象中添加解码后的 Token 数据，以便后续的路由处理函数使用
    req.user = decoded;

    next(); // 继续执行下一个中间件或路由处理函数
  } catch (err) {
    res.status(401).send("Invalid Token");
  }
}

module.exports = {
  verifyToken,
};
