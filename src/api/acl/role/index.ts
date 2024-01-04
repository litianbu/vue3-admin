import request from '@/utils/request'
import type {
  RoleResponseData,
  Role,
  ResponseData,
  MenuResponseData,
} from './type'
enum API {
  ROLE_URL = '/admin/acl/role/',
  ADDROLE_URL = '/admin/acl/role/save',
  UPDATEROLE_URL = '/admin/acl/role/update',
  ALLPERMISSION_URL = '/admin/acl/permission/toAssign/',
  SETPERMISSION_URL = '/admin/acl/permission/doAssign/?',
  REMOVEROLE_URL = '/admin/acl/role/remove/',
}

export const fetchList = (page: number, limit: number, roleName: string) =>
  request.get<any, RoleResponseData>(API.ROLE_URL + `${page}/${limit}`, {
    params: {
      roleName,
    },
  })

export const addOrUpdateRole = (data: Role) => {
  if (data.id) {
    return request.put<any, ResponseData>(API.UPDATEROLE_URL, data)
  } else {
    return request.post<any, ResponseData>(API.ADDROLE_URL, data)
  }
}

export const addPermission = (id: number) =>
  request.get<any, MenuResponseData>(API.ALLPERMISSION_URL + id)

export const reqSetPermission = (roleId: number, permissionId: number[]) =>
  request.post<any, ResponseData>(
    API.SETPERMISSION_URL + `roleId=${roleId}&permissionId=${permissionId}`,
  )

export const reqRemoveRole = (roleId: number) =>
  request.delete<any, ResponseData>(API.REMOVEROLE_URL + roleId)
