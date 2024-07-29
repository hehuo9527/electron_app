export interface AxiosConfig {
  baseURL: string
  timeout?: number
}

export interface RemoterInfo {
  remoterId: string
  status: string
}

export interface LoginInfo {
  username: string
  password: string
}

export interface Token {
  token: string
}
export interface LoginResp {
  data: Token
  message: string
}
export interface UserInfo {
  username: string
  token: string
}
