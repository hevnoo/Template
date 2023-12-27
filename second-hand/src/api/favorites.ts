import http from "@/request/index";
import { deleteApi } from "./interface/favorites";

//获取用户列表
export const getData = (data: any) => {
  return http.get(`/favorites/getData`, { params: data });
};

//新增用户
export const createData = (data: any) => {
  return http.post("/favorites/create", data);
};

//更新用户
export const updateData = (data: any) => {
  return http.put("/favorites/update", data);
};

//删除用户
export const deleteData = (data: any) => {
  return http.delete("/favorites/delete", { data });
};
