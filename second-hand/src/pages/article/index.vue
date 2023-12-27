<template>
  <div class="w-home">
    <VxeGridTable
      :gridOptions="gridOptions"
      :columns="columns"
      :operate="operate"
      :formatOperate="formatOperate"
      :formConfig="formConfig"
      :dialogVisible="dialogVisible"
      :dialogConfig="dialogConfig"
      :dialogFormConfig="dialogFormConfig"
      :getDataApi="getData"
      :addDataApi="createData"
      :updateDataApi="updateData"
      :deleteDataApi="deleteData"
      @toolbarButtonClick="toolbarButtonClick"
      @clickRow="clickRow"
      @submitEvent="submitEvent"
      @handleSwitchChange="handleSwitchChange"
    ></VxeGridTable>
  </div>
  <!-- <TextEditor /> -->
</template>

<script setup lang="ts">
import TextEditor from "@/components/customComp/textEditor.vue";
// import QuillEditor from "@/components/customComp/quillEditor.vue";
import VxeGridTable from "@/components/customComp/vxeGridTable.vue";
import Pagination from "@/components/customComp/pagination.vue";
import { ref, onMounted, computed, watch, watchEffect } from "vue";
import {
  useRoute,
  useRouter,
  onBeforeRouteLeave,
  onBeforeRouteUpdate,
} from "vue-router";
import { getData, createData, updateData, deleteData } from "@/api/articles";
import { getUserListApi, addUserApi, upUserApi, deleUserApi } from "@/api/user";
import { getData as getArticles } from "@/api/favorites";
import {
  createData as createFavorites,
  deleteData as deleteFavorites,
} from "@/api/favorites";
import { ElMessage, ElMessageBox } from "element-plus";
const route = useRoute();
const router = useRouter();

const currentPage = ref(1);
const total = ref(20);
const gridOptions = ref({
  customDialog: false, //是否自定义弹窗
  refresh: false, //是否刷新
  border: true,
  showOverflow: true,
  height: "",
  // minHeight: 300,
  exportConfig: {},
  rowConfig: {
    keyField: "id",
    isHover: true,
  },
  columnConfig: {
    resizable: true,
  },
  pagerConfig: {
    enabled: true,
    pageSize: 10,
    pageSizes: [5, 10, 15, 20, 50, 100, 200, 500, 1000],
  },
  proxyConfig: {
    form: true, // 启用表单代理
    seq: true, // 启用动态序号代理，每一页的序号会根据当前页数变化
    sort: true, // 启用排序代理，当点击排序时会自动触发 query 行为
    filter: true, // 启用筛选代理，当点击筛选时会自动触发 query 行为
    autoLoad: true,
    props: {
      // 对应响应结果 Promise<{ result: [], page: { total: 100 } }>
      result: "result", // 配置响应结果列表字段
      total: "page.total", // 配置响应结果总页数字段
    },
    ajax: {
      // 接收 Promise API
      query: ({ page, sorts, filters, form }) => {},
      delete: {
        url: "/users/deleteData",
      },
    },
  },
  checkboxConfig: {
    // labelField: "id",
    reserve: true,
    highlight: true,
    range: true,
  },
});
const columns = ref([
  { type: "checkbox", width: 60 },
  { type: "seq", width: 60 },
  { field: "title", title: "标题", slots: { default: "html" } },
  {
    field: "content",
    title: "内容",
    slots: { default: "html" },
  },
  // { field: "userId", title: "作者id" },
  {
    field: "userId_string",
    title: "作者",
    showOverflow: true,
    slots: { default: "button" },
  },
  {
    field: "likeCount",
    title: "收藏量",
    formatter({ cellValue }) {
      return cellValue ? cellValue : 0;
    },
  },
  {
    field: "isFavorite", //isFavorite-favoriteId
    title: "是否收藏",
    slots: { default: "switch" },
  },
  {
    title: "操作",
    width: 300,
    slots: { default: "operate" },
  },
]);
const operate = ref([
  { label: "详情", code: "detail", status: "primary" },
  {
    label: "编辑",
    code: "edit",
    status: "primary",
  },
  {
    label: "收藏",
    code: "collect",
    status: "",
  },
  { label: "删除", code: "delete", status: "danger" },
]);
function formatOperate(row, operate) {
  for (let item of operate) {
    if (item.code === "collect") {
      if (row.favoriteId) {
        item["label"] = "取消收藏";
      } else {
        item["label"] = "收藏";
      }
    }
  }
  return operate;
}

//搜索框
let formConfig = ref({
  titleWidth: "",
  titleAlign: "left",
  items: [
    {
      field: "title",
      title: "标题",
      span: 3,
      itemRender: {
        name: "$input",
        props: { placeholder: "请输入", clearable: true },
      },
    },
    {
      field: "content",
      title: "内容",
      span: 3,
      itemRender: {
        name: "$input",
        props: { placeholder: "请输入", clearable: true },
      },
    },
    {
      field: "userId",
      title: "作者",
      span: 3,
      itemRender: {
        name: "$select",
        props: {
          placeholder: "请选择",
          clearable: true,
          options: [
            { value: "1", label: "1" },
            { value: "2", label: "2" },
          ],
        },
      },
    },
    {
      span: "",
      align: "center",
      // collapseNode: true,
      itemRender: {
        name: "$buttons",
        children: [
          {
            props: {
              type: "submit",
              content: "查询",
              status: "primary",
            },
          },
          { props: { type: "reset", content: "重置" } },
        ],
      },
    },
  ],
});
const dialogFormConfig = ref({
  formSettings: {
    width: "80%",
    labelWidth: "100px",
    inline: false,
    size: "default",
  },
  formFields: {
    title: "",
    content: null,
    userId: "",
    user: "",
    likeCount: "",
  },
  formRules: {},
  formItems: [
    {
      field: "title",
      title: "标题：",
      span: 24,
      type: "input",
      inputType: "text",
      disabled: false,
    },
    {
      field: "content",
      title: "内容：",
      span: 24,
      type: "editor",
      inputType: "", //textarea
      placeholder: "请输入",
    },
  ],
  buttons: [
    // {
    //   type: "submit",
    //   status: "primary",
    //   content: "提交",
    // },
    // {
    //   type: "reset",
    //   status: "",
    //   content: "重置",
    // },
    // {
    //   type: "close", //cancel
    //   status: "info",
    //   content: "关闭",
    // },
  ],
});
const dialogVisible = ref({ val: false });
const dialogConfig = ref({
  title: "提示",
  width: "50%",
  height: "600px",
  clickModal: false,
  footer: {
    mode: "", //detail
    position: "right",
    buttons: [
      {
        label: "取消",
        value: "cancel",
        type: "info",
        prev: ["edit", "detail", "add"],
      },
      { label: "重置", value: "reset", type: "", prev: [] },
      { label: "确认", value: "confirm", type: "primary", prev: ["detail"] },
      {
        label: "提交",
        value: "submit",
        type: "primary",
        prev: ["edit", "add"],
      },
    ],
  },
});

async function clickRow(row, code, mode, column, rowIndex, $table) {
  // console.log("row:", row, code);
  if (code === "detail") {
    // dialogConfig.value.formData = row;
  } else if (code === "edit") {
    // dialogConfig.value.formData = row;
  } else if (code === "delete") {
    // await deleteBtn(row);
  } else if (code === "collect") {
    // console.log("collect:", row);
    if (!row.favoriteId) {
      let { id: articleId } = row;
      try {
        let res = await createFavorites({ articleId });
        ElMessage.success("收藏成功");
        gridOptions.value.refresh = true; //刷新
      } catch (err) {}
    } else {
      try {
        let res = await deleteFavorites({ id: row.favoriteId });
        ElMessage.success("取消收藏");
        gridOptions.value.refresh = true; //刷新
      } catch (err) {}
    }
  }
}

//表格开关
async function handleSwitchChange(row, column, type) {
  // console.log("handleSwitchChange:", type, row);
  if (type) {
    try {
      let res = await createFavorites({ articleId: row.id });
      ElMessage.success("收藏成功");
      gridOptions.value.refresh = true; //刷新
    } catch (err) {}
  } else {
    try {
      let res = await deleteFavorites({ id: row.favoriteId });
      ElMessage.success("取消收藏");
      gridOptions.value.refresh = true; //刷新
    } catch (err) {}
  }
}

async function setOptions() {
  try {
    {
      let res = await getUserListApi({});
      let data = res.data.data;
      for (let item of data) {
        item["value"] = item["id"];
        item["label"] = item["nickname"];
      }
      formConfig.value.items[2].itemRender.props["options"] = data;
    }
    // {
    //   let res = await getArticles({});
    //   let data = res.data.data;
    //   for (let item of data) {
    //     item["value"] = item["id"];
    //     item["label"] = item["title"];
    //   }
    //   formConfig.value.formItems[1].options = data;
    // }
  } catch (err) {}
}
setOptions();

function toolbarButtonClick(params) {
  // console.log("toolbarButtonClick", params);
  if (params.code === "add") {
    // 点击新增按钮
    return;
  }
}
function submitEvent(data) {
  // console.log("data:", data);
  //api
}

//分页
const currentChange = (page: number) => {
  console.log("page:", page);
  //api
};
</script>

<style lang="scss" scoped>
.w-home {
  padding: 20px 20px 0 20px;
}
</style>
