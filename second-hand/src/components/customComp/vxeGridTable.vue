<template>
  <div>
    <vxe-grid
      ref="gridTable"
      v-bind="gridOptions"
      v-on="gridEvent"
      :columns="props.columns"
      :formConfig="props.formConfig"
      :toolbar-config="props.toolbarConfig"
      @toolbar-button-click="toolbarButtonClick"
    >
      <template #html="{ row, column }">
        <div v-html="row[`${column['field']}`]"></div>
      </template>
      <template #button="{ row, column }">
        <el-button type="primary" size="small">{{
          row[`${column["field"]}`]
        }}</el-button>
      </template>
      <template #switch="{ row, column }">
        <el-switch
          v-model="row[`${column.field}`]"
          :active-value="1"
          :inactive-value="0"
          @change="handleSwitchChange(row, column)"
        ></el-switch>
      </template>
      <template #img="{ row, column }">
        <img :src="row[`${column['field']}`]" alt="" />
      </template>
      <template #href="{ row, column }">
        <a href="#" :target="row[`${column.field}`]">{{
          row[`${column.field}`]
        }}</a>
      </template>
      <!-- (item, index) in (props.operate as any[])  v-slot:operate="{ row }" -->
      <template
        #operate="{ row, column, rowIndex, $table }"
        v-if="formatOperates.length"
      >
        <vxe-button
          v-for="(item, index) in props.formatOperate(
            row,
            deepClone(formatOperates)
          )"
          size="small"
          type="text"
          :content="item.label"
          :status="item.status || 'primary'"
          @click="item.clickRow(row, column, rowIndex, $table)"
        ></vxe-button>
      </template>
    </vxe-grid>
    <!-- 弹框props.gridOptions.customDialog ? false : props.dialogVisible.val -->
    <Dialog
      v-if="!props.gridOptions.customDialog"
      :dialogVisible="
        props.gridOptions.customDialog ? { val: false } : dialogVisible
      "
      :dialogConfig="dialogConfig"
      @submit="dialogClick"
      @confirm="dialogClick"
      @cansel="dialogClick"
    >
      <!-- 弹框表单 -->
      <Form
        :formFields="props.dialogFormConfig.formFields"
        :formItems="dialogFormConfigItems"
        :buttons="props.dialogFormConfig.buttons"
        :formSettings="props.dialogFormConfig.formSettings"
        @submitEvent="submitEvent"
        @resetEvent="resetEvent"
        @close="close"
      ></Form>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import Dialog from "@/components/customComp/dialog.vue";
import Form from "@/components/customComp/form.vue";
import { ref, onMounted, computed, watch, watchEffect, nextTick } from "vue";
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
  "dialogClick",
  "handleSwitchChange",
]);
const props = defineProps({
  //可包含所有配置项...
  gridOptions: {
    type: Object,
    default: () => {
      return {
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
      };
    },
  },
  operate: {
    type: Array, //按钮配置
    default: () => [
      {
        label: "详情",
        code: "detail",
        status: "primary",
        clickRow: (row, column, rowIndex, $table) => {},
      },
      {
        label: "编辑",
        code: "edit",
        status: "primary",
        clickRow: (row, column, rowIndex, $table) => {},
      },
      {
        label: "删除",
        code: "delete",
        status: "danger",
        clickRow: (row, column, rowIndex, $table) => {},
      },
    ],
  },
  formatOperate: {
    type: Function, //动态渲染操作列
    default: (row, operate) => {
      return operate;
    },
  },
  columns: {
    type: Array,
    default: () => [
      { type: "checkbox", width: 60 },
      { type: "seq", width: 60 },
      { field: "username", title: "Name" },
      {
        field: "nickname",
        title: "Nickname",
        slots: { default: "html" },
        props: "nickname",
      },
      { field: "role", title: "Role" },
      {
        field: "avatar",
        title: "Avatar",
        showOverflow: true,
        formatter({ cellValue }) {
          return cellValue ? cellValue : "-";
        },
      },
      { title: "操作", width: 300, slots: { default: "operate" } },
    ],
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
              props: { placeholder: "请输入名称", clearable: true },
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
                clearable: true,
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
          { code: "add", name: "新增", status: "success" },
          { code: "delete", name: "删除" },
          // { code: "mark_cancel", name: "删除/取消" },
          // { code: "save", name: "保存", status: "success" },
        ],
        refresh: true, // 显示刷新按钮
        export: true,
        custom: true,
      };
    },
  },
  dialogVisible: {
    type: Object,
    default: () => {
      return { val: false };
    },
  },
  dialogConfig: {
    type: Object,
    default: () => {
      return {
        // dialogVisible: false,
        title: "提示",
        width: "50%",
        height: "600px",
        clickModal: false,
        footer: {
          mode: "", //custom——始终使用传入的值
          position: "right",
          buttons: [
            {
              label: "取消",
              value: "cancel",
              type: "info",
              prev: ["edit", "detail", "add"],
            },
            { label: "重置", value: "reset", type: "", prev: [] },
            {
              label: "确认",
              value: "confirm",
              type: "primary",
              prev: ["detail"],
            },
            {
              label: "提交",
              value: "submit",
              type: "primary",
              prev: ["edit", "add"],
            },
          ],
        },
      };
    },
  },
  dialogFormConfig: {
    type: Object,
    default: () => {
      return {
        formSettings: {
          width: "70%",
          labelWidth: "100px",
          inline: false,
          size: "default",
        },
        formFields: {
          username: "",
          password: "",
          nickname: "",
          role: "",
        },
        formItems: [
          {
            field: "username",
            title: "用户名：",
            span: 24,
            type: "input",
            inputType: "text", //切换时选择输入框类型
            disabled: true,
          },
          {
            field: "password",
            title: "密码：",
            span: 24,
            type: "input",
            inputType: "text",
            placeholder: "请输入",
          },
          {
            field: "nickname",
            title: "昵称：",
            span: 24,
            type: "input",
            inputType: "text",
            placeholder: "请输入",
          },
          {
            field: "role",
            title: "角色：",
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
        formRules: {},
        buttons: [
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
    default: ({ page, sorts, filters, form }) => {
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
    default: () => {},
  },
  updateDataApi: {
    type: Function, //更新数据api
    default: () => {},
  },
  deleteDataApi: {
    type: Function, //删除数据api
    default: () => {},
  },
});
const gridTable = ref();
const mode = ref("add"); //判断添加或编辑态add、edit
let gridOptions = ref(props.gridOptions);

// let pagerConfig = ref(props.pagerConfig);
let dialogConfig = ref(JSON.parse(JSON.stringify(props.dialogConfig)));
//
let dialogFormConfigItems = ref(
  JSON.parse(JSON.stringify(props.dialogFormConfig.formItems))
);
let dialogFormItemsOfEdit = computed(() => {
  let list = JSON.parse(JSON.stringify(props.dialogFormConfig.formItems));
  return list;
});
//根据传进来的编辑类型的items，转换成新增时的表单类型
let dialogFormItemsOfAdd = computed(() => {
  let list = JSON.parse(JSON.stringify(props.dialogFormConfig.formItems));
  for (let item of list) {
    if (item["disabled"] === true) {
      item["disabled"] = false;
    }
    if (item["type"] === "text") {
      item["type"] = "input";
    }
  }
  return list;
});
//转化成详情类型
let dialogFormItemsOfDetail = computed(() => {
  let list = JSON.parse(JSON.stringify(props.dialogFormConfig.formItems));
  for (let item of list) {
    if (item["type"] !== "text") {
      item["type"] = "text";
    }
  }
  return list;
});

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
              total: res.data.totalCount,
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
  (deleteDataApi, oldVal) => {
    props.gridOptions.proxyConfig.ajax.delete = ({ body }) => {
      let ids = [];
      body.removeRecords.forEach((item) => {
        ids.push(item.id);
      });
      return deleteDataApi({ id: ids });
    };
  },
  { immediate: true, deep: true }
);
// watchEffect(() => {
//   if (Array.isArray(props.operate) && props.operate.length) {
//     for (let operate of props.operate) {
//       operate["clickRow"] = function (row: Object, column, rowIndex, $table) {
//         if (operate["code"] === "detail") {
//           rowDetailBtn(row, column, rowIndex, $table);
//         } else if (operate["code"] === "edit") {
//           rowEditBtn(row, column, rowIndex, $table);
//         } else if (operate["code"] === "delete") {
//           rowDeleteBtn(row, column, rowIndex, $table);
//         }
//         emits("clickRow", row, operate["code"], mode, column, rowIndex, $table);
//       };
//     }
//   }
// });
let formatOperates = computed(() => {
  if (Array.isArray(props.operate) && props.operate.length) {
    for (let operate of props.operate) {
      operate["clickRow"] = function (row: Object, column, rowIndex, $table) {
        if (operate["code"] === "detail") {
          rowDetailBtn(row, column, rowIndex, $table);
        } else if (operate["code"] === "edit") {
          rowEditBtn(row, column, rowIndex, $table);
        } else if (operate["code"] === "delete") {
          rowDeleteBtn(row, column, rowIndex, $table);
        }
        emits("clickRow", row, operate["code"], mode, column, rowIndex, $table);
      };
    }
  }
  return props.operate;
});

//刷新
watch(
  () => props.gridOptions.refresh,
  (newVal: boolean, oldVal) => {
    if (newVal === true) {
      gridTable.value.commitProxy("query");
      props.gridOptions.refresh = false;
    }
  },
  { immediate: true }
);
//监听弹框模式
watch(
  () => mode.value,
  (newVal: string, oldVal) => {
    if (props.gridOptions.customDialog) return;
    //buttons显隐
    let newBtns = props.dialogConfig.footer.buttons?.filter((item) => {
      return item.prev.find((i) => i === newVal);
    });
    dialogConfig.value.footer.buttons = newBtns;
    //title
    const titles = { add: "新增", edit: "编辑", detail: "详情" };
    dialogConfig.value.title = titles[newVal];
  },
  { immediate: true }
);

onMounted(() => {
  nextTick(() => {
    // console.log("gridTable:", gridTable.value);
  });
});

function handleSwitchChange(row, column) {
  emits("handleSwitchChange", row, column, row[`${column["field"]}`]);
  // console.log("handleSwitchChange:", row[`${column["field"]}`], row, column);
}

function toolbarButtonClick(params) {
  emits("toolbarButtonClick", params);
  if (gridOptions.value.customDialog) return;
  // 点击了工具栏新增按钮
  if (params.code === "add") {
    mode.value = "add";
    //重置表单值
    let resetFormData = JSON.parse(
      JSON.stringify(props.dialogFormConfig.formFields)
    );
    for (let key in resetFormData) {
      resetFormData[key] = null;
    }
    props.dialogFormConfig.formFields = resetFormData;
    //改为新增类型的表单
    dialogFormConfigItems.value = JSON.parse(
      JSON.stringify(dialogFormItemsOfAdd.value)
    );
    props.dialogVisible.val = true;
  }
}

function rowDetailBtn(row, column, rowIndex, $table) {
  if (gridOptions.value.customDialog) return;
  mode.value = "detail";
  dialogFormConfigItems.value = JSON.parse(
    JSON.stringify(dialogFormItemsOfDetail.value)
  );
  props.dialogFormConfig.formFields = row;
  props.dialogVisible.val = true;
}

function rowEditBtn(row, column, rowIndex, $table) {
  if (gridOptions.value.customDialog) return;
  mode.value = "edit";
  dialogFormConfigItems.value = JSON.parse(
    JSON.stringify(dialogFormItemsOfEdit.value)
  );
  props.dialogFormConfig.formFields = JSON.parse(JSON.stringify(row));
  props.dialogVisible.val = true;
}

async function rowDeleteBtn(row, column, rowIndex, $table) {
  mode.value = "delete";
  ElMessageBox.confirm("确定要删除吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await props.deleteDataApi(row.id);
      gridTable.value.commitProxy("query"); //触发查询ajax.query
      ElMessage({
        type: "success",
        message: "删除成功",
      });
    })
    .catch(() => {});
}

//弹框按钮
async function dialogClick(value) {
  // emits(value, value);
  emits("dialogClick", value);
  if (gridOptions.value.customDialog) return;
  switch (value) {
    case "cancel": {
      props.dialogVisible.val = false;
      break;
    }
    case "confirm": {
      props.dialogVisible.val = false;
      break;
    }
    case "submit": {
      if (mode.value === "add") {
        let data = props.dialogFormConfig.formFields;
        try {
          let res = await props.addDataApi(data);
          ElMessage.success(res["data"]["msg"] || "新增成功");
          props.dialogVisible.val = false;
          gridTable.value.commitProxy("query"); //触发查询ajax.query，用于刷新数据并且保持当前页
          // gridTable.value.commitProxy('reload') // 触发查询 ajax.query，并清除表格所有状态，回到第一页
        } catch (error) {
          console.log(error);
        }
      } else if (mode.value === "edit") {
        let data = props.dialogFormConfig.formFields;
        try {
          let res = await props.updateDataApi(data);
          ElMessage.success(res["data"]["msg"] || "编辑成功");
          props.dialogVisible.val = false;
          gridTable.value.commitProxy("query"); //触发查询ajax.query
          // gridTable.value.commitProxy('reload') // 触发查询 ajax.query，并清除表格所有状态，回到第一页
        } catch (error) {
          console.log(error);
        }
      }
      break;
    }
    case "reset": {
      props.dialogVisible.val = false;
      break;
    }
  }
}

//弹框提交按钮，弃用
async function submitEvent(data) {
  emits("submitEvent", data);
  try {
    if (mode.value === "add") {
      let res = await props.addDataApi(data);
      if (res["data"]["code"] < 400) {
        ElMessage.success(res["data"]["msg"] || "新增成功");
        props.dialogVisible.val = false;
        // let newData = await props.getDataApi();
        // gridTable.value.loadData(newData.data.data);
        gridTable.value.commitProxy("query"); //触发查询ajax.query，用于刷新数据并且保持当前页
        // gridTable.value.commitProxy('reload') // 触发查询 ajax.query，并清除表格所有状态，回到第一页
      }
      props.dialogVisible.val = false;
    } else if (mode.value === "edit") {
      let res = await props.updateDataApi(data);
      if (res["data"]["code"] < 400) {
        ElMessage.success(res["data"]["msg"] || "编辑成功");
        props.dialogVisible.val = false;
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

//重置弹窗表单
function resetEvent(e) {
  // $form.value.resetFields();
}
//关闭弹窗
function close(e) {
  props.dialogVisible.val = e || false;
}
//深拷贝包含函数
function deepClone(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  let clone = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clone[key] = deepClone(obj[key]);
    }
  }
  return clone;
}
</script>
