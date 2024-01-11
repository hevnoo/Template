import { createRouter, createWebHashHistory } from "vue-router";
//引入插件自动生成的路由pages
// import routes from "pages-generated";
// import { setupLayouts } from "virtual:generated-layouts";
// import generatedRoutes from "virtual:generated-pages";

import { setupRouterGuard } from "./guard";
import {
  staticRouter,
  errorRouter,
  notFoundRouter,
} from "../router/modules/staticRouter";
// import { articleDetailRouter } from './modules/otherAddRoter'
import { asyncRouter } from "@/router/modules/asyncRouter";
import storage from "@/utils/storage";
//js文件使用pinia
import pinia from "@/store/pinia.js";
import { user } from "@/store";
const userStore = user(pinia);
// const routes = setupLayouts(generatedRoutes);

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...staticRouter, ...errorRouter],
  // routes: [routes],
});
// console.log("routes:", routes);
// 注册路由守卫
setupRouterGuard(router);

//在index添加路由，防止刷新路由丢失！
{
  let { token, menu } = userStore;
  menu.forEach((item: any) => {
    const newItem = {
      ...item,
      component: () => import(`../views${item.component}` /* @vite-ignore */),
    };
    router.addRoute("layout", newItem);
    //向layout添加子路由！
    if (item.children) {
      item.children.forEach((childItem) => {
        const newChildItem = {
          ...childItem,
          component: () =>
            import(`src/views${childItem.component}` /* @vite-ignore */),
        };
        router.addRoute(`${item.name}`, newChildItem);
        //向父级添加子路由！
      });
    }
  });
  //额外添加的其他路由
  // router.addRoute('article', articleDetailRouter)
  // 404路由,放在最后添加
  router.addRoute(notFoundRouter);
}

export default router;
