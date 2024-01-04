<template>
  <div class="tabbar">
    <div class="tabbar-left">
      <BreadCrumb />
    </div>
    <div class="tabbar-right">
      <Setting />
    </div>
  </div>
</template>

<script lang="ts" setup>
import BreadCrumb from './breadcrumb.vue'
import Setting from './setting.vue'
</script>

<style lang="scss" scoped>
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  .tabbar-left {
    display: flex;
    margin-left: 20px;
    align-items: center;
  }
  .tabbar-right {
    display: flex;
    align-items: center;
  }
}
</style>
