import { MQTT } from '@src/utils/mqttClient'
import { CameraRespMsg } from '@src/types/cameraTypes'

export class CloudOperationService {
  constructor() {}

  userName: string = ''

  sendCameraMsgToCloud() {
    const notifify_cloud_msg = this.sendCommandToCamera()
    console.log('data', notifify_cloud_msg)
  }

  sendCommandToCamera() {
    // TODO send command to camera
    const cameraRequestParameters = { prop: '', type: '' }
    const cameraRespMsg: CameraRespMsg = { name: '', message: '', status: 'OK' }
    return cameraRespMsg
  }
}
