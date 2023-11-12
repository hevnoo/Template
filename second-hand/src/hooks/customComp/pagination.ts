// usePagination.ts
import { ref, defineProps, defineEmits, watch, computed } from "vue";
import { useRoute, useRouter, onBeforeRouteUpdate } from "vue-router";

// export function usePagination() {
export default function () {
  //   const emits = defineEmits(["currentChange", "handleSizeChange"]);
  console.log("111");
  let props = defineProps({
    currentPage: {
      type: Number,
      default: 1,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    total: {
      type: Number,
      default: 0,
    },
    position: {
      //居左、居右、剧中
      type: String,
      default: "right",
    },
    backgroundColor: {
      type: String,
      default: "#409eff",
    },
  });

  let currentPage = ref(props.currentPage);
  let pageSize = ref(props.pageSize);
  let total = ref(props.total);
  //   let position = ref("right");
  let backgroundColor = ref(props.backgroundColor);
  console.log("222", props.currentPage, props.backgroundColor);
  let position = computed(() => {
    if (props.position === "left") {
      return "flex-start";
    } else if (props.position === "center") {
      return "center";
    } else {
      return "flex-end";
    }
  });
  //   watch(
  //     () => props.position,
  //     (newVal) => {
  //       if (newVal === "left") {
  //         position.value = "flex-start";
  //       } else if (newVal === "center") {
  //         position.value = "center";
  //       } else {
  //         position.value = "flex-end";
  //       }
  //     },
  //     { immediate: true }
  //   );
  return {
    currentPage,
    pageSize,
    total,
    position,
    backgroundColor,
  };
  return {
    currentPage: currentPage.value,
    pageSize: pageSize.value,
    total: total.value,
    position,
    backgroundColor: backgroundColor.value,
  };
}
