<template>
  <div class="wrapper-login">
    <Login v-if="isLogin" @ChangeForm="getForm"></Login>
    <Register v-else @ChangeForm="getForm"></Register>
  </div>
</template>

<script setup lang="ts">
import Login from "./login.vue";
import Register from "./register.vue";
import {
  ref,
  reactive,
  computed,
  watch,
  getCurrentInstance,
  onBeforeUnmount,
} from "vue";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
// import storage from "@/utils/storage";
import { user } from "@/store";
import { storeToRefs } from "pinia";
const route = useRoute();
const router = useRouter();
const useLogin: any = user();
let { token, role } = storeToRefs(useLogin);
let isLogin = ref(true);

const getForm = (e: boolean) => {
  isLogin.value = e;
};
</script>

<style scoped lang="scss">
.wrapper-login {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("../../assets/img/bg3.jpg");
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
