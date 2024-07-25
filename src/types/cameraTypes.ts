export interface CameraInfo {
  camera: string
  status: string
  clientId: string
  imgPath: string
}

export enum CameraReturnStatus {
  OK = 'OK',
  NG = 'NG'
}

export interface CameraRequestParameters {
  prop: string
  type: string
  option?: number | string
}

export interface CameraRespMsg {
  prop: string
  status: CameraReturnStatus
  message: string
}
