// cache.ts
import { ref, defineProps, defineEmits, watch, computed } from "vue";
import { useRoute, useRouter, onBeforeRouteUpdate } from "vue-router";

// export function usePagination() {
export default function () {
  const hooks = "hooks";
  let props = defineProps({
    demo: {
      type: Number,
      default: 1,
    },
  });
  let demo = ref(props.demo);
  return {
    hooks,
    demo,
  };
}
