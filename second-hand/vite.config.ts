//* vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
//路由生成插件
import pages from "vite-plugin-pages";
import layouts from "vite-plugin-vue-layouts";

export default defineConfig({
  plugins: [
    vue(),
    pages({
      dirs: "src/pages", // 需要生成路由的文件目录
      exclude: ["**/components/*.vue"], // 排除在外的目录，即不将所有 components 目录下的 .vue 文件生成路由
      extendRoute(route) {
        // 在这里可以对每个路由对象进行自定义配置
        // 例如，为每个路由添加 meta 信息
        // route.meta = { requiresAuth: true };
        if (routeMetas.hasOwnProperty(`${route.name}`)) {
          route.meta = routeMetas[`${route.name}`];
        }
        // 返回修改后的路由对象
        return route;
      },
    }),
    layouts({
      layoutsDirs: "src/layout", // 布局文件存放目录
      defaultLayout: "index", // 默认布局，对应 src/layout/index.vue
    }),
  ],
  // 配置根路径与@路径
  base: "./",
  resolve: {
    // ↓配置路径别名
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  //将constant.scss中的scss常量加载到全局
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/constant.scss";`,
      },
    },
  },
});
//需要手动维护对应路由名称
var routeMetas = {
  // layout: { title: "", icon: "" },
  home: { title: "首页", icon: "HomeFilled", order: 0, requiresAuth: true },
  article: { title: "文章", icon: "Edit", order: 1, requiresAuth: true },
  category: { title: "分类", icon: "Tickets", order: 2, requiresAuth: true },
  info: { title: "信息", icon: "Goods", order: 3, requiresAuth: true },
  test: { title: "测试页", icon: "Edit", order: 4, requiresAuth: true },
  "test-news": {
    title: "测试子页",
    icon: "Edit",
    order: 4.1,
    requiresAuth: true,
  },
};
