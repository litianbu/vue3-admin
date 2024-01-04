<template>
  <div class="login_container">
    <ElRow>
      <ElCol :span="12" :xs="0"></ElCol>
      <ElCol :span="12" :xs="24">
        <ElCard class="login_form">
          <h1>AA-Web-Middle</h1>
          <ElForm ref="loginForms" :model="loginForm" :rules="rules">
            <ElFormItem prop="username">
              <ElInput
                :prefix-icon="User"
                v-model="loginForm.username"
              ></ElInput>
            </ElFormItem>
            <ElFormItem prop="password">
              <ElInput
                type="password"
                :prefix-icon="Lock"
                v-model="loginForm.password"
                show-password
              ></ElInput>
            </ElFormItem>
            <ElFormItem>
              <ElButton
                :loading="loading"
                class="login_btn"
                type="primary"
                @click="login"
              >
                登陆
              </ElButton>
            </ElFormItem>
          </ElForm>
        </ElCard>
      </ElCol>
    </ElRow>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import useUserStore from '@/store/modules/user'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
const userStore = useUserStore()
const $router = useRouter()
const $route = useRoute()
const loginForm = reactive({
  username: 'admin',
  password: 'atguigu123',
})
const loading = ref(false)
const loginForms = ref()
const login = async () => {
  await loginForms.value.validate()
  try {
    loading.value = true
    await userStore.userLogin(loginForm)
    loading.value = false
    const redirect: any = $route.query.redirect
    $router.push({ path: redirect || '/' })
    ElNotification({
      type: 'success',
      title: 'Hi, 靓仔',
      message: '欢迎回来',
    })
  } catch (error) {
    loading.value = false
    ElNotification.error((error as Error).message)
  }
}
const rules = {
  username: [
    { required: true, message: '用户名不能为空', trigger: 'change' },
    { min: 5, message: '账号长度至少6位' },
    { max: 10, message: '账号长度最多10位' },
  ],
  password: [{ required: true, message: '密码长度至少6位', trigger: 'change' }],
}
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;
  position: fixed;
  .login_form {
    position: relative;
    width: 55%;
    top: 25vh;
    left: 10vw;
    padding: 10px;
    background: transparent;
    h1 {
      background: linear-gradient(to right, blue, rgb(35, 60, 70));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 40px;
      text-align: center;
      font-weight: 700;
      margin-bottom: 40px;
      margin-top: -10px;
    }
    .login_btn {
      width: 100%;
    }
  }
}
.el-card {
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}
</style>
