<script setup lang="ts">
import { ref } from 'vue'
import { CameraInfo, CameraOperationReqMsg, CameraRespMsg } from '@src/types/cameraTypes'
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
import { ElNotification } from 'element-plus'
import { AuthService } from '../utils/authService'

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
const centerDialogVisible = ref(false)
function setCameraInfo() {
  // update camera info and get a picture
  // TODO need update when sdk return
  cInfo.value = {
    camera: 'A7M4-123456678',
    status: 'Connected',
    imgPath: mockImg
  }
}
async function cameraConnection() {
  isCameraButtonDisabled.value = true
  isAlertMessageBoxVisible.value = true
  try {
    // const checkRes = checkOBSInput()
    // if (!checkRes) {
    //   isCameraButtonDisabled.value = false
    //   isAlertMessageBoxVisible.value = false
    //   return
    // }
    const response = ipcRenderer.sendSync('startSDK')
    console.log('startSDK', response)
    if (response == 'success') {
      DisplayMessage('启动SDK成功')
    } else {
      // TODO
      DisplayMessage('需要重启PC App')
    }
    setCameraInfo()
    await ws_obs.connect(`ws://${obs_url.value}`)
    cInfo.value.imgPath = (await ws_obs.getSourceScreenshot(obs_source.value)).imageData
  } catch (error) {
    isCameraButtonDisabled.value = false
    isAlertMessageBoxVisible.value = false
    DisplayMessage('相机初始化失败,请检查USB')
    return
  }
}

// function checkOBSInput() {
//   if (obs_url.value === '') {
//     DisplayMessage(t('未设置OBS IP地址'))
//     return false
//   }
//   if (obs_source.value === '') {
//     DisplayMessage('没有设置OBS的信号源')
//     return false
//   }
//   return true
// }

async function requestRemoteSetting() {
  if (isReady.value == false) {
    DisplayMessage('相机准备未完成')
    return
  }
  isRemoterButtonDisabled.value = true
  // TODO description ,camera_id display
  const req_create_ticket = {
    camera_id: 'I7M4 (123456678)',
    description: 'help to do something'
  }
  const ticket_resp = await sendMsgToCloudService.createTicket(req_create_ticket)
  if (ticket_resp.message === 'Error') {
    DisplayMessage('创建订单失败')
    return
  }
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
    isRemoterButtonDisabled.value = false
    ProcessMsg(e_mqtt)
    DisplayMessage('远程服务订单创建成功,等待接单')
  } catch (error) {
    DisplayMessage('MQTT连接失败')
    return
  }

  // is_ticket_ready = await sendMsgToCloudService.readyTicket(ticket_resp.data.ticket_id)
  // if (is_ticket_ready.message !== 'OK') {
  //   throw error('ticket is not ready')
  //   // TODO: Qiu
  // }
}

function commandHandle(command: CommandData) {
  ipcRenderer.send('mqtt:msg', JSON.stringify(command))
  DisplayMessage(
    `正在${command.operation == 'GET' ? '获取' : '设置'}相机${command.name}:${command.value}`
  )
}

function ticketHandle(ticket_msg: TicketStatusMsgData) {
  centerDialogVisible.value = true
}

function cameraHandle(camera_msg: CameraStatusMsgData) {}

function ProcessMsg(e_mqtt: MQTT) {
  // listen mqtt
  e_mqtt.createConnection()
  e_mqtt.topicSubscribe()
  e_mqtt.client.on('message', (topic, message) => {
    console.log(`Received message ${JSON.stringify(message)} from topic:${topic}`)

    mqttMsg.value = JSON.parse(message.toString())

    if (mqttMsg.value?.type == 'command') {
      commandHandle(mqttMsg.value.data as CommandData)
    } else if (mqttMsg.value?.type == 'ticket_status_msg') {
      ticketHandle(mqttMsg.value.data as TicketStatusMsgData)
    } else if (mqttMsg.value?.type == 'camera_status_msg') {
      cameraHandle(mqttMsg.value.data as CameraStatusMsgData)
    }
    console.log('send msg success')
  })
}

async function SDKMsgHandle(evt, data) {
  console.log('receive sdk data', data)
  DisplayMessage(`收到相机返回消息${data}`)
  const cameraRespMsg: CameraRespMsg = JSON.parse(data.toString())
  if (cameraRespMsg.name.match('onConnect')) {
    isReady.value = true
    DisplayMessage('相机连接成功!')
    cInfo.value.camera = cameraRespMsg.message
    cInfo.value.status = 'Connect'
  } else if (cameraRespMsg.name.match('disConnect')) {
    cInfo.value.status = 'Disconnect'
    DisplayMessage('相机断开了')
  } else {
    let command = mqttMsg.value?.data as CommandData
    const updateParameters: any = {
      ticket_id: e_mqtt.clientId,
      operation: command.operation,
      name: cameraRespMsg.name,
      value: command.value
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
    // sendMsgToCloudService.uploadImg({})
  }
}

function DisplayMessage(meesage) {
  ElNotification({
    message: meesage,
    offset: 100,
    duration: 5000
  })
}

function ResigterListener() {
  ipcRenderer.on('sdk:msg', SDKMsgHandle)
}
ResigterListener()

function test() {
  centerDialogVisible.value = true
}
function dialogBtn(res: boolean) {
  centerDialogVisible.value = false
}
</script>
<template>
  <div class="camera-page">
    <el-row>
      <div />
      <!-- <el-col :span="10" class="obs_config">
        <el-input v-model="obs_url" placeholder="请输入OBS的IP:PORT"></el-input>
        <el-input v-model="obs_source" placeholder="请输入OBS的信号源"></el-input>
      </el-col> -->
      <el-col :span="10" style="text-align: right">
        <!-- <button @click="test">test</button> -->
        <el-button
          type="primary"
          plain
          class="border-button"
          :disabled="isCameraButtonDisabled"
          @click="cameraConnection"
          >{{ t('连接相机') }}</el-button
        >
      </el-col>
      <el-col :span="4" style="text-align: right">
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
          <!-- <p>
            <b>{{ t('客户端ID') }}</b
            >{{ cInfo?.clientId }}
          </p> -->
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
  <el-dialog v-model="centerDialogVisible" width="500" align-center>
    <span>设置效果满意,关闭订单?</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogBtn(false)">NO</el-button>
        <el-button type="primary" @click="dialogBtn(true)"> YES </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
el-button {
  width: 150px;
}
.camera-page {
  height: 630px;
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
</style>
