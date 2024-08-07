<script setup lang="ts">
import { ipcRenderer } from 'electron'
import { ref } from 'vue'
import emitter from '@src/utils/emitter'
import { useRouter } from 'vue-router'
import { AuthService } from '@renderer/components/utils/authService'
import { UserInfo } from '@src/types/userTypes'
import { useI18n } from 'vue-i18n'
const isUserDisable = ref(false)
const router = useRouter()
const aService = new AuthService()
const { t } = useI18n()

const userName = ref('')
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
</script>

<template>
  <header id="titlebar">
    <div id="drag-region">
      <el-row>
        <el-col :span="10">
          <div id="window-title">
            <el-icon style="margin-right: 4px; font-size: 20px">
              <CameraFilled />
            </el-icon>
            <span>{{ t('title') }}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div v-if="isUserDisable" class="user-button">
            <el-icon style="margin: 0 4px 0 0"> <UserFilled /></el-icon>
            <span>
              {{ userName }}
            </span>
          </div>
        </el-col>
        <div class="window-controls">
          <div v-if="isUserDisable" id="exit-button" class="button" @click="loginOut">
            {{ t('logout') }}
          </div>
          <div id="close-button" class="button" @click="closeWindow">
            <el-icon>
              <CloseBold />
            </el-icon>
          </div>
        </div>
      </el-row>
    </div>
  </header>
</template>

<style>
#titlebar {
  display: block;
  height: 32px;
  width: calc(100% - 2px);
}

.menu-background-color {
  background-color: rgb(64, 64, 64);
}

#titlebar {
  padding: 4px;
  color: #fff;
}

#titlebar #drag-region {
  width: 100%;
  height: 100%;
  -webkit-app-region: drag;
}

#titlebar #drag-region {
  display: grid;
}

#window-title {
  grid-column: 1;
  display: flex;
  align-items: center;
  overflow: hidden;
  font-family: 'Segoe UI', sans-serif;
  /* font-size: 12px; */
}

.maximized #window-title {
  margin-left: 12px;
}

.user-button {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 100%;
}

#window-title span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  /* line-height: 1.5; */
}

.window-controls {
  display: grid;
  grid-template-columns: repeat(2, 40px);
  margin-left: 15px;
}

.window-controls .button {
  grid-row: 1 / span 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  -webkit-app-region: no-drag;
  padding: 0px 4px;
}

.window-controls .button {
  user-select: none;
}

.window-controls .button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.window-controls .button:active {
  background: rgba(255, 255, 255, 0.2);
}

#close-button:hover,
#exit-button:hover {
  background: #e81123 !important;
}

#close-button:active,
#exit-button:hover {
  background: #f1707a !important;
}

#close-button:active .icon {
  filter: invert(1);
}

#exit-button:active .icon {
  filter: invert(1);
}

#exit-button {
  grid-column: 1;
}

#close-button {
  grid-column: 2;
}
</style>
