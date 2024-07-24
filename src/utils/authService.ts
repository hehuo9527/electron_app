import { userInfo } from 'src/types/userTypes'

export class authService {
  save(uInfo: userInfo) {
    localStorage.setItem('userInfo', JSON.stringify(uInfo))
  }

  get(): userInfo | null {
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
