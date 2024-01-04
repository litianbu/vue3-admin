<template>
  <el-icon style="margin-right: 10px" @click="changeIcon">
    <component :is="settingStore.fold ? 'Fold' : 'Expand'"></component>
  </el-icon>
  <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item
      v-for="(item, index) in $route.matched"
      :key="index"
      v-show="item.meta.title"
      :to="item.path"
    >
      <el-icon style="vertical-align: middle">
        <component :is="item.meta.icon"></component>
      </el-icon>
      {{ item.meta.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import useLayoutSettingStore from '@/store/modules/setting'
import { useRoute } from 'vue-router'
const settingStore = useLayoutSettingStore()
const $route = useRoute()
const changeIcon = () => {
  settingStore.fold = !settingStore.fold
}
</script>
