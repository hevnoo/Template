import http from "@/request/index";

//规范参数，用于增、删、改...
function setParams(data) {
  //发请求的参数全为Object类型
  let condition = Object.prototype.toString.call(data) === "[object Object]";
  if (!condition) {
    return { data };
  } else {
    return data;
  }
}

// * 用户登录接口
export const loginApi = (data: any) => {
  return http.post("/user/login", data, {
    headers: { noLoading: true },
  }); // 正常 post json 请求  ==>  application/json
};

// * 注册接口
export const registerApi = (data: any) => {
  return http.post("/user/register", data);
};

// * 获取菜单
export const getMenuApi = (data: any) => {
  return http.get("/user/getMenu", data);
};

// * 刷新token
export const refreshTokenApi = (data: any) => {
  return http.post("/user/refreshToken", data);
};

//获取用户列表
export const getUserListApi = (data: any) => {
  return http.get(`/user/getUserList`, { params: data });
};

//新增用户
export const addUserApi = (data: any) => {
  return http.post("/user/addUser", data);
};

//更新用户
export const upUserApi = (data: any) => {
  return http.post("/user/upUser", data);
};

//删除用户
export const deleUserApi = (data: any) => {
  return http.delete("/user/deleUser", { data });
};
