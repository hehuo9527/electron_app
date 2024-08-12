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
const { t } = useI18n()
const remoteBtn = ref(false)
const cInfo = ref<CameraInfo>({
  name: '',
  status: '',
  remoteStatus: ''
})
const date = ref(getDate())
function getDate() {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
</script>

<template>
  <div class="camera">
    <div class="left-page">
      <el-button class="btn">{{ t('连接相机') }}</el-button>
      <el-button class="btn" :disabled="!remoteBtn">{{ t('请求远程设置') }}</el-button>
      <div class="camera-info-box">
        <div class="item">
          <span>{{ t('相机ID :') }}</span>
          <span>{{ cInfo.name }}</span>
        </div>
        <div class="item">
          <span>{{ t('状态 :') }}</span>
          <span>{{ cInfo.status }}</span>
        </div>
        <div class="item">
          <span>{{ t('远程状态 :') }}</span>
          <span>{{ cInfo.remoteStatus }}</span>
        </div>
      </div>
    </div>
    <div class="right-page">
      <div class="img-box">
        <img class="img" src="../../assets/mock-img.jpg" />
        <div class="footer">
          <div class="msg">
            <span>Current Preview Image</span>
            <span>Date:{{ date }}</span>
          </div>
          <div class="refresh">
            <button>{{ t('刷新') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.camera {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
}
.left-page {
  width: 40%;
  display: flex;
  flex-direction: column;
}
.left-page .el-button {
  width: 200px;
  height: 45px;
  border: 1px solid rgb(206, 141, 22);
  background-color: transparent;
  color: black;
  padding: 6px 30px;
  margin: 40px 0 20px 80px;
}

.el-button:hover {
  background-color: rgb(226, 130, 66);
}
.el-button.is-disabled {
  background-color: rgb(190, 190, 190);
  border: 1px solid rgb(190, 190, 190);
  color: black;
}
.el-button.is-disabled:hover {
  background-color: rgb(190, 190, 190);
  border: 1px solid rgb(190, 190, 190);
  color: black;
}

.camera-info-box {
  border: 1px solid rgb(172, 172, 172);
  text-align: center;
  align-items: center;
  margin-top: 20px;
  width: 250px;
  border-radius: 6px;
  margin-left: 80px;
}
.item {
  margin: 10px 0 10px 0;
  display: flex;
  justify-content: sap;
}
.item span:first-of-type {
  font-weight: bold;
  margin-left: 10px;
  width: 100px;
  text-align: left;
}
.item span:last-of-type {
  font-weight: bold;
}

.right-page {
  margin-left: 3%;
  display: flex;
  flex-direction: column;
}
.img-box {
  padding: 20px 25px;
  border: 1px solid rgb(180, 180, 180);
  border-radius: 6px;
}
.img {
  width: 400px;
  height: 550px;
  border-radius: 4px;
}

.footer {
  display: flex;
  border: 1px solid rgb(180, 180, 180);
  border-radius: 6px;
}
.msg {
  display: flex;
  margin-left: 10px;
  flex-direction: column;
}

.refresh {
  margin: 10px 0 0 50px;
}
.refresh > button {
  height: 30px;
  background-color: rgb(89, 183, 226);
  color: white;
  border: 1px solid rgb(89, 183, 226);
  border-radius: 4px;
  width: 100px;
}
</style>
