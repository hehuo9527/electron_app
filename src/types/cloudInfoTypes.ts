export interface MqttMsg {
  ticket_id: number
  topic: string
}

export interface CreateTicketResp {
  data: MqttMsg
  message: string
}

export interface Status {
  status: string
}
export interface ReadyTicketResp {
  data: Status
  message: string
}
