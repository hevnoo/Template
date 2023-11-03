//* utils/useJWT.js
//用于中间件
const jwt = require("jsonwebtoken");
const { PWD_SALT, PRIVATE_KEY, EXPIRESD, refresh_time } = require("./constant");

//生成token
let setToken = function (username) {
  //expiresIn:过期时间
  let token = jwt.sign({ username }, PRIVATE_KEY, { expiresIn: EXPIRESD });
  let refreshToken = jwt.sign({ username }, PRIVATE_KEY, {
    expiresIn: refresh_time,
  });
  return { token, refreshToken };
  //颁发access-token时同时颁发一个refresh-token，唯一区别是refresh-token有效期比较长，比如2天。
  //当access-token过期后，拿着refresh-token到后台换取新的access-token。
};

//token验证： 使用中间件对请求进行拦截获取请求头的token
let verifyToken = async (token) => {
  return await jwt.verify(
    token.split(" ")[1],
    PRIVATE_KEY,
    function (err, decoded) {
      if (err) {
        return false;
      } else {
        return decoded;
      }
    }
  );
  // Tips：verify函数验证的token要去掉前缀Bearer。
  //decoded.iat表示开始（初始）时间，decoded.exp表示到期的时间
  //这里token过期后，会自动响应401错误状态。
};

module.exports = {
  setToken,
  verifyToken,
};
