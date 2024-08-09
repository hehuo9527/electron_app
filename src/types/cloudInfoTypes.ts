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

export interface TicketStatusMsgData {
  ticket_id: string
  tickst_status: string
}

export interface CameraStatusMsgData {
  ticket_id: string
  camera_status: string
}

export interface CommandData {
  name: string
  operation: string
  value: string
}

export interface MQTTMsg {
  type: string
  data: CommandData | CameraStatusMsgData | TicketStatusMsgData
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
