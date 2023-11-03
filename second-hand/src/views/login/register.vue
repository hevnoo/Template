<template>
  <div class="card">
    <header class="header">
      <span>REGISTER</span>
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
          />
        </el-form-item>
        <el-form-item prop="checkPass" label-width="0">
          <el-input
            v-model="ruleForm.checkPass"
            :prefix-icon="Lock"
            type="password"
            autocomplete="off"
            placeholder="确认密码"
            show-password
            clearable
            size="large"
          />
        </el-form-item>
        <el-form-item prop="nickname" label-width="0">
          <el-input
            v-model="ruleForm.nickname"
            :prefix-icon="UserFilled"
            type="password"
            autocomplete="off"
            placeholder="昵称"
            show-password
            clearable
            size="large"
            v-on:keyup.13="submitForm(formRef)"
            @keyup.enter="submitForm(formRef)"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="loading"
            class="loginBtn"
            color="rgb(57, 98, 214, 1)"
            @click="submitForm(formRef)"
            v-on:keyup.13="submitForm(formRef)"
            @keyup.enter="submitForm(formRef)"
            >{{ btnText }}</el-button
          >
        </el-form-item>
        <el-form-item class="footer">
          <el-switch
            v-model="isSwitch"
            style="--el-switch-on-color: rgb(57, 98, 214, 1)"
            active-text="注册并登录"
          />
          <span class="register" @click="toLogin">返回登录</span>
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
  getCurrentInstance,
  onBeforeUnmount,
} from "vue";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import storage from "@/utils/storage";
import { UserFilled, Lock } from "@element-plus/icons-vue";
import user from "@/store/modules/user";
const route = useRoute();
const router = useRouter();
const useUser: any = user();

let loading = ref(false);
let formRef: any = ref(null);
let isSwitch = ref(false);
let btnText = ref("注册");
const ruleForm = reactive({
  username: null,
  password: null,
  checkPass: null,
  nickname: null,
});

watch(
  isSwitch,
  (val: any) => {
    if (val === true) {
      btnText.value = "注册并登录";
    } else {
      btnText.value = "注册";
    }
  }
  // {immediate: true, deep: true}
);

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
    if (ruleForm.checkPass !== "") {
      if (!formRef.value) return;
      formRef.value.validateField("checkPass", () => null);
    }
    callback();
  }
};

//确认密码
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error("Please input the password again"));
  } else if (value !== ruleForm.password) {
    callback(new Error("Two inputs don't match!"));
  } else {
    callback();
  }
};

const checkNickname = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error("Please input the nickname"));
  } else {
    callback();
  }
};

const rules = reactive({
  username: [{ validator: checkUser, trigger: "blur" }],
  password: [{ validator: validatePass, trigger: "blur" }],
  checkPass: [{ validator: validatePass2, trigger: "blur" }],
  nickname: [{ validator: checkNickname, trigger: "blur" }],
});

const submitForm = async (formRef: any) => {
  if (!formRef) return;
  await formRef.validate(async (valid: any, fields: any): Promise<any> => {
    if (valid) {
      loading.value = true;
      try {
        await useUser.setRegister(ruleForm);
        if (isSwitch) {
          await useUser.setLogin(ruleForm);
        }
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
const toLogin = () => {
  emit("ChangeForm", true);
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
