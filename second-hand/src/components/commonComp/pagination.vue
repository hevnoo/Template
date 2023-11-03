<template>
  <div class="wrapper-page">
    <el-pagination
      class="pagination"
      layout="total, sizes, prev, pager, next, jumper"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      :page-sizes="[10, 20, 30, 60, 100]"
      @current-change="currentChange"
      @size-change="handleSizeChange"
      background
    >
    </el-pagination>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, defineProps, computed, watch, onMounted } from "vue";
import { useRoute, useRouter, onBeforeRouteUpdate } from "vue-router";
import { storeToRefs } from "pinia";
const route = useRoute();
const router = useRouter();
const emits = defineEmits(["currentChange", "handleSizeChange"]);
const props = defineProps({
  currentPage: {
    type: Number,
    default: () => 1,
  },
  pageSize: {
    type: Number,
    default: () => 10,
  },
  total: {
    type: Number,
    default: () => 0,
  },
  position: {
    //居左、居右、剧中
    type: String,
    default: () => "right",
  },
  backgroundColor: {
    type: String,
    default: () => "#409eff",
  },
});
let currentPage = ref(props.currentPage);
let pageSize = ref(props.pageSize);
let total = ref(props.total);
let position = ref("right");

watch(
  () => props.position,
  (newVal) => {
    if (newVal === "left") {
      position.value = "flex-start";
    } else if (newVal === "center") {
      position.value = "center";
    } else {
      position.value = "flex-end";
    }
  },
  { immediate: true }
);

//当前页改变时触发
const currentChange = (val: number) => {
  // console.log(`当前页: ${val}`)
  currentPage.value = val;
  emits("currentChange", val);
};
const handleSizeChange = (val) => {
  emits("handleSizeChange", val);
};

//监听路由
onBeforeRouteUpdate((to, from) => {});

/* 
直接在父组件使用currentChange调用api即可
*/
</script>

<style scoped lang="scss">
.wrapper-page {
  width: 100%;
  display: flex;
  justify-content: v-bind(position);
}
:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background-color: v-bind(backgroundColor); //修改默认的背景色
}
</style>
<style lang="scss">
// .el-pagination.is-background .el-pager li:hover {
//   color: v-bind(backgroundColor);
// }
// .el-pagination.is-background .el-pager li:not(.disabled):hover {
//   color: v-bind(backgroundColor);
// }
// .el-pagination.is-background .el-pager li:not(.disabled).active:hover {
//   background-color: v-bind(backgroundColor);
// }
// .el-pagination.is-background .el-pager li:not(.disabled).active {
//   background-color: v-bind(backgroundColor); // 进行修改背景
// }
</style>
