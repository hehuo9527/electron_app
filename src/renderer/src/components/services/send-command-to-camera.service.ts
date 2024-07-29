import { AxiosConfig } from '@src/types/userTypes'
import { HttpClient } from '@src/utils/httpClient'

export class SendCommandToCameraService {
  private cameraServerURL = import.meta.env.VITE_CAMERA_SDK_SERVER_URL

  config: AxiosConfig = {
    baseURL: this.cameraServerURL
  }

  httpClient: HttpClient = new HttpClient(this.config)

  constructor() {}

  SendCommandToCamera(data: any) {
    console.log(data, this.cameraServerURL)
    // this.httpClient.post(this.cameraServerURL, data)
  }
}
