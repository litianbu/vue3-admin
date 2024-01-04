export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

export interface Role {
  id?: number
  createTime?: string
  updateTime?: string
  roleName?: string
  remark?: string | null
}

export type Records = Role[]

export interface RoleResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    orders: []
    optimizeCountSql: boolean
    hitCount: boolean
    countId: null
    maxLimit: null
    searchCount: boolean
    pages: number
  }
}

export interface MenuData {
  id: number
  createTime: string
  updateTime: string
  pid: number
  name: string
  code: string
  toCode: string
  type: number
  status: null
  level: number
  children: []
  select: boolean
}

export type MenuList = MenuData[]

export interface MenuResponseData extends ResponseData {
  data: MenuList
}
