<template>
  <div>
    <vxe-grid
      ref="gridTable"
      v-bind="gridOptions"
      v-on="gridEvent"
      :columns="props.columns"
      :formConfig="props.formConfig"
      :toolbar-config="props.toolbarConfig"
      :pager-config="props.pagerConfig"
      @toolbar-button-click="toolbarButtonClick"
    >
      <template #operate="{ row }">
        <vxe-button
          v-if="props.operate.length"
          v-for="(item, index) in (props.operate as any)"
          size="small"
          :content="item.label"
          :status="item.status"
          @click="item.clickRow(row)"
        ></vxe-button>
      </template>
    </vxe-grid>
    <!-- 弹框 -->
    <vxe-modal
      v-model="isModalOpen"
      :title="props.dialogConfig.title"
      :width="props.dialogConfig.width"
      :min-width="props.dialogConfig.minWidth"
      :min-height="props.dialogConfig.minHeight"
      :loading="props.dialogConfig.loading"
      :resize="props.dialogConfig.resize"
      :destroy-on-close="props.dialogConfig.destroyOnClose"
    >
      <template #default>
        <!-- 表单 -->
        <VxeForm
          :formData="props.dialogConfig.formData"
          :formItems="props.dialogConfig.formItems"
          :dialogBtns="props.dialogConfig.dialogBtns"
          @submitEvent="submitEvent"
          @resetEvent="resetEvent"
          @close="close"
        ></VxeForm>
      </template>
    </vxe-modal>
  </div>
</template>

<script lang="ts" setup>
import VxeForm from "@/components/commonComp/vxeForm.vue";
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  VxeGridProps,
  VXETable,
  VxeTableInstance,
  VxeColumnPropTypes,
  VxeFormPropTypes,
  VxeFormItemPropTypes,
  VxeTableEvents,
} from "vxe-table";
import XEUtils from "xe-utils";
import { ElMessage, ElMessageBox } from "element-plus";
const route = useRoute();
const router = useRouter();
const emits = defineEmits([
  "proxyQuery",
  "proxyDelete",
  "proxySave",
  "toolbarButtonClick",
  "clickRow",
  "submitEvent",
  "resetEvent",
  "close",
]);
const props = defineProps({
  isModalOpen: {
    type: Boolean,
    default: () => false,
  },
  operate: {
    type: Array, //按钮配置
    default: () => [
      { label: "详情", code: "detail", status: "", clickRow: (row) => {} },
      {
        label: "编辑",
        code: "edit",
        status: "primary",
        clickRow: (row) => {},
      },
      {
        label: "删除",
        code: "delete",
        status: "danger",
        clickRow: (row) => {},
      },
    ],
  },
  //可包含所有配置项...
  gridOptions: {
    type: Object,
    default: () => {
      return {
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
              url: "/user/deleUser",
            },
          },
        },
        checkboxConfig: {
          // labelField: "id",
          reserve: true,
          highlight: true,
          range: true,
        },
      };
    },
  },
  columns: {
    type: Array,
    default: () => [
      { type: "checkbox", width: 60 },
      { type: "seq", width: 60 },
      { field: "username", title: "Name" },
      { field: "nickname", title: "Nickname" },
      { field: "role", title: "Role" },
      { field: "avatar", title: "Avatar", showOverflow: true },
      { title: "操作", width: 300, slots: { default: "operate" } },
    ],
  },
  pagerConfig: {
    type: Object,
    default: () => {
      return {
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 50, 100, 200, 500],
      };
    },
  },
  formConfig: {
    type: Object,
    default: () => {
      return {
        titleWidth: "",
        titleAlign: "left",
        items: [
          {
            field: "username",
            title: "名称",
            span: 3,
            // titlePrefix: {
            //   message: "app.body.valid.rName",
            //   icon: "vxe-icon-question-circle-fill",
            // },
            itemRender: {
              name: "$input",
              props: { placeholder: "请输入名称" },
            },
          },
          {
            field: "role",
            title: "角色",
            span: 3,
            itemRender: {
              name: "$select",
              props: {
                placeholder: "请选择角色",
                options: [
                  { value: "admin", label: "管理员" },
                  { value: "user", label: "用户" },
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
      };
    },
  },
  toolbarConfig: {
    type: Object,
    default: () => {
      return {
        buttons: [
          { code: "add", name: "新增" },
          { code: "delete", name: "删除" },
          // { code: "mark_cancel", name: "删除/取消" },
          { code: "save", name: "保存", status: "success" },
        ],
        refresh: true, // 显示刷新按钮
        export: true,
        custom: true,
      };
    },
  },
  //弹框相关配置
  dialogConfig: {
    type: Object,
    default: () => {
      return {
        showEdit: false,
        title: "提示",
        width: "800px",
        minWidth: "800px",
        minHeight: "600px",
        loading: false,
        resize: true,
        destroyOnClose: true,
        formData: {
          username: "",
          password: "",
          nickname: "",
          role: "",
        },
        formRules: {},
        formItems: [
          {
            field: "username",
            title: "名称",
            span: 24,
            inputType: "text", //切换时选择输入框类型
          },
          {
            field: "password",
            title: "密码",
            span: 24,
            type: "input",
            inputType: "text",
            placeholder: "请输入",
          },
          {
            field: "nickname",
            title: "昵称",
            span: 24,
            type: "input",
            inputType: "text",
            placeholder: "请输入",
          },
          {
            field: "role",
            title: "角色",
            span: 24,
            type: "select",
            inputType: "select",
            placeholder: "请选择",
            options: [
              { value: "1", label: "admin" },
              { value: "2", label: "user" },
            ],
          },
        ],
        dialogBtns: [
          {
            type: "submit",
            status: "primary",
            content: "提交",
          },
          {
            type: "reset",
            status: "",
            content: "重置",
          },
          // {
          //   type: "close", //cancel
          //   status: "info",
          //   content: "关闭",
          // },
        ],
      };
    },
  },

  getDataApi: {
    type: Function, //{ page, sorts, filters, form }参数
    default:
      () =>
      ({ page, sorts, filters, form }) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              result: [],
              page: {
                total: 0,
              },
            });
          }, 500);
        });
      },
  },
  addDataApi: {
    type: Function, //添加数据api
    default: () => () => {},
  },
  updateDataApi: {
    type: Function, //更新数据api
    default: () => () => {},
  },
  deleteDataApi: {
    type: Function, //删除数据api
    default: () => () => {},
  },
});
const gridTable = ref();
const isModalOpen = ref(props.isModalOpen);
const mode = ref("add"); //判断添加或编辑态add、edit
//用于还原
let oldFormItems = ref(
  JSON.parse(JSON.stringify(props.dialogConfig.formItems))
);
let gridOptions = ref(props.gridOptions);
// let pagerConfig = ref(props.pagerConfig);

watch(
  () => props.getDataApi,
  (newVal, oldVal) => {
    props.gridOptions.proxyConfig.ajax.query = ({
      page,
      sorts,
      filters,
      form,
    }) => {
      return new Promise((resolve) => {
        let queryParams = {
          currentPage: page.currentPage,
          pageSize: page.pageSize,
          ...form,
          // ...sorts,
          // ...filters,
        };
        // 处理排序条件
        const firstSort = sorts[0];
        if (firstSort) {
          queryParams.sort = firstSort.field;
          queryParams.order = firstSort.order;
        }
        // console.log("XEUtils:", XEUtils.serialize(queryParams));
        newVal(queryParams).then((res) => {
          resolve({
            result: res.data.data,
            page: {
              total: res.data.total,
            },
          });
        });
      });
    };
  },
  { immediate: true, deep: true }
);
watch(
  () => props.deleteDataApi,
  (newVal, oldVal) => {
    props.gridOptions.proxyConfig.ajax.delete = ({ body }) => {
      let ids = [];
      body.removeRecords.forEach((item) => {
        ids.push(item.id);
      });
      return newVal(ids);
    };
  },
  { immediate: true, deep: true }
);
watch(
  () => props.operate,
  (newVal: any, oldVal) => {
    if (Array.isArray(newVal) && newVal.length) {
      newVal.forEach((operate: Object) => {
        operate["clickRow"] = function (row: Object) {
          if (operate["code"] === "detail") {
            rowDetailBtn(row);
          } else if (operate["code"] === "edit") {
            rowEditBtn(row);
          } else if (operate["code"] === "delete") {
            rowDeleteBtn(row);
          }
          emits("clickRow", row, operate["code"], mode);
        };
      });
    }
  },
  { immediate: true, deep: true }
);
watch(
  () => mode.value,
  (newVal: any, oldVal) => {
    if (newVal === "add" || newVal === "edit") {
      props.dialogConfig.dialogBtns = [
        {
          type: "submit",
          status: "primary",
          content: "提交",
        },
        {
          type: "reset",
          status: "",
          content: "重置",
        },
      ];
    } else {
      props.dialogConfig.dialogBtns = [
        {
          type: "close", //cancel
          status: "info",
          content: "关闭",
        },
      ];
    }
  },
  { immediate: true, deep: true }
);

onMounted(() => {});

function toolbarButtonClick(params) {
  if (params.code === "add") {
    // 点击了工具栏新增按钮
    let resetFormData = JSON.parse(JSON.stringify(props.dialogConfig.formData));
    for (let key in resetFormData) {
      resetFormData[key] = null;
    }
    props.dialogConfig.formData = resetFormData;
    props.dialogConfig.formItems = JSON.parse(
      JSON.stringify(oldFormItems.value)
    );
    mode.value = "add";
    isModalOpen.value = true;
    //将文本转换为输入框等编辑类型
    props.dialogConfig.formItems.forEach((item) => {
      if (!item["type"] || item["type"] === "none") {
        if (item["inputType"] === "text" || item["inputType"] === "input") {
          item["type"] = "input";
        }
      }
    });
  }
  emits("toolbarButtonClick", params);
}

//弹框提交按钮
async function submitEvent(data) {
  emits("submitEvent", data);
  try {
    if (mode.value === "add") {
      let res = await props.addDataApi(data);
      if (res["data"]["code"] < 400) {
        ElMessage.success(res["data"]["msg"] || "新增成功");
        isModalOpen.value = false;
        // let newData = await props.getDataApi();
        // gridTable.value.loadData(newData.data.data);
        gridTable.value.commitProxy("query"); //触发查询ajax.query，用于刷新数据并且保持当前页
        // gridTable.value.commitProxy('reload') // 触发查询 ajax.query，并清除表格所有状态，回到第一页
      }
      isModalOpen.value = false;
    } else if (mode.value === "edit") {
      let res = await props.updateDataApi(data);
      if (res["data"]["code"] < 400) {
        ElMessage.success(res["data"]["msg"] || "编辑成功");
        isModalOpen.value = false;
        gridTable.value.commitProxy("query"); //触发查询ajax.query
        // gridTable.value.commitProxy('reload') // 触发查询 ajax.query，并清除表格所有状态，回到第一页
      }
    }
  } catch (error) {
    console.log(error);
  }
}

const gridEvent = {
  proxyQuery(val) {
    // console.log("数据代理查询事件");
    emits("proxyQuery", val);
  },
  proxyDelete(val) {
    // console.log("数据代理删除事件");
    emits("proxyDelete", val);
  },
  proxySave(val) {
    // console.log("数据代理保存事件");
    emits("proxySave", val);
  },
};

function rowDetailBtn(row) {
  mode.value = "detail";
  isModalOpen.value = true;
  //转换文本格式
  let formItems = JSON.parse(JSON.stringify(props.dialogConfig.formItems));
  formItems.forEach((item) => {
    item.type = "";
  });
  props.dialogConfig.formItems = formItems;
  props.dialogConfig.formData = row;
}
function rowEditBtn(row) {
  mode.value = "edit";
  isModalOpen.value = true;
  props.dialogConfig.formItems = JSON.parse(JSON.stringify(oldFormItems.value));
  props.dialogConfig.formData = row;
}
async function rowDeleteBtn(row) {
  mode.value = "delete";
  ElMessageBox.confirm("确定要删除吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await props.deleteDataApi(row);
      gridTable.value.commitProxy("query"); //触发查询ajax.query
      ElMessage({
        type: "success",
        message: "删除成功",
      });
    })
    .catch(() => {});
}
//重置弹窗表单
function resetEvent(e) {
  // $form.value.resetFields();
}
//关闭弹窗
function close(e) {
  isModalOpen.value = e || false;
}
</script>
