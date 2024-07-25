<script setup lang="ts">
import { ref } from 'vue'
import { cameraInfo } from '@src/types/cameraTypes'
import { remoterInfo } from '@src/types/userTypes'
import { useI18n } from 'vue-i18n'

const cInfo = ref<cameraInfo>()
const rInfo = ref<remoterInfo>()
const isAlertMessageBoxVisible = ref(false)
const isMessageBoxVisible = ref(false)
const isRemoterButtonDisabled = ref(false)
const isCameraButtonDisabled = ref(false)
const { t } = useI18n()

async function waitFiveSeconds(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 5000)
  })
}

function cameraInfoInit() {
  cInfo.value = {
    camera: '',
    status: '',
    clientId: '',
    imgPath: ''
  }
}

function remoterInfoInit() {
  rInfo.value = {
    remoterId: '...',
    status: 'Remote Pairing...'
  }
}

function setCameraInfo() {
  cInfo.value = {
    camera: 'A7M4-D5464748',
    status: 'Connected',
    clientId: 'crsu-0001',
    imgPath: '/src/assets/1.jpg'
  }
}

async function cameraConnection() {
  console.log('processPath', process.cwd())
  isCameraButtonDisabled.value = true
  cameraInfoInit()
  remoterInfoInit()
  isAlertMessageBoxVisible.value = true
  isMessageBoxVisible.value = !isAlertMessageBoxVisible.value
  await waitFiveSeconds()
  setCameraInfo()
  isAlertMessageBoxVisible.value = false
  isCameraButtonDisabled.value = false
  isMessageBoxVisible.value = !isAlertMessageBoxVisible.value
}

async function requestRemoteSetting() {
  isRemoterButtonDisabled.value = true
  rInfo.value = {
    remoterId: 'crsp-0001',
    status: 'Remote Setting'
  }
  await waitFiveSeconds()
  rInfo.value.status = 'Remote Setting Completed'
  isRemoterButtonDisabled.value = false
}
</script>
<template>
  <el-row :gutter="20">
    <div class="grid-content" />
    <el-col :span="12">
      <el-button type="primary" plain class="border-button" :disabled="isCameraButtonDisabled"
        @click="cameraConnection">{{ t('cameraConnection') }}</el-button>
    </el-col>
    <el-col :span="12" style="text-align: right">
      <el-button type="primary" plain class="border-button" :disabled="isRemoterButtonDisabled"
        @click="requestRemoteSetting">{{ t('requestRemoteSetting') }}</el-button>
    </el-col>
  </el-row>
  <el-row v-if="isAlertMessageBoxVisible" :gutter="20">
    <div class="grid-content" />
    <el-col style="text-align: center">
      <div class="alert-message-box" style="box-shadow: var(--el-box-shadow-lighter)">
        <div class="title">{{ t('cameraConnecting') }}</div>
        <div class="message">{{ t('pleaseKeepU') }}</div>
      </div>
    </el-col>
  </el-row>
  <el-row v-if="isMessageBoxVisible" :gutter="20" style="margin-top: 20px">
    <div class="grid-content" />
    <el-col :span="12">
      <el-row :gutter="20">
        <el-col>
          <div class="message-box">
            <p>
              <b>{{ t('camera') }}</b>{{ cInfo?.camera }}
            </p>
            <p>
              <b>{{ t('status') }}</b>{{ cInfo?.status }}
            </p>
            <p>
              <b>{{ t('clientId') }}</b>{{ cInfo?.clientId }}
            </p>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col>
          <div class="message-box" style="margin-top: 16px">
            <p>
              <b>{{ t('remoterId') }}</b>{{ rInfo?.remoterId }}
            </p>
            <p>
              <b>{{ t('status') }}</b>{{ rInfo?.status }}
            </p>
          </div>
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="12">
      <el-row :gutter="20">
        <el-col style="text-align: right">
          <img class="camera-img-box" :src="cInfo?.imgPath" />
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<style>
.border-button {
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

.camera-img-box {
  margin-top: 10px;
  max-height: 300px;
  max-width: 300px;
  padding: 4px;
  border: 1px solid #ccc;
}

b {
  font-weight: bold !important;
}

.message-box {
  border: 1px solid rgb(220, 220, 220);
  padding: 10px;
  margin-top: 10px;
  font-size: 18px;
}
</style>
