import { CreateTicketResp, ReadyTicketResp } from '@src/types/cloudInfoTypes'
import { AxiosConfig } from '@src/types/userTypes'
import { AuthService } from '@src/utils/authService'
import { HttpClient } from '@src/utils/httpClient'

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
    const createTicketResp: CreateTicketResp = await this.httpClient.post(
      '/ticket/create',
      req_body
    )
    return createTicketResp
  }

  async readyTicket(ready_ticket_id: number) {
    const req_body = { ticket_id: String(ready_ticket_id) }
    const createTicketResp: ReadyTicketResp = await this.httpClient.post('/ticket/ready', req_body)
    return createTicketResp
  }
}
