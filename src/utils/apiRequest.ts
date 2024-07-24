import { HttpClient } from './httpClient'
import { loginInfo, axiosConfig } from '../types/userTypes'

export async function auth(lInfo: loginInfo): Promise<any> {
  const config: axiosConfig = {
    baseURL: import.meta.env.VITE_HTTP_SERVER_URL
  }
  const client = new HttpClient(config)
  const response = await client.post('/api/login', {
    userName: lInfo.userName,
    password: lInfo.password
  })
  return response
}
