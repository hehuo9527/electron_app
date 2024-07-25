export interface axiosConfig {
  baseURL: string
  timeout?: number
}

export interface remoterInfo {
  remoterId: string
  status: string
}

export interface loginInfo {
  userName: string
  password: string
}

export interface userInfo {
  userName: string
  token: string
}
