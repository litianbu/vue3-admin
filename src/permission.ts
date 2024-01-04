import router from '@/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import pinia from './store'
import useUserStore from './store/modules/user'
import setting from './setting'
const userStore = useUserStore(pinia)
NProgress.configure({ showSpinner: false })
router.beforeEach(async (to: any, _from: any, next: any) => {
  document.title = `${setting.title}-${to.meta.title}`
  NProgress.start()
  const { token, username } = userStore
  if (token) {
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      if (username) {
        next()
      } else {
        // 刷新的时候store数据 不支持持久化
        try {
          await userStore.userInfo()
          next({ ...to })
        } catch {
          await userStore.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
