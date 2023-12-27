<template>
  <div class="container-quill">
    <div ref="$editor"></div>
  </div>
</template>

<script setup lang="ts">
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { ref, onMounted, computed, watch, watchEffect, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import XEUtils from "xe-utils";
import { ElMessage, ElMessageBox } from "element-plus";
const $editor = ref();
let quillInstance = ref();
onMounted(() => {
  quillInstance = new Quill($editor.value, {
    // Quill编辑器的配置选项
    // 可根据需要进行自定义配置
  });

  //   quillInstance.on("text-change", () => {
  //     // 编辑器内容变化时的处理逻辑
  //     // 可以通过quillInstance.getContents()获取编辑器内容
  //   });
});
</script>

<style scoped lang="scss">
.container-quill {
  padding: 10px 10px 10px 10px;
}
</style>
