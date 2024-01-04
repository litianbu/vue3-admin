import { defineStore } from 'pinia'
import { fetchLogin, fetchUserInfo, fetchLogout } from '@/api/user'
import type {
  LoginFormData,
  LoginResponseData,
  UserInfoResponseData,
} from '@/api/user/type'
import type { UserState } from './types/type'
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
import router from '@/router'
import { constantRoute, asyncRoute, anyRoute } from '@/router/constantRoute'
import cloneDeep from 'lodash/cloneDeep'
const filterAsyncRoute = (asyncRoute: any, routes: any) => {
  return asyncRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (Array.isArray(item.children) && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes)
      }
      return true
    }
  })
}
const userStore = defineStore('User', {
  state: (): UserState => {
    return {
      token: GET_TOKEN(),
      menuRoutes: constantRoute,
      username: '',
      avatar: '',
      buttons: [],
    }
  },
  actions: {
    async userLogin(params: LoginFormData) {
      try {
        const result: LoginResponseData = await fetchLogin(params)
        this.token = result.data as string
        // 持久化存储
        SET_TOKEN(result.data as string)
      } catch (error) {
        return Promise.reject(new Error(error as string))
      }
    },
    async userInfo() {
      try {
        const result: UserInfoResponseData = await fetchUserInfo()
        const userAsyncRoute = filterAsyncRoute(
          cloneDeep(asyncRoute),
          result.data.routes,
        )
        // 菜单需要的数据
        this.menuRoutes = [...constantRoute, ...userAsyncRoute, ...anyRoute]
        ;[...userAsyncRoute, ...anyRoute].forEach((route) => {
          router.addRoute(route)
        })
        this.avatar = result.data.avatar
        this.username = result.data.name
        this.buttons = result.data.buttons
      } catch (error) {
        return Promise.reject(new Error(error as string))
      }
    },
    async userLogout() {
      try {
        await fetchLogout()
        this.token = ''
        this.username = ''
        this.avatar = ''
        REMOVE_TOKEN()
      } catch (error) {
        return Promise.reject(new Error(error as string))
      }
    },
  },
  getters: {},
})

export default userStore
