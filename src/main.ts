import { createApp } from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// 暗黑模式的样式
import 'element-plus/theme-chalk/dark/css-vars.css'
// svg插件需要配置的代码
import 'virtual:svg-icons-register'
// 引入自定义全局组件
import globalComponents from '@/components'
// 样式
import '@/styles/index.scss'
import {
  qiankunWindow,
  renderWithQiankun,
} from 'vite-plugin-qiankun/dist/helper'
import router from './router'
import './permission'
import { hasPer } from '@/directive/has'
import pinia from './store'

let instance: any = null
function render(props: any = {}) {
  const { container } = props
  instance = createApp(App)
  instance.use(router)
  instance.use(pinia)
  // 自定义指令
  hasPer(instance)
  instance.use(ElementPlus, {
    locale: zhCn,
  })
  instance.use(globalComponents)
  instance?.mount(container ? container.querySelector('#app') : '#app')
  console.log('开始加载相关内容')
}

renderWithQiankun({
  mount(props: any) {
    props.onGlobalStateChange((state: any) => {
      console.log(state)
    }, true)

    // 应用每次进入都会调用 mount 方法，所以我们在这里初始化一些内容
    setTimeout(() => {
      render(props)
    }, 500)
  },
  bootstrap() {
    console.log('微应用初始化的时候调用一次')
  },
  update() {
    console.log('update')
  },
  unmount(props: any) {
    console.log('unmount:应用每次 切出/卸载 会调用的方法', props)
    instance.unmount()
    instance._container.innerHTML = ''
    instance = null
  },
})

/*
 * 通过 qiankunWindow.__POWERED_BY_QIANKUN__ 判断是不是 qiankun 渲染的，如果不是 qiankun 渲染的，需要调用以下 render 方法来初始化一些内容
 * */
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  console.log('并不是qiankun渲染')
  render()
}
