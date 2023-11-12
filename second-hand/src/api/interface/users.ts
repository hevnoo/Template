export interface getUsers {
  id: number | string;
  username: string;
  password: string;
  nickname: string;
  role: "admin" | "user"; // 角色类型为 admin 或 user
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface deleteUsers {
  id: string | string[] | number | number[];
}
