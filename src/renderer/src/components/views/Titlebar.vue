<script setup lang="ts">
import { ipcRenderer } from 'electron'
import { ref } from 'vue'
import emitter from '@src/utils/emitter'
import { useRouter } from 'vue-router'
import { AuthService } from '@renderer/components/utils/authService'
import { UserInfo } from '@src/types/userTypes'
import { useI18n } from 'vue-i18n'
import { watch } from 'vue'
const isUserDisable = ref(false)
const router = useRouter()
const aService = new AuthService()
const { t, locale } = useI18n()

const userName = ref('111111111111')
const selectLocale = ref('zh')

function changeLang() {
  console.log('111')
  if (selectLocale.value == 'zh') {
    console.log(selectLocale.value)
    selectLocale.value = 'en'
    locale.value = 'en'
  } else {
    selectLocale.value = 'zh'
    locale.value = 'zh'
  }
}

emitter.on('login-event', (value: any) => {
  const uInfo: UserInfo = aService.get()
  console.log('uInfo', uInfo)
  userName.value = uInfo.username
  isUserDisable.value = true
})

function closeWindow() {
  aService.clear()
  ipcRenderer.send('close')
}

function loginOut() {
  aService.clear()
  isUserDisable.value = false
  router.push('/Login')
}

ipcRenderer.on('log', (event, data) => {
  console.log(`log:${data}`)
})
</script>

<template>
  <div class="drag-region">
    <div class="window-title">
      <img class="img-logo" src="../../assets/logo.png" />
      <span>{{ t('远程相机设置') }}</span>
    </div>

    <div class="btn-area">
      <div @click="changeLang" class="lang">
        <el-icon><Switch /></el-icon>
        <span>{{ selectLocale }}</span>
      </div>
      <div v-if="isUserDisable" class="user-info">
        <el-icon style="margin: 0 4px 0 0"> <UserFilled /></el-icon>
        <span> {{ userName }}</span>
      </div>
      <div class="close" @click="closeWindow">
        <el-icon> <CloseBold /></el-icon>
      </div>
    </div>
  </div>
</template>

<style scoped>
.drag-region {
  width: 100%;
  height: 70px;
  background-color: black;
  display: flex;
  flex-direction: row;
  -webkit-app-region: drag;
  align-items: center;
}
.drag-region * {
  display: flex;
  align-items: center;
}
.window-title {
  justify-content: flex-start;
  width: 50%;
}
.window-title .img-logo {
  height: 30px;
  margin-left: 55px;
}
.window-title > span {
  font-size: larger;
  color: white;
  margin-left: 20px;
}

.btn-area {
  width: 55%;
  color: white;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.lang {
  display: flex;
  align-items: center;
  width: 15%;
  font-size: 20px;
}

.lang > i {
  -webkit-app-region: no-drag;
  margin-right: 10px;
}

.user-info {
  color: white;
  font-size: 20px;
}

.close {
  -webkit-app-region: no-drag;
  font-size: 25px;
  height: 45px;
  width: 45px;
  margin-left: 15px;
  justify-content: center;
}

.close:hover {
  background-color: red;
}
</style>
