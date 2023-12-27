<template>
  <div class="container-editor">
    <div ref="$editor"></div>
  </div>
</template>

<script setup lang="ts">
import Editor from "wangeditor";
import { ref, onMounted, computed, watch, watchEffect, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import XEUtils from "xe-utils";
import { ElMessage, ElMessageBox } from "element-plus";
const emits = defineEmits(["editorChange", "handleSubmit"]);
let props = defineProps({
  htmlContent: {
    type: String,
    default: () => "",
  },
});
const $editor = ref();
const editor = ref();
onMounted(() => {
  editor.value = new Editor($editor.value);
  editor.value.create();
  nextTick(() => {});
});
function handleSubmit() {
  const content = editor.value.txt.text(); // 获取纯文本内容
  const htmlContent = editor.value.txt.html(); // 获取 HTML 格式的内容
  // 处理内容并提交表单
}
</script>

<style scoped lang="scss">
.container-editor {
  padding: 10px 10px 10px 10px;
}
</style>
