export interface CameraInfo {
  camera: string
  status: string
  clientId: string
  imgPath: string
}

export interface CameraRespMsg {
  name: string
  status: string
  message: string
}

export interface CameraOperationReqMsg {
  name: string
  operation?: string
  val?: string | number
}
