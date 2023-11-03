<template>
  <div class="wrapper-form">
    <vxe-form
      title-colon
      ref="formRef"
      title-align="right"
      title-width="100"
      :data="formData"
      :rules="formRules"
      :loading="loading"
      @submit="submitEvent"
      @reset="resetEvent"
    >
      <vxe-form-gather
        :span="12"
        v-for="(item, index) in (props.formItems as any)"
        :key="item.field"
      >
        <vxe-form-item
          v-if="item.type === 'input'"
          :title="item.title"
          :field="item.field"
          :span="item.span"
        >
          <template #default="params">
            <vxe-input
              v-model="params.data[`${item.field}`]"
              type="text"
              :placeholder="item.placeholder || '请输入'"
              clearable
              @change="changeEvent(params)"
            ></vxe-input>
          </template>
        </vxe-form-item>
        <vxe-form-item
          v-else-if="item.type === 'select'"
          :title="item.title"
          :field="item.field"
          :span="item.span"
          :item-render="{}"
          title-overflow
        >
          <template #default="params">
            <vxe-select
              v-model="params.data[`${item.field}`]"
              :placeholder="item.placeholder || '请选择'"
              clearable
              @change="changeEvent(params)"
            >
              <vxe-option
                v-for="option in item.options"
                :value="option.value"
                :label="option.label"
              ></vxe-option>
            </vxe-select>
          </template>
        </vxe-form-item>
        <vxe-form-item
          v-else-if="item.type === 'date'"
          :title="item.title"
          :field="item.field"
          :span="item.span"
          :item-render="{}"
          title-overflow="ellipsis"
        >
          <template #default="{ data }">
            <vxe-input
              v-model="data[`${item.field}`]"
              type="date"
              :placeholder="item.placeholder || '请选择日期'"
              clearable
            ></vxe-input>
          </template>
        </vxe-form-item>
        <vxe-form-item
          v-else-if="item.type === 'textarea'"
          :title="item.title"
          :field="item.field"
          :span="item.span"
          :item-render="{}"
        >
          <template #default="{ data }">
            <vxe-textarea
              v-model="data[`${item.field}`]"
              :placeholder="item.placeholder || '请输入'"
              :autosize="{ minRows: 6, maxRows: 10 }"
              clearable
            ></vxe-textarea>
          </template>
        </vxe-form-item>
        <vxe-form-item
          v-else-if="item.type === 'custom'"
          :title="item.title"
          :field="item.field"
          :span="item.span"
        >
          <template #title>
            <span style="color: red">自定义标题</span>
          </template>
          <template #default="{ data }">
            <span>自定义 {{ data[`${item.field}`] }}</span>
          </template>
        </vxe-form-item>
        <vxe-form-item
          v-else
          :title="item.title"
          :field="item.field"
          :span="item.span"
        >
        </vxe-form-item>
      </vxe-form-gather>
      <vxe-form-item align="center" span="24">
        <template #default>
          <template v-for="(btns, i) in (props.dialogBtns as any)" :key="i">
            <vxe-button
              v-if="btns.type === 'cancel' || btns.type === 'close'"
              :type="btns.type"
              :status="btns.status"
              :content="btns.content"
              @click="btns.close"
            ></vxe-button>
            <vxe-button
              v-else
              :type="btns.type"
              :status="btns.status"
              :content="btns.content"
            ></vxe-button>
          </template>
          <!-- <vxe-button
            v-for="(btns, i) in (props.dialogBtns as any)"
            :key="i"
            :type="btns.type"
            :status="btns.status"
            :content="btns.content"
            @click="btns.close ? btns.close : ''"
          ></vxe-button> -->
        </template>
      </vxe-form-item>
    </vxe-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, defineProps, computed, watch, onMounted } from "vue";
import { useRoute, useRouter, onBeforeRouteUpdate } from "vue-router";
import { storeToRefs } from "pinia";
import {
  VXETable,
  VxeFormInstance,
  VxeFormPropTypes,
  VxeFormEvents,
} from "vxe-table";
const route = useRoute();
const router = useRouter();
interface FormDataVO {
  name: string;
  nickname: string;
  sex: string;
  age: number;
  date: string;
  address: string;
}
const emits = defineEmits([
  "submitEvent",
  "resetEvent",
  "changeEvent",
  "close",
]);
const props = defineProps({
  formData: {
    type: Object,
    default: () => {
      return {
        username: "test1",
        nickname: "Testing",
        sex: "",
        age: 24,
        date: "",
        address: "地址",
      };
    },
  },
  formItems: {
    type: Array,
    default: () => [
      {
        field: "username",
        title: "名称",
        span: 24,
        inputType: "text", //input
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
        field: "sex",
        title: "性别",
        span: 24,
        type: "select",
        inputType: "select",
        placeholder: "请选择性别",
        options: [
          { value: "1", label: "一" },
          { value: "2", label: "二" },
        ],
      },
    ],
  },
  formRules: {
    type: Object,
    default: () => {
      return {
        nickname: [
          { required: true, message: "请输入名称" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符" },
        ],
        sex: [{ required: true, message: "请选择性别" }],
        age: [
          { required: true, message: "请输入年龄" },
          {
            validator({ itemValue }) {
              // 自定义校验
              if (Number(itemValue) > 35 || Number(itemValue) < 18) {
                return new Error("年龄在 18 ~ 35 之间");
              }
            },
          },
        ],
        date: [{ required: true, message: "必填校验" }],
      };
    },
  },
  dialogBtns: {
    type: Array,
    default: () => [
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
      {
        type: "close", //cancel
        status: "info",
        content: "关闭",
      },
    ],
  },
});
const formData = ref(props.formData);
const formRules = ref<VxeFormPropTypes.Rules>(props.formRules);
const formRef = ref<VxeFormInstance>();
const loading = ref(false);
const isModalOpen = ref(true);

watch(
  () => props.dialogBtns,
  (newVal: any, oldVal) => {
    if (Array.isArray(newVal) && newVal.length) {
      newVal.forEach((item: Object) => {
        if (item["type"] && item["type"] === "submit") {
        } else if (item["type"] && item["type"] === "reset") {
        } else if (
          (item["type"] && item["type"] === "cancel") ||
          item["type"] === "close"
        ) {
          item["close"] = () => {
            isModalOpen.value = false;
            emits("close", isModalOpen.value);
          };
        }
      });
    }
  },
  { immediate: true, deep: true }
);

const changeEvent = (params: any) => {
  emits("changeEvent", params);
  const $form = formRef.value;
  if ($form) {
    $form.updateStatus(params);
  }
};

const submitEvent: VxeFormEvents.Submit = ({ data }) => {
  emits("submitEvent", data);
  //   loading.value = true;
  //   setTimeout(() => {
  //     loading.value = false;
  //     VXETable.modal.message({ content: "保存成功", status: "success" });
  //   }, 1000);
};

const resetEvent: VxeFormEvents.Reset = () => {
  emits("resetEvent");
  // console.log("formRef", formRef.value);
  formRef.value.reset();
  //   VXETable.modal.message({ content: "重置事件", status: "info" });
};
</script>

<style scoped lang="scss">
.wrapper-form {
  width: 100%;
}
</style>
