<script setup lang="ts">
import Versions from './components/Versions.vue'
import OBSWebSocket, { EventSubscription, OBSEventTypes, OBSRequestTypes } from 'obs-websocket-js'
const obs = new OBSWebSocket()
const ipcHandle = () => window.electron.ipcRenderer.send('ping')

function WsTest() {
  let ws = new WebSocket('ws://localhost:8765')

  ws.onopen = function (evt) {
    console.log('Connection open ...')
    ws.send('Love from vue!')
  }
}

async function ObsTest() {
  try {
    const { obsWebSocketVersion, negotiatedRpcVersion } = await obs.connect(
      'ws://192.168.1.23:4455',
      'Hcs8Pczy4JVDfnR2',
      {
        rpcVersion: 1
      }
    )
    console.log(`Connected to server ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`)
    // 获取推流图像数据
    // 发送截图命令
    obs.call('GetVersion').then((data) => {
      console.log('getversion', data)
    })
    obs
      .call('GetSourceScreenshot', {
        sourceName: '显示器采集',
        imageFormat: 'png'
      })
      .then((data) => {
        console.log(data.imageData)
      })
  } catch (error) {
    console.log('obs err')
    console.error('Failed to connect', error)
  }
}
</script>

<template>
  <img alt="logo" class="logo" src="./assets/electron.svg" />
  <div class="creator">Powered by electron-vite</div>
  <div class="text">
    Build an Electron app with
    <span class="vue">Vue</span>
    and
    <span class="ts">TypeScript</span>
  </div>
  <p class="tip">Please try pressing <code>F12</code> to open the devTool</p>
  <div class="actions">
    <div class="action">
      <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">Documentation</a>
    </div>
    <div class="action">
      <a target="_blank" rel="noreferrer" @click="ipcHandle">Send IPC</a>
    </div>
    <div class="action">
      <a target="_blank" rel="noreferrer" @click="WsTest">WsTest</a>
    </div>
    <div class="action">
      <a target="_blank" rel="noreferrer" @click="ObsTest">ObsTest</a>
    </div>
  </div>
  <Versions />
</template>
