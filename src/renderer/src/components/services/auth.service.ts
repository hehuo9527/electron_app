import { HttpClient } from '../utils/httpClient'
import { AxiosConfig } from '../../../../types/userTypes'
import { LoginInfo, LoginResp } from '@src/types/userTypes'

export async function auth(lInfo: LoginInfo): Promise<any> {
  const config: AxiosConfig = {
    baseURL: import.meta.env.VITE_API_URL
  }
  const client = new HttpClient(config)

  const response: LoginResp = await client.post('/user/login', {
    username: lInfo.username,
    password: lInfo.password
  })
  return response
}
