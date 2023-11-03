<template>
  <div class="wrapper">
    <header></header>
    <!-- <main>
      <Table
        class="table"
        :border="false"
        :headerRowHeight="'40px'"
        :rowHeight="'60px'"
        :colButtons="colButtons"
        :handleSelectionChange="handleSelectionChange"
      ></Table>
    </main> -->
    <div>
      <VxeForm></VxeForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import Menu from "@/components/commonComp/menu.vue";
import Table from "@/components/commonComp/table.vue";
import VxeForm from "@/components/commonComp/vxeForm.vue";
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { user } from "@/store";
import { storeToRefs } from "pinia";
import storage from "@/utils/storage.js";
import { ElMessage, ElMessageBox } from "element-plus";
const route = useRoute();
const router = useRouter();
const useLogin: any = user();
let { token, role, menu } = storeToRefs(useLogin);

const colButtons = [
  { label: "详情", func: handleDetail },
  { label: "编辑", func: handleEdit },
  { label: "删除", func: (row) => {} },
];

function handleDetail(row) {
  console.log("detail:", row);
}
function handleEdit(row) {
  console.log("edit:", row);
}
function handleSelectionChange(e) {
  console.log("handleSelectionChange:", e);
}
</script>

<style scoped lang="scss">
.wrapper {
  header {
    height: 60px;
    width: 100%;
    // border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    // background-color: pink;
  }
  main {
    // flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    // height: 800px;
    // padding: 0 40px 0 40px;
    // width: 1000px;
    .table {
      width: 70%;
    }
  }
}
</style>
