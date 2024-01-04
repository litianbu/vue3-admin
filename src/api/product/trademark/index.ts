import request from '@/utils/request'
import type { TradMarkResponseData, TradMark, ResponseData } from './type'
enum API {
  LIST_URL = '/admin/product/baseTrademark/',
  ADD_URL = '/admin/product/baseTrademark/save',
  REMOVE_URL = '/admin/product/baseTrademark/remove/',
  UPDATE_URL = '/admin/product/baseTrademark/update',
}
// 列表
export const fetchList = (page: number, limit: number) =>
  request.get<any, TradMarkResponseData>(API.LIST_URL + `${page}/${limit}`)
// 新增
export const addTradeMarkAPI = (data: TradMark) =>
  request.post<any, ResponseData>(API.ADD_URL, data)
// 编辑
export const updateTradeMarkAPI = (data: TradMark) =>
  request.put<any, ResponseData>(API.UPDATE_URL, data)
// 删除
export const removeTradeMarkAPI = (id: number) =>
  request.delete<any, ResponseData>(API.REMOVE_URL + id)
