//* request/index.ts
import axios from "axios";
import { ElMessage } from "element-plus";
import storage from "@/utils/storage";
import { user } from "@/store";

// 创建一个 axios 实例
const service = axios.create({
  baseURL: "http://127.0.0.1:8282/api",
  timeout: 60000, // 请求超时时间毫秒
  //withCredentials: true, // 异步请求携带cookie
  headers: {
    // 设置后端需要的传参类型
    "Content-Type": "application/json",
    token: "your token",
    "X-Requested-With": "XMLHttpRequest",
  },
});

//请求拦截
service.interceptors.request.use(
  (config) => {
    const useUser: any = user();
    let { token, refreshToken } = useUser;
    if (storage.getLocal("Authorization_token") == `Bearer ${refreshToken}`) {
      config.headers["Authorization"] = `Bearer ${refreshToken}`;
      return config;
    } else {
      config.headers["Authorization"] = `Bearer ${token}`;
      return config;
    }
  },
  (error) => {
    ElMessage.error("错误");
    return Promise.reject(new Error(error));
  }
);

//响应拦截,依据响应结果进行提示。
service.interceptors.response.use(
  (response) => {
    // console.log("response:", response);
    if (response.data.code === 200 || response.data.code === 201) {
      return response;
    } else {
      if (response.data.msg) {
        ElMessage.error(response.data.msg);
        // return response
        if (response.data.code == 411) {
          //411是后端设置的中间件判断token过期状态
          const useLogin: any = user();
          useLogin.logout();
        }
      } else {
        ElMessage.error("未知状态错误");
      }
      return Promise.reject(new Error(response.data.msg));
    }
  },
  (error) => {
    // 发生错误时的处理
    if (error.response && error.response.data && error.response.data.msg) {
      // console.log(error.response.data.msg);
      ElMessage.error(error.response.data.msg);
    } else {
      // 其他情况，打印出通用的错误信息
      console.log("发生错误，请稍后再试");
    }
    return Promise.reject(error);
  }
  //显示错误，例如：401
  // (error) => {
  //   //当状态为token过期或者失效状态时，用refreshToken重新请求一个新token。
  //   if(error.response.data.code == 401){
  //     const { config } = error
  //     const useLogin: any = user()
  //     let { token, refreshToken, userInfo } = useLogin
  //     if(refreshToken && storage.getLocal('refreshToken')){
  //       config.headers['Authorization'] = `Bearer ${refreshToken}`
  //       storage.setLocal('Authorization_token', `Bearer ${refreshToken}`)
  //       useLogin.setRefreshToken(userInfo.username)
  //     }
  //   }
  //   // ElMessage.error(error.response.statusText + error.response.data.code)
  //   console.log(error.response)
  //   return Promise.reject(new Error(error.response.data))
  // }
);

/*
1.后端通过very验证后，过期就会返回401无权限。
2.出现401时，就把refreshToken保存到本地，然后再调用pinia里的刷新token接口，
3.一旦接口调用成功就在pinia接口内移除本地的Authorization_token，这样就不影响其他请求选择token请求头了。
4.只有刷新token这个地方要用refreshToken，其他请求都是token。
*/

export default service;
