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

export interface MQTTCommand {
  operation: string
  name: string
  value?: string
}

export interface UpdateParametersReq {
  ticket_id: string
  operation: string
  name: string
  value?: string
}

export interface UpdateParametersResp {
  content: unknown
  messageg: string
}
