import { initMQTT, pMQTT } from '@src/utils/mqtt'
import { CameraOperationMsg, CameraRespMsg, CameraRequestParameters } from '@src/types/cameraTypes'
import { SendCommandToCameraService } from './send-command-to-camera.service'

export class CloudOperationService {
  constructor(private sendCommandToCameraService: SendCommandToCameraService) {}

  userName: string = ''

  receiveMqttMsg() {
    initMQTT(this.userName)
    if (!pMQTT) {
      console.log('MQTT init error')
    }
    const message = ''
    const messageString = message.toString()
    const cameraOperationMsg = JSON.parse(messageString) as CameraOperationMsg
    return cameraOperationMsg
  }

  sendCameraMsgToCloud() {
    const notifify_cloud_msg = this.sendCommandToCamera()
    console.log('data', notifify_cloud_msg)
  }

  sendCommandToCamera() {
    const receive_msg = this.receiveMqttMsg()
    console.log(receive_msg)
    // TODO send command to camera
    const cameraRequestParameters = { prop: '', type: '' }
    this.sendCommandToCameraService.SendCommandToCamera(cameraRequestParameters)
    const cameraRespMsg: CameraRespMsg = { prop: '', message: '', status: 'OK' }
    return cameraRespMsg
  }
}
