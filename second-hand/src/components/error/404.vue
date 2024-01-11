<template>
  <div class="not-found">
    <h1>404 - 页面未找到</h1>
    <p>很抱歉，您访问的页面不存在。</p>
    <button class="btn" @click="backHome">返回首页</button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { user } from "@/store";
const route = useRoute();
const router = useRouter();
const userStore: any = user();
let { menu } = storeToRefs(userStore);
console.log("store-menu", menu.value);
// 跳转到首页
const backHome = () => {
  router.push("/");
  console.log("store-menu", menu.value);
};
</script>

<style lang="scss" scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f7f7f7;
  text-align: center;
}

h1 {
  font-size: 48px;
  margin-bottom: 10px;
  color: #333;
}

p {
  font-size: 24px;
  color: #666;
  margin-bottom: 20px;
}

.btn {
  padding: 10px 20px;
  font-size: 18px;
  background-color: rgba(76, 175, 80, 1);
  color: #fff;
  border: none;
  border-radius: 7px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(69, 160, 73, 1);
  }
  &:active {
    background-color: rgba(64, 163, 69, 1);
  }
}
</style>
