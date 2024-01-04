<template>
  <div class="error">
    <el-result icon="error" title="404" sub-title="走丢了！！">
      <template #extra>
        <el-button type="primary" @click="$router.replace('/')">Back</el-button>
      </template>
    </el-result>
  </div>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router'
const $router = useRouter()
</script>

<style lang="scss" scoped>
.error {
  width: 100vw;
  height: 100vh;
  background-color: aquamarine;
}
</style>
