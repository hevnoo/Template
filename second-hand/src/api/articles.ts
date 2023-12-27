import http from "@/request/index";
import { deleteApi } from "./interface/articles";

//获取用户列表
export const getData = (data: any) => {
  return http.get(`/articles/getData`, { params: data });
};

//新增用户
export const createData = (data: any) => {
  return http.post("/articles/create", data);
};

//更新用户
export const updateData = (data: any) => {
  return http.put("/articles/update", data);
};

//删除用户
export const deleteData = (data: any) => {
  return http.delete("/articles/delete", { data });
};
