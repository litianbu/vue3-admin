<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider" :class="{ fold: settingStore.fold }">
      <Logo />
      <el-scrollbar class="scrollbar">
        <el-menu
          background-color="#001529"
          text-color="white"
          :default-active="$route.path"
          :collapse="settingStore.fold"
        >
          <Menu :menuList="userStore.menuRoutes" />
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div class="layout_tabbar" :class="{ fold: settingStore.fold }">
      <Tabbar />
    </div>
    <!-- 内容展示 -->
    <div class="layout_main" :class="{ fold: settingStore.fold }">
      <Main />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import Logo from './logo/index.vue'
import Menu from './menu/index.vue'
import Main from './main/index.vue'
import Tabbar from './tabbar/index.vue'
import useUserStore from '@/store/modules/user'
import useLayoutSettingStore from '@/store/modules/setting'
const userStore = useUserStore()
const settingStore = useLayoutSettingStore()
const $route = useRoute()
</script>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;
  .layout_slider {
    color: white;
    width: $base-menu-width;
    height: 100vh;
    background: $base-menu-background;
    transition: all 0.3s;
    .scrollbar {
      height: calc(100vh - $base-tabbar-height);
      .el-menu {
        border-right: none;
      }
    }
    &.fold {
      width: $base-menu-min-width;
    }
  }
  .layout_tabbar {
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    position: absolute;
    left: $base-menu-width;
    top: 0;
    transition: all 0.3s;
    z-index: 11;
    // background-color: $base-tabbar-color;
    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }
  .layout_main {
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    position: absolute;
    left: $base-menu-width;
    top: $base-tabbar-height;
    padding: 20px;
    overflow: auto;
    transition: all 0.3s;
    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }
}
</style>
