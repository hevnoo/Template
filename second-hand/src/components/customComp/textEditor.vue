<template>
  <div class="container-editor">
    <div style="border: 1px solid #ccc">
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      <Editor
        style="min-height: 200px; overflow-y: hidden"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
        @onChange="handleChange"
      />
    </div>
  </div>
  <div v-html="valueHtml"></div>
</template>

<script setup lang="ts">
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import {
  ref,
  onMounted,
  computed,
  watch,
  watchEffect,
  nextTick,
  onBeforeUnmount,
  shallowRef,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import XEUtils from "xe-utils";
import { ElMessage, ElMessageBox } from "element-plus";
const emits = defineEmits(["editorChange", "update:modelValue"]);
let props = defineProps({
  modelValue: {
    type: String,
    default: () => "",
  },
  placeholder: {
    type: String,
    default: () => "请输入内容...",
  },
});
const mode = "default"; // 或 'simple'
// 编辑器实例，必须使用 shallowRef
const editorRef = shallowRef();
// 内容 HTML
// const valueHtml = ref("<p>hello</p>");
const valueHtml = ref(props.modelValue);
const toolbarConfig = {};
const editorConfig = { placeholder: props.placeholder };

// watch(
//   () => props.modelValue,
//   (newVal, oldVal) => {
//     console.log("modelValue:", newVal);
//   },
//   { immediate: true }
// );

// 模拟 ajax 异步获取内容
onMounted(() => {
  // setTimeout(() => {
  //   valueHtml.value = "<p>模拟 Ajax 异步设置内容</p>";
  // }, 1500);
});

// 组件销毁时，及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};

const handleChange = (value) => {
  valueHtml.value = value.getHtml();
  // console.log("valueHtml:", value.getHtml());
  emits("update:modelValue", valueHtml.value);
};
</script>

<style scoped lang="scss">
.container-editor {
  // padding: 10px 10px 10px 10px;
}
</style>
