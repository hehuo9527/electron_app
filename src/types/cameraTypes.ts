export interface CameraInfo {
  name: any
  status: string
  remoteStatus: string
} 

export interface CameraOperationReqMsg {
  name: string
  operation?: string
  value?: string | number
}

export interface CameraRespMsg {
  name: string
  status: string
  message: string
}
