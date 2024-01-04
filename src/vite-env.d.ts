/// <reference types="vite/client" />

// 解决 找不到模块“./App.vue”或其相应的类型声明
declare module '*.vue' {
  import { defineComponent } from 'vue'
  const Component: ReturnType<typeof defineComponent>
  export default Component
}
// 进度条
declare module 'nprogress'
