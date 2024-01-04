// 登陆接口的参数类型
export interface LoginFormData {
  username: string
  password: string
}
// 定义全部接口响应时候都有的ts类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
// 定义登陆接口返回的数据类型
export interface LoginResponseData extends ResponseData {
  data: string
}
// 定义获取用户信息返回的数据类型
export interface UserInfoResponseData extends ResponseData {
  data: {
    routes: Array<string>
    buttons: Array<string>
    roles: Array<string>
    name: string
    avatar: string
  }
}
