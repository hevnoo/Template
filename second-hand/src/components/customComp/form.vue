<template>
  <el-form
    class="dynamic-form"
    :model="formFields"
    :rules="formRules"
    :size="props.formSettings.size"
    :label-width="props.formSettings.labelWidth"
    :inline="props.formSettings.inline"
    status-icon
  >
    <el-form-item
      :style="{ width: props.formSettings.width || '80%' }"
      v-for="item in (formItems as any[])"
      :key="item.field"
      :label="item.title"
      :prop="item.field"
    >
      <template v-if="item.type === 'text'">
        <!-- <el-text>{{ formFields[item.field] }}</el-text> -->
        <div v-html="formFields[item.field]"></div>
      </template>
      <!-- 输入框text -->
      <template v-else-if="item.type === 'input'">
        <el-input
          v-model="formFields[item.field]"
          :type="item.inputType"
          :disabled="item?.disabled || false"
          :placeholder="item.placeholder || '请输入'"
          clearable
        />
      </template>
      <template v-else-if="item.type === 'editor'">
        <TextEditor
          v-model="formFields[item.field]"
          :placeholder="item.placeholder || '请输入'"
        />
      </template>
      <!-- 选择框 item['fkId'] ? formFields[item.fkId] : formFields[item.field] -->
      <template v-else-if="item.type === 'select'">
        <el-select
          v-model="formFields[item.value]"
          :disabled="item?.disabled || false"
          :placeholder="item.placeholder || '请选择'"
          clearable
        >
          <el-option
            v-for="(option, index) in item.options"
            :key="index"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </template>
      <template v-else-if="item.type === 'cascader'">
        <el-cascader
          v-model="formFields[item.value]"
          :options="item.cascaderOptions"
          :props="item.cascaderProps"
          :placeholder="item.placeholder || '请选择'"
          :disabled="item?.disabled || false"
          clearable
        />
      </template>
      <template v-else-if="item.type === 'checkbox'">
        <el-checkbox-group v-model="formFields[item.field]">
          <el-checkbox
            v-for="(option, index) in item.checkboxOptions"
            :key="index"
            :label="option.value"
          >
            {{ option.label }}
          </el-checkbox>
        </el-checkbox-group>
      </template>
      <template v-else-if="item.type === 'radio'">
        <el-radio-group v-model="formFields[item.field]">
          <el-radio
            v-for="(option, index) in item.radioOptions"
            :key="index"
            :label="option.value"
          >
            {{ option.label }}
          </el-radio>
        </el-radio-group>
      </template>
      <template v-else-if="item.type === 'date'">
        <el-date-picker
          v-model="formFields[item.field]"
          type="date"
          :placeholder="item.placeholder || '请选择日期'"
          :format="item.dateFormat"
        />
      </template>
      <template v-else-if="item.type === 'datetime'">
        <el-date-picker
          v-model="formFields[item.field]"
          type="datetime"
          :placeholder="item.placeholder || '请选择日期时间'"
          :format="item.dateTimeFormat"
        />
      </template>
      <template v-else-if="item.type === 'time'">
        <el-time-picker
          v-model="formFields[item.field]"
          isRange
          :placeholder="item.placeholder || '请选择时间范围'"
        />
      </template>
      <template v-else-if="item.type === 'timeSelect'">
        <el-select
          v-model="formFields[item.field]"
          :placeholder="item.placeholder || '请选择时间'"
        >
          <el-option
            v-for="(option, index) in item.timeOptions"
            :key="index"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </template>
      <!-- 穿梭框 -->
      <template v-else-if="item.type === 'transfer'">
        <el-transfer
          v-model="formFields[item.field]"
          :data="item.transferData"
          :titles="item.transferTitles"
          :filterable="item.filterable"
        />
      </template>
      <!-- 上传 :onPreview="handlePreview" :onRemove="handleRemove"-->
      <template v-else-if="item.type === 'upload'">
        <el-upload action="/upload" list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
      </template>
      <!-- 自定义 -->
      <template v-else-if="item.type === 'custom'">
        <slot></slot>
      </template>

      <!-- 其他表单元素类型的处理 -->
    </el-form-item>
    <el-form-item v-if="buttons.length">
      <el-button
        v-for="(button, index) in (buttons as any[])"
        :key="index"
        :type="button.status"
        @click="handleButtonClick(button.type)"
      >
        {{ button.content }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import TextEditor from "@/components/customComp/textEditor.vue";
import { reactive, ref } from "vue";
import type { FormInstance, FormRules } from "element-plus";
const emits = defineEmits(["submitForm", "resetForm", "confirm"]);
let props = defineProps({
  formSettings: {
    type: Object,
    default: () => {
      return {
        width: "70%",
        labelWidth: "100px",
        inline: false,
        size: "default",
      };
    },
  },
  formFields: {
    type: Object,
    default: () => {
      return {
        username: "",
        password: "",
        nickname: "",
        role: "",
      };
    },
  },
  formItems: {
    type: Array,
    default: () => [
      {
        field: "username",
        title: "用户名",
        span: 24,
        type: "input",
        inputType: "text", //input
        disabled: true,
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
        value: "man",
        title: "性别",
        span: 24,
        type: "select",
        inputType: "select",
        placeholder: "请选择性别",
        options: [
          { value: "man", label: "男" },
          { value: "woman", label: "女" },
        ],
      },
    ],
  },
  formRules: {
    type: Object,
    default: () => {
      return {
        // nickname: [
        //   { required: true, message: "请输入名称" },
        //   { min: 1, max: 10, message: "长度在 1 到 10 个字符" },
        // ],
        // sex: [{ required: true, message: "请选择性别" }],
        // age: [
        //   { required: true, message: "请输入年龄" },
        //   {
        //     validator({ itemValue }) {
        //       // 自定义校验
        //       if (Number(itemValue) > 35 || Number(itemValue) < 18) {
        //         return new Error("年龄在 18 ~ 35 之间");
        //       }
        //     },
        //   },
        // ],
        // date: [{ required: true, message: "必填校验" }],
      };
    },
  },
  buttons: {
    type: Array,
    default: () => [
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
  },
});
interface RuleForm {
  name: string;
  region: string;
  count: string;
  date1: string;
  date2: string;
  delivery: boolean;
  type: string[];
  resource: string;
  desc: string;
}

const ruleFormRef = ref<FormInstance>();
// const ruleForm = reactive<RuleForm>({
//   name: "Hello",
//   region: "",
//   count: "",
//   date1: "",
//   date2: "",
//   delivery: false,
//   type: [],
//   resource: "",
//   desc: "",
// });

const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: "Please input Activity name", trigger: "blur" },
    { min: 3, max: 5, message: "Length should be 3 to 5", trigger: "blur" },
  ],
  region: [
    {
      required: true,
      message: "Please select Activity zone",
      trigger: "change",
    },
  ],
  count: [
    {
      required: true,
      message: "Please select Activity count",
      trigger: "change",
    },
  ],
  date1: [
    {
      type: "date",
      required: true,
      message: "Please pick a date",
      trigger: "change",
    },
  ],
  date2: [
    {
      type: "date",
      required: true,
      message: "Please pick a time",
      trigger: "change",
    },
  ],
  type: [
    {
      type: "array",
      required: true,
      message: "Please select at least one activity type",
      trigger: "change",
    },
  ],
  resource: [
    {
      required: true,
      message: "Please select activity resource",
      trigger: "change",
    },
  ],
  desc: [
    { required: true, message: "Please input activity form", trigger: "blur" },
  ],
});

const handleButtonClick = (type: string) => {
  if (type === "submit") {
    submitForm();
  } else if (type === "reset") {
    resetForm(ruleFormRef.value);
  } else if (type === "close") {
    closeForm();
  }
};
const submitForm = () => {
  console.log("Submitting form...");
  // 在这里可以执行表单提交的逻辑
};

const closeForm = () => {
  console.log("Closing form...");
  // 在这里可以执行关闭表单的逻辑
};
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>

<style scoped lang="scss">
// label样式
// ::v-deep .el-form-item__label {
//   width: 120px;
// }
</style>
