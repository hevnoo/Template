import { createRouter, createWebHashHistory } from "vue-router";
//引入插件自动生成的路由pages
import routes from "pages-generated";
import { setupLayouts } from "virtual:generated-layouts";
import generatedRoutes from "virtual:generated-pages";

import { setupRouterGuard } from "./guard";
import {
  staticRouter,
  errorRouter,
  notFoundRouter,
} from "../router/modules/staticRouter";
// import { articleDetailRouter } from './modules/otherAddRoter'
import { asyncRouter } from "@/router/modules/asyncRouter";
import storage from "@/utils/storage";
import { user } from "@/store";

const routes = setupLayouts(generatedRoutes);
const router = createRouter({
  history: createWebHashHistory(),
  // routes: [...staticRouter, ...errorRouter],
  routes: [routes],
});
console.log("routes:", routes);
// 注册路由守卫
setupRouterGuard(router);

//在index添加路由，防止刷新路由丢失！
// refreshRoute()

const getMenu = () => {
  let isRoute = true;

  if (isRoute) {
    // const useUser: any = user();
    // let { menu } = useUser;
    //如果为空，判断为刷新，就重新添加路由，防止刷新路由丢失！
    isRoute = false;
    const menuList = storage.getLocal("menu") || [];
    {
      menuList.map((m: any) => {
        const { path, name, component, meta } = m;
        const item = {
          path,
          name,
          component: () => import(`../views${component}`),
          meta,
        };
        router.addRoute("layout", item);
        //向layout添加子路由！
        if (m.children) {
          m.children.map((s: any) => {
            const { path, name, component, meta } = s;
            const res = {
              path,
              name,
              component: () => import(`@/views${component}`),
              meta,
            };
            router.addRoute(`${m.name}`, res);
            //向父级添加子路由！
          });
        }
      });

      //额外添加的其他路由
      // router.addRoute('article', articleDetailRouter)
      // 404路由,放在最后添加
      router.addRoute(notFoundRouter);
    }
  } else {
    //后加上
  }
};
// getMenu();

export default router;
