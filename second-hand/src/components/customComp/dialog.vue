<template>
  <div class="wrapper-dialog">
    <el-dialog
      v-model="props.dialogVisible.val"
      :title="props.dialogConfig.title"
      :width="props.dialogConfig.width"
      :close-on-click-modal="props.dialogConfig.clickModal"
      draggable
      destroy-on-close
      :before-close="handleClose"
    >
      <!-- <span>This is a message</span> -->
      <slot></slot>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            v-for="(item, index) in props.dialogConfig.footer.buttons"
            :key="index"
            :type="item.type || ''"
            @click="click(item.value)"
            >{{ item.label }}</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, defineProps, computed, watch, onMounted } from "vue";
import { useRoute, useRouter, onBeforeRouteUpdate } from "vue-router";
import { ElMessageBox } from "element-plus";
import { storeToRefs } from "pinia";
const route = useRoute();
const router = useRouter();
const emits = defineEmits([
  "handleClose",
  "dialogClick",
  "cancel",
  "confirm",
  "submit",
  "reset",
]);
let props = defineProps({
  //利用对象地址做父子组件双向绑定
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
        dialogVisible: false,
        title: "提示",
        width: "50%",
        height: "600px",
        clickModal: false,
        footer: {
          mode: "", //prev
          position: "right",
          //在表格中使用时才需要传入 prev 判断显隐
          buttons: [
            {
              label: "取消",
              value: "cancel",
              type: "info",
              prev: ["edit", "detail", "add"],
            },
            // { label: "重置", value: "reset", type: "", prev: [] },
            // {
            //   label: "确认",
            //   value: "confirm",
            //   type: "primary",
            //   prev: ["detail"],
            // },
            // {
            //   label: "提交",
            //   value: "submit",
            //   type: "primary",
            //   prev: ["edit", "add"],
            // },
          ],
        },
      };
    },
  },
});

let footer = ref(JSON.parse(JSON.stringify(props.dialogConfig.footer)));
let height = ref(props.dialogConfig.height);
// let dialogVisible = ref(props.dialogVisible);
// let dialogVisible = computed({
//   get: () => props?.dialogVisible,
//   set: (val) => val,
// });
let btnPosition = ref("right");
// let position = computed(() => {
//   if (props.dialogConfig.footer.position === "left") {
//     return "flex-start";
//   } else if (props.dialogConfig.footer.position === "center") {
//     return "center";
//   } else {
//     return "flex-end";
//   }
// });
watch(
  () => props.dialogConfig.footer?.position,
  (newVal) => {
    if (newVal === "left") {
      btnPosition.value = "flex-start";
    } else if (newVal === "center") {
      btnPosition.value = "center";
    } else {
      btnPosition.value = "flex-end";
    }
  },
  { immediate: true, deep: true }
);

//按钮事件
const click = (value) => {
  emits("dialogClick", value);
  switch (value) {
    case "cancel": {
      emits("cancel", value);
      props.dialogVisible.val = false;
      break;
    }
    case "confirm": {
      emits("confirm", value);
      // props.dialogVisible.val = false;
      break;
    }
    case "submit": {
      emits("submit", value);
      // props.dialogVisible.val = false;
      break;
    }
    case "reset": {
      emits("reset", value);
      // props.dialogVisible.val = false;
      break;
    }
  }
};
const handleClose = (done: () => void) => {
  done();
  emits("cancel", "cancel");
  // ElMessageBox.confirm("确定要关闭吗?")
  //   .then(() => {
  //     done();
  //     emits("cancel", "cancel");
  //   })
  //   .catch(() => {
  //     // catch error
  //   });
};
const cancel = () => {
  emits("cancel", "cancel");
  props.dialogConfig.dialogVisible = false;
};
const confirm = () => {
  emits("confirm", "confirm");
  props.dialogConfig.dialogVisible = false;
};
</script>

<style scoped lang="scss">
::v-deep .el-dialog {
  height: auto !important;
  border-radius: 15px;
}
::v-deep .el-dialog__body {
  height: v-bind(height) !important;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
::v-deep .el-dialog__footer {
  display: flex;
  justify-content: v-bind(btnPosition);
}
</style>
