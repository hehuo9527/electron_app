<script setup lang="ts">
import { ref } from 'vue'
import { CameraInfo, CameraRespMsg } from '@src/types/cameraTypes'
import { RemoterInfo } from '@src/types/userTypes'
import { useI18n } from 'vue-i18n'
import { SendMsgToCloudService } from '../services/send-msg-cloud.service'
import { MQTT } from '@renderer/components/utils/mqttClient'
import {
  CameraStatusMsgData,
  CommandData,
  MQTTMsg,
  TicketStatusMsgData
} from '@src/types/cloudInfoTypes'
import { OBSClient } from '@renderer/components/utils/obsClient'
import mockImg from '@renderer/assets/mock-img.jpg'
import { ipcRenderer } from 'electron'
import { AuthService } from '../utils/authService'
import { error } from 'console'

const cInfo = ref<CameraInfo>({
  camera: '',
  status: '',
  imgPath: ''
})
const rInfo = ref<RemoterInfo>({
  remoterId: '...',
  status: 'Remote Pairing...'
})
const auth = new AuthService()
const ticketDescription = ref('')
const isReady = ref(false)
const isAlertMessageBoxVisible = ref(false) //连接相机等待框
const isMessageBoxVisible = ref(false) //相机信息显示
const isRemoterButtonDisabled = ref(false) //禁用远程控制
const isCameraButtonDisabled = ref(false) //禁用连接相机
let mqttMsg = ref<MQTTMsg>()
const obs_url = ref('localhost:4455')
const obs_source = ref('视频采集设备')
let ws_obs: OBSClient = new OBSClient()
let e_mqtt: MQTT
const { t } = useI18n()
const sendMsgToCloudService = new SendMsgToCloudService()
const closeTicketDialog = ref(false)
const createTicketDialog = ref(false)
const hintMsg = ref('')

async function cameraConnection() {
  isCameraButtonDisabled.value = true
  isAlertMessageBoxVisible.value = true
  try {
    const response = ipcRenderer.sendSync('startSDK')
    console.log('startSDK', response)
    if (response == 'success') {
      DisplayMessage('启动SDK成功')
    } else {
      DisplayMessage('启动SDK失败')
      throw error('startSDK fail')
    }
    // setCameraInfo()
    await ws_obs.connect(`ws://${obs_url.value}`)
    cInfo.value.imgPath = (await ws_obs.getSourceScreenshot(obs_source.value)).imageData
  } catch (error) {
    isCameraButtonDisabled.value = false
    isAlertMessageBoxVisible.value = false
    DisplayMessage('相机初始化失败,请检查USB和OBS')
    return
  }
  isCameraButtonDisabled.value = false
  isAlertMessageBoxVisible.value = false
  isMessageBoxVisible.value = true
}

async function requestRemoteSetting() {
  if (isReady.value == false) {
    DisplayMessage('相机准备未完成')
    return
  }
  isRemoterButtonDisabled.value = true
  createTicketDialog.value = true
}

function commandHandle(command: CommandData) {
  ipcRenderer.send('mqtt:msg', JSON.stringify(command))
  DisplayMessage(
    `正在${command.operation == 'GET' ? '获取' : '设置'}相机${command.name}:${command.value}`
  )
}

function ticketHandle(ticket_msg: TicketStatusMsgData) {
  closeTicketDialog.value = true
}

function cameraHandle(camera_msg: CameraStatusMsgData) {}

function ProcessMsg(e_mqtt: MQTT) {
  // listen mqtt
  e_mqtt.createConnection()
  e_mqtt.topicSubscribe()
  e_mqtt.client.on('message', (topic, message) => {
    console.log(`Received message ${message} from topic:${topic}`)
    mqttMsg.value = JSON.parse(message.toString())
    if (mqttMsg.value?.type == 'command') {
      console.log('CommandData ', mqttMsg.value.data)
      commandHandle(mqttMsg.value.data as CommandData)
    } else if (mqttMsg.value?.type == 'ticket_status_msg') {
      console.log('TicketStatusMsgData ', mqttMsg.value.data)
      ticketHandle(mqttMsg.value.data as TicketStatusMsgData)
      DisplayMessage(mqttMsg.value.data)
    } else if (mqttMsg.value?.type == 'camera_status_msg') {
      console.log('CameraStatusMsgData ', mqttMsg.value.data)
      cameraHandle(mqttMsg.value.data as CameraStatusMsgData)
      DisplayMessage(mqttMsg.value.data)
    }
  })
}

async function SDKMsgHandle(evt, data) {
  console.log('receive sdk data', data)
  DisplayMessage(`收到相机返回消息${data}`)
  const cameraRespMsg: CameraRespMsg = JSON.parse(data.toString())
  if (cameraRespMsg.name.match('onConnect')) {
    isReady.value = true
    isRemoterButtonDisabled.value = false
    cInfo.value.camera = cameraRespMsg.message
    DisplayMessage('相机连接成功!')
    cInfo.value.status = 'Connect'
  } else if (cameraRespMsg.name.match('disConnect')) {
    cInfo.value.status = 'Disconnect'
    sendMsgToCloudService.updateCameraStatus(e_mqtt.clientId, 'disconnect')
    DisplayMessage('相机断开了')
  } else {
    let command = mqttMsg.value?.data as CommandData
    const updateParameters: any = {
      ticket_id: e_mqtt.clientId,
      operation: command.operation,
      name: cameraRespMsg.name,
      value: cameraRespMsg.message
    }
    if (cameraRespMsg.status !== 'OK') {
      DisplayMessage('相机消息设置不成功')
      // throw error('SDK Return ERROR')
      updateParameters.value = '-1'
    }

    console.log('upload log', JSON.stringify(updateParameters))
    await sendMsgToCloudService
      .updateParam(updateParameters)
      .then(() => {
        DisplayMessage('命令上报成功')
      })
      .catch((error) => {
        DisplayMessage(`命令上报失败:${error}`)
      })

    // TODO Send image to cloud
    let obs_image = (await ws_obs.getSourceScreenshot(obs_source.value)).imageData
    console.log('obs_img msg get success')
    sendMsgToCloudService
      .uploadImg({})
      .then(() => {
        DisplayMessage('上传图片成功')
      })
      .catch((error) => {
        DisplayMessage('上传图片失败')
      })
  }
}

function DisplayMessage(meesage) {
  console.log(meesage)
  hintMsg.value = meesage
}

function ResigterListener() {
  ipcRenderer.on('sdk:msg', SDKMsgHandle)
}
ResigterListener()

function dialogBtn(res: boolean) {
  closeTicketDialog.value = false
  console.log(res)
}

async function ticketDialogBtn(res: boolean) {
  createTicketDialog.value = false
  if (res) {
    const req_create_ticket = {
      camera_id: cInfo.value.camera,
      description: ticketDescription.value
    }
    console.log("ticketDescription",ticketDescription.value)
    const ticket_resp = await sendMsgToCloudService.createTicket(req_create_ticket)
    if (ticket_resp.message === 'Error') {
      isRemoterButtonDisabled.value = false
      DisplayMessage('创建订单失败')
      return
    }
    cInfo.value.imgPath = (await ws_obs.getSourceScreenshot(obs_source.value)).imageData
    let imgFile=base64ImgtoFile(cInfo.value.imgPath)
    let formData=new FormData()
    formData.append("ticket_id",String(ticket_resp.data?.ticket_id))
    formData.append("image",imgFile)
    let reqUploadImg={formData}
    console.log(reqUploadImg)
    sendMsgToCloudService.uploadImg(
      reqUploadImg
    )
    const readyTicket = await sendMsgToCloudService.readyTicket(ticket_resp.data!.ticket_id)
    rInfo.value = {
      remoterId: String(ticket_resp.data!.ticket_id),
      status: 'waiting'
    }

    // connect
    try {
      let uInfo = auth.get()
      e_mqtt = new MQTT(uInfo.username)
      e_mqtt.clientId = String(ticket_resp.data!.ticket_id)
      e_mqtt.topic = ticket_resp.data!.topic
      rInfo.value.status = 'Remote Setting Completed'
      // isRemoterButtonDisabled.value = false
      ProcessMsg(e_mqtt)
      DisplayMessage('远程服务订单创建成功,等待接单')
    } catch (error) {
      isRemoterButtonDisabled.value = false
      DisplayMessage('MQTT连接失败')
      return
    }
  }
}

function base64ImgtoFile(dataurl, filename = 'file') {
      const arr = dataurl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const suffix = mime.split('/')[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], `${filename}.${suffix}`, {
        type: mime
      })
    }
</script>
<template>
  <div class="camera-page">
    <el-row>
      <el-col :span="4" style="text-align: right">
        <el-button
          type="primary"
          plain
          class="border-button"
          :disabled="isCameraButtonDisabled"
          @click="cameraConnection"
          >{{ t('连接相机') }}</el-button
        >
      </el-col>
      <el-col :span="20" style="text-align: right">
        <el-button
          type="primary"
          plain
          class="border-button"
          :disabled="isRemoterButtonDisabled"
          @click="requestRemoteSetting"
          >{{ t('请求远程设置') }}</el-button
        >
      </el-col>
    </el-row>
    <el-row v-if="isAlertMessageBoxVisible" class="waiting-rect">
      <div />
      <el-col style="text-align: center">
        <div class="alert-message-box">
          <div class="title">{{ t('相机连接中...') }}</div>
          <div class="message">{{ t('请保持相机正在USB连接') }}</div>
        </div>
      </el-col>
    </el-row>
    <div v-if="isMessageBoxVisible" class="camera-content">
      <div class="camera-content-left">
        <div class="message-box">
          <p>
            <b>{{ t('相机') }}</b
            >{{ cInfo?.camera }}
          </p>
          <p>
            <b>{{ t('状态') }}</b
            >{{ cInfo?.status }}
          </p>
        </div>
        <div class="message-box">
          <p>
            <b>{{ t('远程ID') }}</b
            >{{ rInfo?.remoterId }}
          </p>
          <p>
            <b>{{ t('状态') }}</b
            >{{ rInfo?.status }}
          </p>
        </div>
      </div>
      <div class="camera-content-right">
        <img alt="" class="camera-img-box" :src="cInfo.imgPath" />
      </div>
    </div>
  </div>
  <div class="hint-msg">{{ hintMsg }}</div>
  <el-dialog v-model="closeTicketDialog" width="500" align-center>
    <span>设置效果满意,关闭订单?</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogBtn(false)">NO</el-button>
        <el-button type="primary" @click="dialogBtn(true)"> YES </el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="createTicketDialog" width="500" align-center>
    <div>
      <span>相机ID:</span>
      <span class="camera-id"> {{ cInfo?.camera }}</span>
    </div>

    <div>
      <span
        >订单描述:<el-input
          v-model="ticketDescription"
          class="ticket-input"
          placeholder="请输入订单描述"
        ></el-input
      ></span>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="ticketDialogBtn(false)">NO</el-button>
        <el-button type="primary" @click="ticketDialogBtn(true)"> YES </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
el-button {
  width: 150px;
}
.camera-page {
  height: 600px;
}

.waiting-rect {
  margin-top: 130px;
}

.obs_config {
  display: flex;
  justify-content: space-evenly;
  gap: 40px;
}

.border-button {
  width: 180px;
  height: 45px !important;
  border: 1px solid rgb(243, 170, 120) !important;
  background-color: transparent !important;
  color: black !important;
  padding: 6px 30px !important;
}

.border-button:hover {
  background-color: rgb(237, 125, 49) !important;
  color: white !important;
}

.alert-message-box {
  border: 1px solid black;
  text-align: center;
  margin-top: 20px;
  padding: 30px 10px;
  width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.alert-message-box .title {
  font-size: 24px;
  font-weight: bold;
}

.alert-message-box .message {
  font-size: 18px;
  color: rgb(237, 125, 48);
}
.camera-content {
  display: flex;
  margin-top: 30px;
  height: 500px;
}
.camera-content-left {
  display: flex;
  flex-direction: column;
  margin: 0, 0, 0, 20px;
  width: 350px;
}
.camera-content-right {
  width: auto;
  box-sizing: border-box;
  margin: 10px 0 0 100px;
}
.camera-img-box {
  height: 480px;
  width: 640 px;
  border: 1px solid #ccc;
}

b {
  font-weight: bold !important;
}

.message-box {
  border: 1px solid rgb(220, 220, 220);
  padding: 10px;
  width: 350px;
  margin-top: 80px;
  font-size: 18px;
}
.message-box:last-child {
  margin-top: 80px;
}

.ticket-input {
  margin-left: 30px;
  width: 250px;
}
.camera-id {
  margin-left: 40px;
}

.hint-msg {
  width: 100%;
  text-align: center;
}
</style>
