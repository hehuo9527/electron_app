import { AxiosConfig } from '@src/types/userTypes'
import { HttpClient } from '@src/utils/httpClient'

export class NotionficationCloudService {
  constructor() {}

  private cloudUrl = import.meta.env.VITE_API_URL

  config: AxiosConfig = {
    baseURL: this.cloudUrl
  }
  httpClient: HttpClient = new HttpClient(this.config)

  SendMsgToCloud() {
    this.httpClient.post(this.cloudUrl, '')
  }
}
