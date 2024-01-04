<template>
  <el-card>
    <div class="box">
      <img :src="userStore.avatar" alt="" srcset="" class="avatar" />
      <div class="footer">
        <h3 class="title">
          你好~
          <span class="gradient">{{ userStore.username }}</span>
        </h3>
        <p class="subtitle">Vue-Admin</p>
      </div>
    </div>
  </el-card>
  <div class="bottom">
    <svg-icon name="welcome2" width="500px" height="500px"></svg-icon>
  </div>
</template>

<script setup lang="ts">
import useUerStore from '@/store/modules/user'
const userStore = useUerStore()
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  .footer {
    margin-left: 20px;
    margin-top: 15px;
    .title {
      font-size: 35px;
      margin-bottom: 30px;
      font-weight: 900;
      .gradient {
        background: linear-gradient(to right, #001529, #001529, #ffffff);
        /* 渐变方向是从左到右，颜色从红色到绿色 */
        background-clip: text;
        -webkit-background-clip: text; /* 兼容WebKit浏览器（例如Chrome和Safari） */
        color: transparent;
        font-size: 24px;
        font-weight: bold;
      }
    }
    .subtitle {
      font-style: italic;
      color: #ccc;
      font-weight: 700;
    }
  }
}
.bottom {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}
</style>
