import request from '@/utils/request'
import type {
  LoginFormData,
  LoginResponseData,
  UserInfoResponseData,
} from './type'
enum API {
  LOGIN_URL = '/admin/acl/index/login',
  USER_INFO = '/admin/acl/index/info',
  LOGOUT_URL = '/admin/acl/index/logout',
}
// 登陆
export const fetchLogin = (data: LoginFormData) =>
  request.post<any, LoginResponseData>(API.LOGIN_URL, data)
// 用户信息
export const fetchUserInfo = () =>
  request.get<any, UserInfoResponseData>(API.USER_INFO)
// 退出登陆
export const fetchLogout = () => request.post<any, any>(API.LOGOUT_URL)
