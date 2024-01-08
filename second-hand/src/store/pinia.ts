//解决在js文件中使用pinia
import { createPinia } from "pinia";
const pinia = createPinia();
export default pinia;

//用法示例：
// import pinia from "@/store/pinia.js";
// import { user } from "@/store";
// const store = user(pinia);
