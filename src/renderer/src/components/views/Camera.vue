<script setup lang="ts">
import { ref } from "vue";
import {
  CameraInfo,
  CameraOperationReqMsg,
  CameraRespMsg,
} from "@src/types/cameraTypes";
import { RemoterInfo } from "@src/types/userTypes";
import { useI18n } from "vue-i18n";
import { SendMsgToCloudService } from "../services/send-msg-cloud.service";
import { MQTT } from "@src/utils/mqttClient";
import { ReadyTicketResp } from "@src/types/cloudInfoTypes";
import { OBSClient } from "@src/utils/obsClient";
import mockImg from "@renderer/assets/mock-img.jpg";
import { ipcRenderer } from "electron";
import OBSWebSocket from "obs-websocket-js";

const cInfo = ref<CameraInfo>({
  camera: "",
  status: "",
  clientId: "",
  imgPath: "",
});
const rInfo = ref<RemoterInfo>({
  remoterId: "...",
  status: "Remote Pairing...",
});
const isAlertMessageBoxVisible = ref(false); //连接相机等待框
const isMessageBoxVisible = ref(false); //相机信息显示
const isRemoterButtonDisabled = ref(false); //禁用远程控制
const isCameraButtonDisabled = ref(false); //禁用连接相机

const { t } = useI18n();
const sendMsgToCloudService = new SendMsgToCloudService();

function setCameraInfo() {
  // update camera info and get a picture
  cInfo.value = {
    camera: "A7M4-123456678",
    status: "Connected",
    clientId: "crsu-0001",
    imgPath: mockImg,
  };
}

function startSDK() {
  ipcRenderer.send("startSDK");
}

async function cameraConnection() {
  // isCameraButtonDisabled.value = true
  isMessageBoxVisible.value = false;
  isAlertMessageBoxVisible.value = true;
  const WhiteBalanceCommand: CameraOperationReqMsg = {
    name: "WhiteBalance",
    operation: "GET",
  };
  startSDK();
  setCameraInfo();
  // let ws_obs = new OBSClient();
  // const { obsWebSocketVersion, negotiatedRpcVersion } = await ws_obs.connect(
  //   "ws://192.168.1.23:4455",
  //   "Hcs8Pczy4JVDfnR2",
  //   {
  //     rpcVersion: 1,
  //   },
  // );

  // await ws_obs.connect("ws://192.168.1.23:4455", "Hcs8Pczy4JVDfnR2");
  // console.log(
  //   `Connected to server ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`,
  // );
  // ws_obs
  //   .call("GetSourceScreenshot", {
  //     sourceName: "显示器采集",
  //     imageFormat: "png",
  //   })
  //   .then((data) => {
  //     // console.log(data.imageData);
  //     cInfo.value.imgPath = data.imageData;
  //   });
  // cInfo.value.imgPath = (await ws_obs.getSourceScreenshot()).imageData;
  // window.api.sendMessage(JSON.stringify(WhiteBalanceCommand));

  isAlertMessageBoxVisible.value = false;
  isMessageBoxVisible.value = !isAlertMessageBoxVisible.value;
  isCameraButtonDisabled.value = false;
}

window.api.onMessage((data) => {
  console.log("data->", data);
});
async function requestRemoteSetting() {
  const WhiteBalanceCommand: CameraOperationReqMsg = {
    name: "WhiteBalance",
    operation: "GET",
  };
  window.api.sendMessage(JSON.stringify(WhiteBalanceCommand));

  // isRemoterButtonDisabled.value = true
  // rInfo.value = {
  //   remoterId: 'crsp-0001',
  //   status: 'Remote Setting'
  // }
  // const req_create_ticket = {
  //   camera_id: 'I7M4 (123456678)',
  //   description: 'help to do something'
  // }
  // const ticket_resp = await sendMsgToCloudService.createTicket(req_create_ticket)
  // let is_ticket_ready: ReadyTicketResp
  // if (ticket_resp.message == 'OK') {
  //   is_ticket_ready = await sendMsgToCloudService.readyTicket(ticket_resp.data.ticket_id)
  //   if (is_ticket_ready.message !== 'OK') {
  //     console.log('ticket is not ready')
  //   }
  // }
  // // connect mqtt
  const mqtt = new MQTT("test_user");
  // mqtt.clientId = String(ticket_resp.data.ticket_id)
  // cInfo.value.clientId = String(ticket_resp.data.ticket_id)
  // mqtt.topic = ticket_resp.data.topic
  // mqtt.createConnection()
  // mqtt.topicSubscribe()
  // // rInfo.value.status = 'Remote Setting Completed'
  // isRemoterButtonDisabled.value = false
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
          >{{ t("cameraConnection") }}</el-button
        >
      </el-col>
      <el-col :span="12" style="text-align: right">
        <el-button
          type="primary"
          plain
          class="border-button"
          :disabled="isRemoterButtonDisabled"
          @click="requestRemoteSetting"
          >{{ t("requestRemoteSetting") }}</el-button
        >
      </el-col>
    </el-row>
    <el-row v-if="isAlertMessageBoxVisible" class="waiting-rect">
      <div />
      <el-col style="text-align: center">
        <div class="alert-message-box">
          <div class="title">{{ t("cameraConnecting") }}</div>
          <div class="message">{{ t("pleaseKeepU") }}</div>
        </div>
      </el-col>
    </el-row>
    <div v-if="isMessageBoxVisible" class="camera-content">
      <div class="camera-content-left">
        <div class="message-box">
          <p>
            <b>{{ t("camera") }}</b
            >{{ cInfo?.camera }}
          </p>
          <p>
            <b>{{ t("status") }}</b
            >{{ cInfo?.status }}
          </p>
          <p>
            <b>{{ t("clientId") }}</b
            >{{ cInfo?.clientId }}
          </p>
        </div>
        <div class="message-box">
          <p>
            <b>{{ t("remoterId") }}</b
            >{{ rInfo?.remoterId }}
          </p>
          <p>
            <b>{{ t("status") }}</b
            >{{ rInfo?.status }}
          </p>
        </div>
      </div>
      <div class="camera-content-right">
        <!-- <img :alt="" class="camera-img-box" /> -->
        <img
          :alt="cInfo.imgPath ? '显示的图片' : mockImg"
          class="camera-img-box"
          :src="cInfo.imgPath"
        />
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
