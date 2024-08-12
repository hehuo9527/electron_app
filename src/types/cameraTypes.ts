export interface CameraInfo {
  camera: string
  status: string
  imgPath: string
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
