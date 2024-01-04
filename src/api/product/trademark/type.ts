export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

export interface TradMark {
  id?: number
  tmName: string
  logoUrl: string
}

export type Records = Array<TradMark>

export interface TradMarkResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}
