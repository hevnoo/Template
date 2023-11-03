<template>
  <div class="card">
    <header class="header">
      <span>LOGIN</span>
    </header>
    <main class="main">
      <el-form
        ref="formRef"
        :model="ruleForm"
        :rules="rules"
        status-icon
        class="form"
      >
        <el-form-item prop="username" label-width="0">
          <el-input
            v-model="ruleForm.username"
            :prefix-icon="UserFilled"
            type="username"
            autocomplete="off"
            placeholder="用户名"
            clearable
            size="large"
            v-on:keyup.13="submitForm(formRef)"
            @keyup.enter="submitForm(formRef)"
          />
        </el-form-item>
        <el-form-item prop="password" label-width="0">
          <el-input
            v-model="ruleForm.password"
            :prefix-icon="Lock"
            type="password"
            autocomplete="off"
            placeholder="密码"
            show-password
            clearable
            size="large"
            v-on:keyup.13="submitForm(formRef)"
            @keyup.enter="submitForm(formRef)"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            id="submitButton"
            class="loginBtn"
            color="rgb(57, 98, 214, 1)"
            :loading="loading"
            @click="submitForm(formRef)"
            v-on:keyup.13="submitForm(formRef)"
            @keyup.enter="submitForm(formRef)"
            >登录</el-button
          >
        </el-form-item>
        <el-form-item class="footer">
          <el-switch
            v-model="isRemember"
            style="--el-switch-on-color: rgb(57, 98, 214, 1)"
            active-text="记住密码"
          />
          <span class="register" @click="toRegister">注册账号</span>
        </el-form-item>
      </el-form>
    </main>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  computed,
  watch,
  onMounted,
  getCurrentInstance,
  onBeforeUnmount,
} from "vue";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
// import storage from "@/utils/storage";
import { UserFilled, Lock } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";
import user from "@/store/modules/user";
import { storeToRefs } from "pinia";
const route = useRoute();
const router = useRouter();
const useUser: any = user();
let { token, role } = storeToRefs(useUser);

interface formType {
  username: string | number | null;
  password: number | null;
}
const ruleForm: formType = reactive({
  username: "admin",
  password: 123456,
});
let loading = ref(false);
let formRef: any = ref(null);
let isRemember = ref(false);
//校验用户名
const checkUser = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error("Please input the username"));
  } else {
    callback();
  }
};

//校验密码
const validatePass = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error("Please input the password"));
  } else {
    callback();
  }
};
const rules = reactive({
  username: [{ validator: checkUser, trigger: "blur" }],
  password: [{ validator: validatePass, trigger: "blur" }],
});

onMounted(() => {
  //回车键事件
  const button = document.getElementById("submitButton");
  document.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      button.click();
    }
  });
});

const submitForm = async (formRef: any) => {
  if (!formRef) return;
  await formRef.validate(async (valid: any, fields: any): Promise<any> => {
    if (valid) {
      loading.value = true;
      try {
        await useUser.setLogin(ruleForm);
        loading.value = false;
      } catch (error) {
        loading.value = false;
      }
    } else {
      console.log("error submit!", fields);
      return false;
    }
  });
};

const emit = defineEmits(["ChangeForm"]);
const toRegister = () => {
  emit("ChangeForm", false);
};
</script>

<style scoped lang="scss">
.card {
  color: #fff;
  // background-color: rgb(255, 255, 255, 0.6);
  min-height: 500px;
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 20px;
  .header {
    height: 120px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      // color: #fff;
      font-size: 26px;
    }
  }
  .main {
    width: 100%;
    // flex: 1;
    display: flex;
    justify-content: center;

    .form {
      width: 85%;
      padding: 10px 0 0 0;
      display: flex;
      flex-direction: column;
      & > * {
        margin-bottom: 30px;
      }
      .el-input {
        height: 43px;
      }
      .loginBtn {
        width: 100%;
        height: 43px;
        border-radius: 20px;
      }
      // &:nth-child(1) {
      //   margin-top: 50px;
      // }
      .footer {
        width: 100%;
        .register {
          cursor: pointer;
        }
        ::v-deep .el-form-item__content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }
    }
  }
}
::v-deep .el-input__wrapper {
  border-radius: 20px;
  // opacity: 0.6;
  background-color: rgb(255, 255, 255, 0.6);
}
::v-deep .el-input__prefix,
.el-input__suffix {
  color: #fff;
}
//修改输入框内字体
::v-deep input::placeholder {
  color: #fff;
}
::v-deep .el-switch__label {
  color: #fff !important;
}
</style>
