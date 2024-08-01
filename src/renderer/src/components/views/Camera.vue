<script setup lang="ts">
import { ref } from 'vue'
import { CameraInfo, CameraOperationReqMsg, CameraRespMsg } from '@src/types/cameraTypes'
import { RemoterInfo } from '@src/types/userTypes'
import { useI18n } from 'vue-i18n'
import { SendMsgToCloudService } from '../services/send-msg-cloud.service'
import { MQTT } from '@src/utils/mqttClient'
import { userInfo } from 'os'
import { ReadyTicketResp } from '@src/types/cloudInfoTypes'
import WebSocketService from '../services/send-command-to-camera.service'
import { json } from 'stream/consumers'
import { OBSClient } from '@src/utils/obsClient'
const cInfo = ref<CameraInfo>({
  camera: '',
  status: '',
  clientId: '',
  imgPath: ''
})
const rInfo = ref<RemoterInfo>({
  remoterId: '...',
  status: 'Remote Pairing...'
})
const isAlertMessageBoxVisible = ref(false) //连接相机等待框
const isMessageBoxVisible = ref(false) //相机信息显示
const isRemoterButtonDisabled = ref(false) //禁用远程控制
const isCameraButtonDisabled = ref(false) //禁用连接相机
let ws_obs: OBSClient
const { t } = useI18n()
const sendMsgToCloudService = new SendMsgToCloudService()

function setCameraInfo() {
  // update camera info and get a picture
  cInfo.value = {
    camera: 'A7M4-123456678',
    status: 'Connected',
    clientId: 'crsu-0001',
    imgPath: '/src/assets/1.jpg'
  }
}

async function cameraConnection() {
  // isCameraButtonDisabled.value = true
  isMessageBoxVisible.value = false
  isAlertMessageBoxVisible.value = true
  const connectCommand: CameraOperationReqMsg = {
    name: 'ConnectCamera',
    val: 1
  }

  ws_camera.client.onmessage = function (evt) {
    const ws_msg = evt.data as CameraRespMsg
    switch (ws_msg.name) {
      case 'ConnectCamera':
        console.log('process connect to camera')
        cInfo.value.status = ws_msg.status
        setCameraInfo()
        // TODO get image from obs
        break
      default:
        console.log('process send msg to cloud')
        break
    }
  }
  setTimeout(() => {
    isAlertMessageBoxVisible.value = false
    isMessageBoxVisible.value = !isAlertMessageBoxVisible.value //wait
    isCameraButtonDisabled.value = false
  }, 3000)
}

async function requestRemoteSetting() {
  isRemoterButtonDisabled.value = true
  // rInfo.value = {
  //   camera_id: 'crsp-0001',
  //   status: 'Remote Setting'
  // }
  const req_create_ticket = {
    camera_id: 'I7M4 (123456678)',
    description: 'help to do something'
  }
  const ticket_resp = await sendMsgToCloudService.createTicket(req_create_ticket)
  let is_ticket_ready: ReadyTicketResp
  if (ticket_resp.message == 'OK') {
    is_ticket_ready = await sendMsgToCloudService.readyTicket(ticket_resp.data.ticket_id)
    if (is_ticket_ready.message !== 'OK') {
      console.log('ticket is not ready')
    }
  }
  // connect mqtt
  const mqtt = new MQTT('test_user')
  mqtt.clientId = String(ticket_resp.data.ticket_id)
  cInfo.value.clientId = String(ticket_resp.data.ticket_id)
  mqtt.topic = ticket_resp.data.topic
  mqtt.createConnection()
  mqtt.topicSubscribe()
  // rInfo.value.status = 'Remote Setting Completed'
  isRemoterButtonDisabled.value = false
}
</script>
<template>
  <div class="camera-page">
    <el-row>
      <div />
      <el-col :span="12">
        <el-button
          type="primary"
          plain
          class="border-button"
          :disabled="isCameraButtonDisabled"
          @click="cameraConnection"
          >{{ t('cameraConnection') }}</el-button
        >
      </el-col>
      <el-col :span="12" style="text-align: right">
        <el-button
          type="primary"
          plain
          class="border-button"
          :disabled="isRemoterButtonDisabled"
          @click="requestRemoteSetting"
          >{{ t('requestRemoteSetting') }}</el-button
        >
      </el-col>
    </el-row>
    <el-row v-if="isAlertMessageBoxVisible" class="waiting-rect">
      <div />
      <el-col style="text-align: center">
        <div class="alert-message-box">
          <div class="title">{{ t('cameraConnecting') }}</div>
          <div class="message">{{ t('pleaseKeepU') }}</div>
        </div>
      </el-col>
    </el-row>
    <div v-if="isMessageBoxVisible" class="camera-content">
      <div class="camera-content-left">
        <div class="message-box">
          <p>
            <b>{{ t('camera') }}</b
            >{{ cInfo?.camera }}
          </p>
          <p>
            <b>{{ t('status') }}</b
            >{{ cInfo?.status }}
          </p>
          <p>
            <b>{{ t('clientId') }}</b
            >{{ cInfo?.clientId }}
          </p>
        </div>
        <div class="message-box">
          <p>
            <b>{{ t('remoterId') }}</b
            >{{ rInfo?.remoterId }}
          </p>
          <p>
            <b>{{ t('status') }}</b
            >{{ rInfo?.status }}
          </p>
        </div>
      </div>
      <div class="camera-content-right">
        <img class="camera-img-box" :src="cInfo?.imgPath" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.camera-page {
  height: 630px;
}

.waiting-rect {
  margin-top: 130px;
}

.border-button {
  width: 130px;
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
  height: 100%;
  width: 100%;
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
