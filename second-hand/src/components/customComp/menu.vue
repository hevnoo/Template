<template>
  <!-- 垂直 -->
  <el-menu
    v-if="props.mode === 'vertical'"
    :mode="props.mode"
    :default-active="props.defaultActive"
    :active-text-color="props.activeTextColor"
    :background-color="props.backgroundColor"
    :text-color="props.textColor"
    class="el-menu-vertical-demo"
    :router="true"
  >
    <header class="logo">
      <img src="" alt="" />
      <!-- <div class="logo-name" v-if="!isClose">{{ $t("menu.logo") }}</div> -->
      <div class="logo-name">LOGO</div>
    </header>
    <template v-for="(item, index) in (props.value as any[])" :key="item.id">
      <el-menu-item
        v-if="!item.children"
        :index="item.path"
        @click="clickItem(item.name, item.component, index)"
      >
        <el-icon v-if="props.isShowIcon"
          ><component :is="item.meta.icon"></component
        ></el-icon>
        <template #title>{{ item.meta.title }}</template>
      </el-menu-item>
      <!--  -->
      <el-sub-menu v-else :index="item.path">
        <template #title>
          <el-icon v-if="props.isShowIcon"
            ><component :is="item.meta.icon"></component
          ></el-icon>
          <span>{{ item.meta.title }}</span>
        </template>
        <el-menu-item
          v-for="(res, i) in (item.children as any[])"
          :key="res.id"
          :index="res.path"
          @click="clickItem(res.name, res.component, i)"
          >{{ res.meta.title }}</el-menu-item
        >
      </el-sub-menu>
    </template>
  </el-menu>
  <!-- 水平 -->
  <el-menu
    v-else-if="props.mode === 'horizontal'"
    class="el-menu-demo"
    :mode="props.mode"
    :ellipsis="false"
    :default-active="props.defaultActive"
    :active-text-color="props.activeTextColor"
    :background-color="props.backgroundColor"
    :text-color="props.textColor"
    :router="true"
    @select="props.select"
  >
    <el-menu-item>LOGO</el-menu-item>
    <div class="flex-grow" />
    <template v-for="(item, index) in (props.value as any[])" :key="index">
      <el-menu-item
        v-if="!item.children.length"
        :index="item.path"
        @click="clickItem(item.name, item.component, index)"
      >
        <el-icon v-if="props.isShowIcon"
          ><component :is="item.meta.icon"></component
        ></el-icon>
        <template #title>{{ item.meta.title }}</template>
      </el-menu-item>
      <!--  -->
      <el-sub-menu class="el-sub-menu" v-else :index="item.path">
        <template #title>
          <el-icon v-if="props.isShowIcon"
            ><component :is="item.meta.icon"></component
          ></el-icon>
          <span>{{ item.meta.title }}</span>
        </template>
        <el-menu-item
          v-for="(res, i) in (item.children as any[])"
          :key="res.id"
          :index="res.path"
          @click="clickItem(res.name, res.component, i)"
          >{{ res.meta.title }}</el-menu-item
        >
      </el-sub-menu>
    </template>
  </el-menu>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { user } from "@/store";
const route = useRoute();
const router = useRouter();
const props = defineProps({
  value: {
    type: Array,
    default: () => [
      {
        id: 0,
        name: "home",
        path: "/home",
        redirect: "",
        component: "/home/index.vue",
        meta: {
          title: "首页",
          icon: "HomeFilled",
        },
      },
    ],
  },
  mode: {
    type: String,
    default: () => "vertical", //horizontal
  },
  defaultActive: {
    type: String, //默认激活的菜单下标
    default: () => "",
  },
  backgroundColor: {
    type: String,
    default: () => "#ffffff",
  },
  textColor: {
    type: String,
    default: () => "#303133",
  },
  activeTextColor: {
    type: String,
    default: () => "#409EFF",
  },
  hoverBGColor: {
    type: String,
    default: () => "rgb(236, 245, 255, 1)",
  },
  hoverColor: {
    type: String,
    default: () => "#409EFF",
  },
  isShowIcon: {
    type: Boolean, //是否展示图标
    default: () => false,
  },
  //func
  select: {
    type: Function,
    default: () => (key: string, keyPath: string[]) => {},
  },
  clickItem: {
    type: Function,
    default: () => (name: any, path: any, index: any) => {},
  },
  //自定义事件
  someThing: {
    type: Function,
    default: () => (name: any, path: any, index: any) => {},
  },
});
// const hoverSubMenuItem = computed(() => {
//   return {
//     backgroundColor: props.hoverBGColor,
//     color: props.hoverColor,
//   };
// });

onMounted(() => {});

//获取当前路径
const currentPath = ref(router.currentRoute.value.path);
</script>

<style scoped lang="scss">
::v-deep .el-menu {
  // height: 100%;
  width: 100%;
  //   --el-menu-hover-bg-color: v-bind(activeTextColor) !important;
  //   --active-color: v-bind(activeTextColor) !important;
}
//配置项
.flex-grow {
  flex-grow: 1;
}
// 取消下划线
.el-menu--horizontal,
.el-menu-item,
.el-menu-item.is-active,
::v-deep .el-menu--horizontal > .el-sub-menu .el-sub-menu__title {
  border-bottom: none;
}
// 一级菜单颜色
// .el-menu-item,
// ::v-deep .el-sub-menu .el-sub-menu__title {
//   color: #fff;
// }
// 有二级菜单的标题及子菜单菜单字体颜色
// .el-menu--horizontal .el-menu .el-menu-item,
// .el-menu--horizontal .el-menu .el-sub-menu__title {
//   color: #fff !important;
// }
// 一级菜单hover状态下字体颜色
::v-deep .el-menu-item:hover {
  color: v-bind(hoverColor) !important;
  background-color: v-bind(hoverBGColor) !important;
}
// 二级菜单hover状态下字体颜色
.el-menu--horizontal .el-menu-item:not(.is-disabled):focus,
.el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
  //v-bind失效，手动设置
  color: #409eff !important;
  background-color: rgb(236, 245, 255, 1) !important;
}
</style>
<style lang="scss">
//经过二级菜单标题的样式
.el-sub-menu__title.el-tooltip__trigger.el-tooltip__trigger:hover {
  color: v-bind(hoverColor) !important;
  background-color: v-bind(hoverBGColor) !important;
}
// 取消二级菜单高亮下划线
.el-menu--horizontal > .el-sub-menu.is-active .el-sub-menu__title {
  border-bottom: none;
}
</style>
