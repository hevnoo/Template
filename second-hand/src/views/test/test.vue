<template>
  <div class="w-home">
    <VxeGridTable
      :columns="columns"
      :operate="operate"
      :dialogVisible="dialogVisible"
      :dialogConfig="dialogConfig"
      :dialogFormConfig="dialogFormConfig"
      :getDataApi="getUserListApi"
      :addDataApi="addUserApi"
      :updateDataApi="upUserApi"
      :deleteDataApi="deleUserApi"
      @toolbarButtonClick="toolbarButtonClick"
      @clickRow="clickRow"
      @submitEvent="submitEvent"
    ></VxeGridTable>
    <!-- <Pagination
        :currentPage="currentPage"
        :total="total"
        @currentChange="currentChange"
        :backgroundColor="'#389a99'"
      ></Pagination> -->
  </div>
</template>

<script setup lang="ts">
import VxeTableWrapper from "@/components/customComp/vxeTable.vue";
import VxeGridTable from "@/components/customComp/vxeGridTable.vue";
import Pagination from "@/components/customComp/pagination.vue";
import { ref, onMounted, computed, watch } from "vue";
import {
  useRoute,
  useRouter,
  onBeforeRouteLeave,
  onBeforeRouteUpdate,
} from "vue-router";
import { getUserListApi, addUserApi, upUserApi, deleUserApi } from "@/api/user";
import { ElMessage, ElMessageBox } from "element-plus";
const route = useRoute();
const router = useRouter();

const currentPage = ref(1);
const total = ref(20);
const columns = ref([
  { type: "checkbox", width: 60 },
  { type: "seq", width: 60 },
  { field: "username", title: "Name" },
  { field: "nickname", title: "Nickname" },
  { field: "role", title: "Role" },
  { field: "avatar", title: "Avatar", showOverflow: true },
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
const dialogFormConfig = ref({
  formFields: {
    username: "",
    password: null,
    nickname: "",
    role: "",
  },
  formRules: {},
  formItems: [
    {
      field: "username",
      title: "用户名",
      span: 24,
      type: "input",
      inputType: "text",
      disabled: true,
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
      inputType: "text",
      placeholder: "请选择",
      options: [
        { value: "admin", label: "管理员" },
        { value: "user", label: "用户" },
      ],
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

async function clickRow(row, code) {
  // console.log("row:", row, code);
  if (code === "detail") {
    // dialogConfig.value.formData = row;
  } else if (code === "edit") {
    // dialogConfig.value.formData = row;
  } else if (code === "delete") {
    // await deleteBtn(row);
  }
}

function toolbarButtonClick(params) {
  // console.log("toolbarButtonClick", params);
  if (params.code === "add") {
    // 点击新增按钮
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

// async function detailBtn(row) {
//   console.log(row);
// }
// async function editBtn(row) {
//   console.log(row);
//   operate.value[1].row = row;
//   // await upUserApi(row);
// }
async function deleteBtn(row) {
  ElMessageBox.confirm("确定要删除吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      await deleUserApi(row);
      ElMessage({
        type: "success",
        message: "删除成功",
      });
    })
    .catch(() => {});
}
</script>

<style lang="scss" scoped>
.w-home {
  padding: 20px 20px 0 20px;
}
</style>
