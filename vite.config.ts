import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'
import qiankun from 'vite-plugin-qiankun'
import path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { viteMockServe } from 'vite-plugin-mock'
// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    // 设置 publicPath
    base: '//localhost:5000',
    plugins: [
      vue(),
      qiankun('new-middle', {
        // 微应用名字，与主应用注册的微应用名字保持一致
        useDevMode: true,
      }),
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // Specify symbolId format
        symbolId: 'icon-[dir]-[name]',
      }),
      viteMockServe({
        localEnabled: command === 'serve', //保证开发阶段可以使用mock api
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), './src'), // 相对路径别名配置，使用 @ 代替 src
      },
    },
    server: {
      port: 5000,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      origin: mode === 'development' ? 'http://localhost:5000' : undefined,
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_SERVE,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    // scss全局变量的配置
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/variable.scss";',
        },
      },
    },
  }
})
