import { defineStore } from "pinia";
import storage from "@/utils/storage";
import { loginApi, registerApi, getMenuApi, refreshTokenApi } from "@/api/user";
import { ElMessage } from "element-plus";
import router from "@/router";

const user = defineStore("/user", {
  state: () => ({
    baseURL: "http://127.0.0.1:8282/api",
    token: storage.getCookie("token") || "",
    role: storage.getLocal("role") || "",
    menu: storage.getLocal("menu") || [],
    userInfo: storage.getLocal("userInfo") || "{}",
    expiresIn: storage.getLocal("expiresIn") || 2 * 60 * 60 * 1000,
    refreshToken: storage.getCookie("refreshToken") || "",
  }),
  getters: {},
  actions: {
    //获取菜单
    async setMenu(val: any) {
      const { data } = await getMenuApi(val);
      this.menu = data.data;
      storage.setLocal("menu", this.menu);
    },
    //登录
    async setLogin(val: any) {
      try {
        const { data } = await loginApi(val);
        ElMessage.success(data.msg);
        this.token = data.token;
        storage.setCookie("token", data.token);
        this.role = data.role;
        storage.setLocal("role", data.role);
        this.expiresIn = data.expiresIn;
        storage.setLocal("userInfo", data.userInfo);
        this.userInfo = data.userInfo;
        storage.setLocal("expiresIn", data.expiresIn);
        this.refreshToken = data.refreshToken;
        storage.setCookie("refreshToken", data.refreshToken);
        setTimeout(() => {
          router.push("/");
        }, 500);
        this.setMenu();
        // setTokenTime()
      } catch (error) {
        console.log(error);
      }
    },
    //刷新token
    async setRefreshToken(val: any) {
      const { data } = await refreshTokenApi(val);
      this.token = data.token;
      storage.setCookie("token", data.token);
      ElMessage.success();
      storage.removeCookie("Authorization_token");
      //在这里重新发起未完成的请求
    },
    //注册
    async setRegister(val: any) {
      const { data } = await registerApi(val);
      ElMessage.success(data.msg);
    },
    // 退出登录
    logout() {
      //清空所有
      storage.clearAllCookies();
      localStorage.clear();
      sessionStorage.clear();
      storage.setLocal("lang", "zh");
      router.replace("/login");
    },
  },
});

export default user;
