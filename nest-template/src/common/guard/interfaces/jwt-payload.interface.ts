export interface JwtPayload {
  username: string;
  email: string;
  roles: string[];
  // 其他你需要的字段
}
