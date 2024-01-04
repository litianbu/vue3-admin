<template>
  <el-button
    size="small"
    icon="Refresh"
    circle
    @click="refreshChange"
  ></el-button>
  <el-button
    size="small"
    icon="FullScreen"
    circle
    @click="fullScreen"
  ></el-button>
  <el-button
    size="small"
    icon="Setting"
    circle
    @click="themeVisible = true"
  ></el-button>
  <el-dialog v-model="themeVisible" title="主题设置">
    <el-form>
      <el-form-item label="主题颜色">
        <el-color-picker
          v-model="themeColor"
          size="small"
          show-alpha
          :predefine="predefineColors"
          @change="setColor"
        />
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch
          size="small"
          v-model="dark"
          inline-prompt
          active-icon="Sunny"
          inactive-icon="Moon"
          @change="changeDark"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="themeVisible = false">取消</el-button>
      <el-button @click="themeVisible = false">确定</el-button>
    </template>
  </el-dialog>

  <img
    :src="userStore.avatar"
    alt=""
    style="width: 24px; height: 24px; margin: 0 10px; border-radius: 50%"
  />
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right"><arrow-down /></el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登陆</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useUserStore from '@/store/modules/user'
import useLayoutSettingStore from '@/store/modules/setting'
const layoutSettingStore = useLayoutSettingStore()
const userStore = useUserStore()
const $router = useRouter()
const $route = useRoute()
const refreshChange = () => {
  layoutSettingStore.refresh = !layoutSettingStore.refresh
}
const fullScreen = () => {
  let full = document.fullscreenElement
  if (!full) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

const logout = async () => {
  await userStore.userLogout()
  $router.push({ path: '/login', query: { redirect: $route.path } })
}
const themeColor = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
const dark = ref<boolean>(false)
const themeVisible = ref<boolean>(false)
const changeDark = () => {
  const html = document.documentElement
  dark.value ? (html.className = 'dark') : (html.className = '')
}
const setColor = () => {
  console.log(1111)
  let html = document.documentElement
  html.style.setProperty('--el-color-primary', themeColor.value)
}
</script>
