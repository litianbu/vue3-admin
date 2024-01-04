const TokenKey: string = 'token'
export const SET_TOKEN = (token: string) => {
  localStorage.setItem(TokenKey, token)
}

export const GET_TOKEN = () => {
  return localStorage.getItem(TokenKey)
}

export const REMOVE_TOKEN = () => {
  localStorage.removeItem(TokenKey)
}
