<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <div v-if="flag">
        <component :is="Component" />
      </div>
    </transition>
  </router-view>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick } from 'vue'
import useLayoutSettingStore from '@/store/modules/setting'
const layoutSettingStore = useLayoutSettingStore()
let flag = ref(true)
watch(
  () => layoutSettingStore.refresh,
  () => {
    flag.value = false
    nextTick(() => {
      flag.value = true
    })
  },
)
</script>

<style lang="scss">
.fade-enter-from {
  opacity: 0;
}
.fade-enter-active {
  transition: all 0.3s;
}
.fade-enter-to {
  opacity: 1;
}
</style>
