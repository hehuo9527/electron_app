import { MQTT } from '@src/utils/mqttClient'
import { CameraOperationMsg, CameraRespMsg, CameraRequestParameters } from '@src/types/cameraTypes'
import { SendCommandToCameraService } from './send-command-to-camera.service'

export class CloudOperationService {
  constructor(private sendCommandToCameraService: SendCommandToCameraService) {}

  userName: string = ''

  sendCameraMsgToCloud() {
    const notifify_cloud_msg = this.sendCommandToCamera()
    console.log('data', notifify_cloud_msg)
  }

  sendCommandToCamera() {
    // TODO send command to camera
    const cameraRequestParameters = { prop: '', type: '' }
    this.sendCommandToCameraService.SendCommandToCamera(cameraRequestParameters)
    const cameraRespMsg: CameraRespMsg = { prop: '', message: '', status: 'OK' }
    return cameraRespMsg
  }
}
