import request from '@/utils/request'
import type {
  UserResponseData,
  ResponseData,
  User,
  AllRoleResponseData,
  SetRole,
} from './type'
enum API {
  USER_URL = '/admin/acl/user/',
  ADD_URL = '/admin/acl/user/save',
  UPDATEUSER_URL = '/admin/acl/user/update',
  ROLE_URL = '/admin/acl/user/toAssign/',
  SETROLE_URL = '/admin/acl/user/doAssignRole',
  DELETEUSER_URL = '/admin/acl/user/remove/',
  REMOVEUSERS_URL = '/admin/acl/user/batchRemove',
}
// 列表
export const fetchList = (page: number, limit: number, username: string) =>
  request.get<any, UserResponseData>(API.USER_URL + `${page}/${limit}`, {
    params: {
      username,
    },
  })

// 新增 || 编辑
export const addOrUpdateUser = (data: User) => {
  if (data.id) {
    return request.put<any, ResponseData>(API.UPDATEUSER_URL, data)
  } else {
    return request.post<any, ResponseData>(API.ADD_URL, data)
  }
}

// 角色列表
export const allRoleList = (id: number) =>
  request.get<any, AllRoleResponseData>(API.ROLE_URL + id)

// 分配角色
export const setUserRole = (data: SetRole) => {
  return request.post<any, ResponseData>(API.SETROLE_URL, data)
}

// 删除某一个账户的信息
export const removeUser = (id: number) => {
  return request.delete<any, ResponseData>(API.DELETEUSER_URL + id)
}
// 批量删除
export const removeUsers = (idList: Array<number>) =>
  request.delete<any, ResponseData>(API.REMOVEUSERS_URL, { data: idList })
