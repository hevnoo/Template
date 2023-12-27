<template>
  <div class="w-home">
    <VxeGridTable
      :gridOptions="gridOptions"
      :columns="columns"
      :operate="operate"
      :formConfig="formConfig"
      :dialogConfig="dialogConfig"
      :dialogFormConfig="dialogFormConfig"
      :getDataApi="getData"
      :addDataApi="createData"
      :updateDataApi="updateData"
      :deleteDataApi="deleteData"
      @toolbarButtonClick="toolbarButtonClick"
      @clickRow="clickRow"
      @submitEvent="submitEvent"
    ></VxeGridTable>
    <!-- 弹框 -->
    <Dialog
      :dialogVisible="dialogVisible"
      :dialogConfig="dialogConfig"
      @dialogClick="dialogClick"
    >
      <!-- 弹框表单 -->
      <Form
        :formFields="dialogFormConfig.formFields"
        :formItems="dialogFormConfig.formItems"
        :buttons="dialogFormConfig.buttons"
        :formSettings="dialogFormConfig.formSettings"
        @submitEvent="submitEvent"
      ></Form>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import VxeGridTable from "@/components/customComp/vxeGridTable.vue";
import Dialog from "@/components/customComp/dialog.vue";
import Form from "@/components/customComp/form.vue";
import Pagination from "@/components/customComp/pagination.vue";
import { ref, onMounted, computed, watch } from "vue";
import {
  useRoute,
  useRouter,
  onBeforeRouteLeave,
  onBeforeRouteUpdate,
} from "vue-router";
import { getData, createData, updateData, deleteData } from "@/api/favorites";
import { getUserListApi, addUserApi, upUserApi, deleUserApi } from "@/api/user";
import { getData as getArticles } from "@/api/articles";
import { ElMessage, ElMessageBox } from "element-plus";
const route = useRoute();
const router = useRouter();

const currentPage = ref(1);
const total = ref(20);
const gridOptions = ref({
  customDialog: true, //是否自定义弹窗
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
  { field: "id", title: "ID" },
  { field: "authorName", title: "用户" },
  { field: "articleTitle", title: "文章", showOverflow: true },
  // {
  //   field: "likeCount",
  //   title: "收藏量",
  //   formatter({ cellValue }) {
  //     return cellValue ? cellValue : 0;
  //   },
  // },
  { title: "操作", width: 300, slots: { default: "operate" } },
]);
const operate = ref([
  { label: "详情", code: "detail", status: "" },
  {
    label: "编辑",
    code: "edit",
    status: "primary",
  },
  { label: "删除", code: "delete", status: "danger" },
]);
//搜索框
let formConfig = ref({
  titleWidth: "",
  titleAlign: "left",
  items: [
    {
      field: "authorName",
      title: "用户",
      span: 3,
      itemRender: {
        name: "$input",
        props: { placeholder: "请输入" },
      },
    },
    {
      field: "articleTitle",
      title: "文章",
      span: 3,
      itemRender: {
        name: "$input",
        props: { placeholder: "请输入" },
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
let dialogFormConfig = ref({
  formSettings: {
    width: "70%",
    labelWidth: "100px",
    inline: false,
    size: "default",
  },
  formFields: {
    id: "",
    authorId: "",
    author: "",
    article: "",
    articleId: "",
  },
  formRules: {},
  formItems: [
    {
      field: "authorName",
      value: "userId", //外键id
      title: "用户：",
      span: 24,
      type: "select",
      inputType: "text",
      disabled: false,
      placeholder: "请选择",
      options: [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
      ],
    },
    {
      field: "articleTitle",
      value: "articleId",
      title: "文章：",
      span: 24,
      type: "select",
      inputType: "text",
      placeholder: "请选择",
      options: [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
      ],
    },
  ],
  buttons: [],
});
const dialogVisible = ref({ val: false });
const dialogConfig = ref({
  dialogVisible: false,
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
const dialogConfigBtns = JSON.parse(
  JSON.stringify(dialogConfig.value.footer.buttons)
);

async function clickRow(row, code) {
  console.log("row:", row, code);
  if (code === "detail") {
    dialogFormConfig.value.formFields = row;
    dialogVisible.value.val = true;
  } else if (code === "edit") {
    dialogFormConfig.value.formFields = JSON.parse(JSON.stringify(row));
    dialogVisible.value.val = true;
  } else if (code === "delete") {
    // await deleteBtn(row);
  }
  //buttons显隐
  let newBtns = dialogConfigBtns?.filter((item) => {
    return item.prev.find((i) => i === code);
  });
  dialogConfig.value.footer.buttons = newBtns;
}

function toolbarButtonClick(params) {
  if (params.code === "add") {
    // 点击新增按钮
    // dialogFormConfig.value.formFields = JSON.parse(JSON.stringify(params.row));
    dialogVisible.value.val = true;
    //buttons显隐
    let newBtns = dialogConfigBtns?.filter((item) => {
      return item.prev.find((i) => i === params.code);
    });
    dialogConfig.value.footer.buttons = newBtns;
  }
}
function submitEvent(data) {
  // console.log("data:", data);
  //api
}

async function getOptions() {
  try {
    {
      let res = await getUserListApi({});
      let data = res.data.data;
      for (let item of data) {
        item["value"] = item["id"];
        item["label"] = item["nickname"];
      }
      dialogFormConfig.value.formItems[0].options = data;
    }
    {
      let res = await getArticles({});
      let data = res.data.data;
      for (let item of data) {
        item["value"] = item["id"];
        item["label"] = item["title"];
      }
      dialogFormConfig.value.formItems[1].options = data;
    }
  } catch (err) {}
}
getOptions();

async function dialogClick(value) {
  console.log("dialogClick:", value);
  switch (value) {
    case "cancel": {
      dialogVisible.value.val = false;
      break;
    }
    case "confirm": {
      dialogVisible.value.val = false;
      break;
    }
    case "submit": {
      gridOptions.value.refresh = true; //刷新
      break;
    }
    case "reset": {
      dialogVisible.value.val = false;
      break;
    }
  }
}
</script>

<style lang="scss" scoped>
.w-home {
  padding: 20px 20px 0 20px;
}
</style>
