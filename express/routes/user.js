var express = require("express");
var router = express.Router();
var querySql = require("../db/index");
// 用于生成jwt字符串
const jwt = require("jsonwebtoken");
const {
  PWD_SALT,
  PRIVATE_KEY,
  EXPIRESD,
  refresh_time,
} = require("../utils/constant");
const { part_verify } = require("../middleware/modules/token");
const { setToken } = require("../utils/useJWT");
const { md5, upload } = require("../utils/index");
const adminMenu = require("../data/loginData/adminMenu");
const userMenu = require("../data/loginData/userMenu");

// 获取菜单列表
router.get("/getMenu", async (req, res, next) => {
  try {
    let userInfo = await querySql(
      "select id,username,nickname,avatar,role from user where username = ?",
      [req.auth.username]
    );
    if (userInfo[0].role === "admin") {
      res.send({ code: 200, msg: "admin登录", data: adminMenu });
    } else {
      res.send({ code: 200, msg: "用户登录", data: userMenu });
    }
  } catch (e) {
    next(e);
  }
});

// 登录接口
router.post("/login", async (req, res, next) => {
  let { username, password } = req.body;
  try {
    let user = await querySql("select id from user where username = ?", [
      username,
    ]);
    if (!user || user.length === 0) {
      res.send({ code: 400, msg: "该账号不存在" });
    } else {
      let roles = await querySql("select role from user where username = ?", [
        username,
      ]);
      let role = roles[0].role;
      let result = await querySql(
        "select * from user where username = ? and password = ?",
        [username, password]
      );
      if (!result || result.length === 0) {
        res.send({ code: 400, msg: "账号或者密码不正确" });
      } else {
        let userInfo = await querySql(
          "select id,username,nickname,avatar,role from user where username = ? and password = ?",
          [username, password]
        );
        // token过期后，需要靠refreshToken来重新获取token。
        let token = setToken(username).token;
        let refreshToken = setToken(username).refreshToken;
        // 将 Token 保存在 Cookie 中
        // res.cookie("token", token, { maxAge: 900000, httpOnly: true });
        res.cookie("token", token, {
          maxAge: 3600000, // 设置过期时间，单位为毫秒
          httpOnly: true, // 限制仅通过 HTTP 请求访问 Cookie，防止js读取
          secure: true, // 限制仅通过 HTTPS 连接发送 Cookie（需要启用 HTTPS）
          sameSite: "strict", // 设置 SameSite 属性，防止跨站点请求伪造(CSRF)攻击
        });
        if (username === "admin" || role === "admin") {
          //分权限，如果是admin，那就发送admin的标识，，否则发普通user标识。
          res.send({
            code: 200,
            msg: "登录成功",
            token,
            refreshToken,
            role,
            expiresIn: refresh_time,
            userInfo,
          });
        } else {
          res.send({
            code: 200,
            msg: "登录成功",
            token,
            refreshToken,
            role,
            expiresIn: refresh_time,
            userInfo,
          });
        }
      }
    }
  } catch (e) {
    next(e);
  }
});

//刷新token的接口，用于无感登录。
router.post("/refreshToken", part_verify, (req, res, next) => {
  let { username } = req.body;
  try {
    let token = setToken(username).token;
    res.send({ code: 200, msg: "刷新token成功", token });
  } catch (e) {
    console.log(e);
    next(e);
  }
});

/* 注册接口 */
router.post("/register", async (req, res, next) => {
  let { username, password, nickname } = req.body;
  try {
    let user = await querySql("select * from user where username = ?", [
      username,
    ]);
    // 问号占位符，后面既是赋值给占位符。
    if (!user || user.length === 0) {
      if (username === "admin") {
        //账号或者角色 是管理员admin即可
        let role = "admin";
        await querySql(
          "insert into user(username,password,nickname,role) value(?,?,?,?)",
          [username, password, nickname, role]
        );
      } else {
        let role = "user";
        await querySql(
          "insert into user(username,password,nickname,role) value(?,?,?,?)",
          [username, password, nickname, role]
        );
      }

      res.send({ code: 200, msg: "注册成功" });
    } else {
      res.send({ code: 400, msg: "该账号已注册" });
    }
  } catch (e) {
    console.log(e);
    next(e);
  }
});

//获取当前用户信息
router.get("/info", async (req, res, next) => {
  console.log("用户信息：", req.auth);
  let { username } = req.auth;
  try {
    //按用户名查找出对应的用户信息：
    let userinfo = await querySql("select * from user where username = ?", [
      username,
    ]);
    res.send({ code: 200, msg: "成功", data: userinfo[0] });
  } catch (e) {
    console.log(e);
    next(e);
  }
});

//------------------------------
//获取用户列表
router.get("/getUserList", async (req, res, next) => {
  let currentPage = Number(req.query.currentPage || 1);
  let pageSize = Number(req.query.pageSize || 10); // 每页显示的记录数
  let offset = (currentPage - 1) * pageSize; // 计算偏移量
  try {
    console.log("req:", req.query);

    // 查询当前页数据
    let sql = `SELECT * FROM user`;
    const params = [];
    // 构建条件查询语句和参数
    let conditionCount = 0;
    if (req.query.username) {
      sql += ` WHERE username LIKE ?`;
      params.push(`%${req.query.username}%`);
      conditionCount++;
    }
    if (req.query.nickname) {
      if (conditionCount > 0) {
        sql += ` AND nickname LIKE ?`;
      } else {
        sql += ` WHERE nickname LIKE ?`;
      }
      params.push(`%${req.query.nickname}%`);
      conditionCount++;
    }
    if (req.query.role) {
      if (conditionCount > 0) {
        sql += ` AND role LIKE ?`;
      } else {
        sql += ` WHERE role LIKE ?`;
      }
      params.push(`%${req.query.role}%`);
      conditionCount++;
    }
    //total
    const totalCount = await querySql(sql, params);
    // 添加其他条件...
    sql += ` LIMIT ${pageSize} OFFSET ${offset}`;
    const result = await querySql(sql, params);
    // 获取总记录数
    // const countResult = await querySql(
    //   "SELECT COUNT(id) as totalCount FROM user"
    // );
    // const totalCount = countResult[0].totalCount || 0;
    res.send({
      code: 200,
      msg: "获取成功",
      data: result,
      total: totalCount.length,
    });
  } catch (e) {
    console.log(e);
    next(e);
  }
});

//新增用户列表
router.post("/addUser", async (req, res, next) => {
  let { username, password, nickname, role } = req.body;
  if (!username || !password || !nickname) {
    return res.status(400).json({ msg: "参数不能为空" });
  }
  try {
    let user = await querySql("select * from user where username = ?", [
      username,
    ]);
    if (!user || user.length === 0) {
      if (username === "admin" || (role === "admin") | (role == "1")) {
        let role = "admin";
        let sql =
          "insert into user(username,password,nickname,role) values(?,?,?,?)";
        await querySql(sql, [username, password, nickname, role]);
        res.send({ code: 200, msg: "新增成功", data: null });
      }
      //   else if (role === "admin") {
      //     let sql =
      //       "insert into users(username,password,nickname,role) values(?,?,?,?)";
      //     await querySql(sql, [username, password, nickname, role]);
      //     res.send({ code: 200, msg: "新增成功", data: null });
      //   }
      else {
        let role = "user";
        let sql =
          "insert into user(username,password,nickname,role) values(?,?,?,?)";
        await querySql(sql, [username, password, nickname, role]);
        res.send({ code: 200, msg: "新增成功", data: null });
      }
    } else {
      res.send({ code: 400, msg: "该用户已存在" });
    }
  } catch (e) {
    console.log(e);
    next(e);
  }
});

//更新用户列表信息接口
router.post("/upUser", async (req, res, next) => {
  //username是唯一的且不可修改，可不传
  let { id, username, password, nickname, role } = req.body;
  if (!id || !password || !nickname) {
    return res.status(400).json({ msg: "参数不能为空" });
  }
  try {
    //找出当前自己的用户信息：
    let { username: curUsername } = req.auth;
    let curUserinfo = await querySql("select * from user where username = ?", [
      curUsername,
    ]);
    if (curUserinfo[0]["role"] === "admin") {
      if (username === "admin" || role === "admin") {
      }
      let roles = role === "admin" ? "admin" : "user";
      let sql = "update user set nickname=?,password=?,role=? where id=?";
      let result = await querySql(sql, [nickname, password, roles, id]);
      res.send({ code: 200, msg: "更新成功", data: null });
    } else {
      return res.status(401).json({ msg: "权限错误，请联系管理员" });
    }
  } catch (e) {
    console.log(e);
    next(e);
  }
});

//删除用户
router.delete("/deleUser", async (req, res, next) => {
  let params = req.body.id || req.body.ids || req.body;
  // 判断 id 是否是数组
  if (!params && !Array.isArray(params)) {
    return res.status(400).json({ msg: "操作错误" });
  }
  const ids = Array.isArray(params) ? params : [params];
  try {
    const sql = "DELETE FROM user WHERE id IN (?)";
    //  DELETE FROM user WHERE id IN ([1, 2, 3])
    // 子查询语句
    // DELETE FROM user WHERE id IN (SELECT id FROM user WHERE age < 20)
    await querySql(sql, [ids]);
    res.json({ code: 200, msg: "删除成功", data: null });
  } catch (e) {
    console.log(e);
    next(e);
  }
});

//头像上传接口------------------------
router.post("/upload", upload.single("avatar"), async (req, res, next) => {
  console.log("头像接口请求文件", req.file);
  let imgPath = req.file.path.split("public")[1];
  let imgUrl = "http://127.0.0.1:8282" + imgPath;
  res.send({ code: 200, msg: "上传成功", data: imgUrl });
});

//更新用户当前信息
router.post("/updateUser", async (req, res, next) => {
  let { username, nickname } = req.body;
  let { password, oldPass } = req.body;
  let { avatar } = req.body;
  let userSelf = req.user.username;
  try {
    let user = await querySql("select * from user where username = ?", [
      username,
    ]);
    //1.头像
    if (avatar && !username && !password) {
      let result = await querySql(
        "update user set avatar = ? where username = ?",
        [avatar, userSelf]
      );
      res.send({ code: 200, msg: "更新头像成功", data: null });
    }
    //2.账户
    else if (username && nickname && !password && !oldPass) {
      if (!user || user.length === 0) {
        let result = await querySql(
          "update user set nickname = ?,username = ? where username = ?",
          [nickname, username, userSelf]
        );
        res.send({ code: 200, msg: "更新账户成功", data: null });
      } else {
        res.send({ code: 400, msg: "该账号已存在" });
      }
      //3.密码
    } else if (!username && !nickname && password && oldPass) {
      //先找原密码是否正确
      let isPass = await querySql(
        "select password from user where username = ? ",
        [userSelf]
      );
      //再找新旧密码是否相同
      // console.log("--------------------", isPass[0].password);
      if (oldPass === isPass[0].password) {
        if (isPass[0].password === password) {
          res.send({ code: 400, msg: "新旧密码不能相同", data: null });
        } else {
          let result = await querySql(
            "update user set password = ? where username = ?",
            [password, userSelf]
          );
          res.send({ code: 200, msg: "更新密码成功", data: null });
        }
      } else {
        res.send({ code: 400, msg: "原密码不正确", data: null });
      }
    }
  } catch (e) {
    console.log(e);
    next(e);
  }
});

module.exports = router;
