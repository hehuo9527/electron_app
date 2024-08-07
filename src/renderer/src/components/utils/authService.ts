import { error } from 'console'
import { UserInfo } from '../../../../types/userTypes'

export class AuthService {
  save(uInfo: UserInfo) {
    localStorage.setItem('userInfo', JSON.stringify(uInfo))
  }

  get(): UserInfo {
    const content = localStorage.getItem('userInfo')
    if (!content) {
      throw error('user info is null')
    }
    return JSON.parse(content)
  }

  clear() {
    localStorage.removeItem('userInfo')
  }
}
