import {
  NavigationGuardNext,
  RouteLocationNormalized,
  Router,
} from "vue-router";
import router from "@/router/index";
import { ref, computed, watch } from "vue";
import { ElMessage } from "element-plus";
import storage from "@/utils/storage";
import { notFoundRouter } from "@/router/modules/staticRouter";
// import { articleDetailRouter } from './modules/otherAddRoter'
import { user } from "@/store";

const whiteList = ["/login"];

// 全局前置守卫
export function beforeEach(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void {
  // 如果需要阻止导航，可以调用 `next(false)`
  //   next()放行;
  const userStore: any = user();
  let { token, menu } = userStore;
  if (token && storage.getCookie("token")) {
    if (to.path === "/login") {
      next("/");
    } else {
      {
        menu.forEach((item) => {
          const newItem = {
            ...item,
            component: () =>
              import(`../views${item.component}` /* @vite-ignore */),
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
      if (to.path === "/403") {
        next("/home");
      } else {
        next();
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next();
    } else {
      next("/login");
    }
  }
}

// 全局解析守卫
export function beforeResolve(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void {
  // 在这里添加你的逻辑判断和处理
  next();
}

// 全局后置守卫
export function afterEach(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized
): void {
  // 在这里添加你的逻辑处理
  document.title = `${to.meta.title}`;
}

// 路由独享守卫
export function onEnter(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void {
  // 在这里添加你的逻辑判断和处理
  next();
}

// 注册路由守卫
export function setupRouterGuard(router: Router): void {
  router.beforeEach(beforeEach);
  router.beforeResolve(beforeResolve);
  router.afterEach(afterEach);
}
