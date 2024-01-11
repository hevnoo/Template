<template>
  <div class="h-wrapper">
    <Menu :value="menu" :mode="'horizontal'" :select="handleSelect"></Menu>
  </div>
</template>

<script setup lang="ts">
import Menu from "@/components/customComp/menu.vue";
import { ref, onMounted, computed, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { user } from "@/store";
import { storeToRefs } from "pinia";
import storage from "@/utils/storage.js";
import { ElMessage, ElMessageBox } from "element-plus";
// import { toArrayTree, arrayToTree } from "xe-utils";
const route = useRoute();
const router = useRouter();
const userStore: any = user();
let { token, role, menu } = storeToRefs(userStore);
// console.log("menu:", menu.value);
// console.log("getRoutes:", router.getRoutes());
// const menuValue = router.getRoutes();
// const menuValue = computed(() => {
//   let routeList = ["home", "info", "category", "test", "test-news"];
//   let routes = router
//     .getRoutes()
//     .filter((item) => routeList.includes(`${item.name}`));
//   // routes = arrayToTree(routes);
//   return routes;
// });
//根据path生成tree树
function arrayToTree(data) {
  const rootNode = {
    path: "/",
    name: "Root",
    children: [],
  };
  data.forEach((item) => {
    const pathSegments = item.path
      .split("/")
      .filter((segment) => segment !== "");
    let currentNode = rootNode;

    for (let segment of pathSegments) {
      let childNode = currentNode.children.find(
        (node) => node.path === `/${segment}`
      );
      if (!childNode) {
        childNode = {
          path: `/${segment}`,
          children: [],
        };
        currentNode.children.push(childNode);
      }
      currentNode = childNode;
    }

    currentNode.name = item.name; // 设置节点名称
    const processItem = (item, node) => {
      for (let key in item) {
        if (key !== "path" && key !== "children") {
          node[key] = item[key];
        }
      }
    };
    processItem(item, currentNode); // 设置其他动态属性
  });

  const treeData = rootNode.children;
  // console.log(treeData);
  return treeData;
}

onMounted(() => {
  nextTick(() => {
    logout();
  });
});
const getName = (name: any, path: any, index: any) => {};

const handleSelect = (key: string, keyPath: string[]) => {
  // console.log("--handleSelect--", key, keyPath);
};
//右键登出
function logout() {
  let lastKeyPressTime = 0;
  let doubleKeyPressDelay = 500; // 设置双击键间隔的最大时间
  document.addEventListener("keydown", function (event) {
    let currentTime = new Date().getTime();
    if (event.key === "Escape") {
      if (currentTime - lastKeyPressTime <= doubleKeyPressDelay) {
        // 如果两次按键间隔小于阈值，则表示用户按下了两次
        msgBox();
      }
      lastKeyPressTime = currentTime;
    }
  });
}
const msgBox = () => {
  ElMessageBox.confirm("确定要退出登录吗?", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      ElMessage({
        type: "success",
        message: "退出登录",
      });
      userStore.logout();
    })
    .catch(() => {});
};
</script>

<style scoped lang="scss">
.h-wrapper {
  width: 60%;
}
</style>
