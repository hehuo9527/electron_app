export interface CameraInfo {
  camera: string
  status: string
  clientId: string
  imgPath: string
}

export interface CameraRequestParameters {
  prop: string
  type: string
  option?: number | string
}

export interface CameraRespMsg {
  prop: string
  status: string
  message: string
}

export interface CameraOperationMsg {
  operation: string
  name: string
  val?: string
}
