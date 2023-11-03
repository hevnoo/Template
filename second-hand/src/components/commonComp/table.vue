<template>
  <div class="table-wrapper">
    <div class="table-gap">
      <el-table
        :data="props.data"
        style="width: 100%; height: 100%"
        ref="multipleTableRef"
        :border="props.border"
        :row-style="{ height: props.rowHeight }"
        :header-row-style="{ height: props.headerRowHeight || props.rowHeight }"
        fit
        stripe
        resizable
        show-overflow-tooltip
        @selection-change="props.handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          v-for="item in (props.tableColumns as any)"
          :key="`${item.prop}-key`"
          :prop="item.prop || ''"
          :label="item.label || 'Column'"
          :width="item.width || ''"
          :fixed="item.fixed || false"
          :align="props.align"
        >
          <template #default="{ row }">
            <!-- 这里的 row 是当前行的数据对象 -->
            {{ row[item.prop] }}
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column
          v-if="props.colButtons.length"
          :fixed="operations.right"
          :label="operations.label"
          :width="operations.width"
          :align="props.align"
        >
          <template #default="{ row }">
            <el-button
              v-for="(btn, i) in (props.colButtons as any)"
              :key="i"
              link
              type="primary"
              @click="btn.func(row)"
            >
              {{ btn.label }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { user } from "@/store";
const route = useRoute();
const router = useRouter();

const props = defineProps({
  data: {
    type: Array,
    default: () => [
      {
        date: "2016-05-03",
        name: "Tom",
        state: "California",
        city: "Los Angeles",
        address: "No. 189, Grove St, Los Angeles",
        zip: "CA 90036",
        tag: "Home",
      },
      {
        date: "2016-05-02",
        name: "Tom",
        state: "California",
        city: "Los Angeles",
        address: "No. 189, Grove St, Los Angeles",
        zip: "CA 90036",
        tag: "Office",
      },
    ],
  },
  tableColumns: {
    type: Array,
    default: () => [
      { prop: "date", label: "Date", width: "120" },
      { prop: "name", label: "Name", width: "120" },
      { prop: "state", label: "State", width: "120" },
      { prop: "city", label: "City", width: "120" },
      { prop: "address", label: "Address", width: "auto" },
      { prop: "zip", label: "Zip", width: "120" },
      //   { fixed: "right", label: "操作", width: "120" },
    ],
  },
  operations: {
    type: Object, //操作列
    default: () => {
      return { fixed: "right", label: "操作", width: "200" };
    },
  },
  colButtons: {
    type: Array, //按钮配置
    default: () => [
      // { label: "详情", func: (row) => {} },
      // { label: "编辑", func: (row) => {} },
      // { label: "删除", func: (row) => {} },
    ],
  },
  align: {
    type: String, //对齐方式
    default: () => "left",
  },
  border: {
    type: Boolean, //是否带边框
    default: () => false,
  },
  rowHeight: {
    type: String, //行高
    default: () => "", //"60px"
  },
  headerRowHeight: {
    type: String, //表头行高，无参默认使用rowHeight
    default: () => "",
  },
  //func
  handleSelectionChange: {
    type: Function,
    default: () => () => {},
  },
});

onMounted(() => {});
</script>

<style scoped lang="scss">
.table-wrapper {
  height: 100%;
  width: 100%;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  .table-gap {
    height: auto;
    padding: 1.5rem;
    margin: 0.5px;
    background-color: #ffffff;
  }
}
.no-wrap {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
