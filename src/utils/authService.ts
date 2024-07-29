import { UserInfo } from 'src/types/userTypes'

export class authService {
  save(uInfo: UserInfo) {
    localStorage.setItem('userInfo', JSON.stringify(uInfo))
  }

  get(): UserInfo | null {
    const content = localStorage.getItem('userInfo')
    if (content) {
      return JSON.parse(content)
    }
    return null
  }

  clear() {
    localStorage.removeItem('userInfo')
  }
}
