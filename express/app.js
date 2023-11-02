//* app.js
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
//cors
var cors = require("cors");
//jwt
var { expressjwt: jwt } = require("express-jwt");
//常量：密钥、过期时间等
const { PRIVATE_KEY } = require("./utils/constant");

var indexRouter = require("./routes/index");
var userRouter = require("./routes/user");
//中间件
var { createErr, errHandler } = require("./middleware/modules/error");
var { verifyToken } = require("./middleware/modules/verifyToken");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); //save token in cookie
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
//jwt
app.use(
  jwt({ secret: PRIVATE_KEY, algorithms: ["HS256"] }).unless({
    path: ["/api/user/register", "/api/user/login"],
  })
);

app.use("/api/", indexRouter);
app.use("/api/user", userRouter);
// 应用中间件到需要验证token的路由之前
app.use(verifyToken);
// app.use("/api/", indexRouter);

//错误级中间件放在路由之后注册
app.use(createErr);
app.use(errHandler);

// 监听8282端口
app.listen(8282, () => {
  console.log("服务已启动 http://localhost:8282");
});

module.exports = app;
