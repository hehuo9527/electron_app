import {
  CreateTicketResp,
  ReadyTicketResp,
  UpdateParametersReq,
  UpdateParametersResp
} from '@src/types/cloudInfoTypes'
import { AxiosConfig } from '@src/types/userTypes'
import { AuthService } from '@renderer/components/utils/authService'
import { HttpClient } from '@renderer/components/utils/httpClient'

export class SendMsgToCloudService {
  private cloudUrl: string = import.meta.env.VITE_API_URL
  private httpClient: HttpClient
  private readonly config: AxiosConfig

  constructor() {
    const userInfo = new AuthService().get()
    this.config = {
      baseURL: this.cloudUrl,
      headers: this.createHeaders(userInfo)
    }
    this.httpClient = new HttpClient(this.config)
  }

  private createHeaders(userInfo: { token: string } | null): Record<string, string> {
    return {
      'Content-Type': 'application/x-www-form-urlencoded',
      ...(userInfo ? { Authorization: `Bearer ${userInfo.token}` } : {})
    }
  }

  async createTicket(req_body: any) {
    try {
      const createTicketResp: CreateTicketResp = await this.httpClient.post(
        '/ticket/create',
        req_body
      )
      return createTicketResp
    } catch (error) {
      return {
        data: null,
        message: 'Error'
      }
    }
  }

  async readyTicket(ready_ticket_id: number) {
    const req_body = { ticket_id: String(ready_ticket_id) }
    try {
      const createTicketResp: ReadyTicketResp = await this.httpClient.post(
        '/ticket/ready',
        req_body
      )
      return createTicketResp
    } catch (error) {
      return {
        data: null,
        message: 'Error'
      }
    }
  }

  async updateParam(updateParams: UpdateParametersReq) {
    try {
      const updateParamResp: UpdateParametersResp = await this.httpClient.post(
        '/camera/param/log',
        updateParams
      )
      return updateParamResp
    } catch (error) {
      return {
        data: null,
        message: 'Error'
      }
    }
  }

  async uploadImg(uploadImgReq: unknown) {
    try {
      const uploadImgResp: ReadyTicketResp = await this.httpClient.post(
        '/user/image/upload',
        uploadImgReq
      )
      return uploadImgResp
    } catch (error) {
      return {
        data: null,
        message: 'Error'
      }
    }
  }

  async updateCameraStatus(ticket_id: string, camera_status: string) {
    const req_body = { ticket_id: ticket_id, camera_status: camera_status }
    try {
      return await this.httpClient.post('/camera/status/update', req_body)
    } catch (error) {
      return {
        data: null,
        message: 'Error'
      }
    }
  }
}
