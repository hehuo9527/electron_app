export interface MqttMsg {
  ticket_id: number
  topic: string
}

export interface CreateTicketResp {
  data: MqttMsg
  message: string
}
