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

const userName = ref('')
const selectLocale = ref('zh')
const localeOptions = [
  {
    value: 'zh',
    label: '中文'
  },
  {
    value: 'en',
    label: 'English'
  }
]

watch(selectLocale, (newValue) => {
  locale.value = newValue
})

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
        <el-col :span="8">
          <div id="window-title">
            <el-icon style="margin-right: 4px; font-size: 20px">
              <CameraFilled />
            </el-icon>
            <span>{{ t('远程相机设置') }}</span>
            <el-select
              v-model="selectLocale"
              class="els"
              placeholder="中文"
              :popper-append-to-body="false"
            >
              <el-option
                v-for="item in localeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="13">
          <div v-show="isUserDisable" class="user-button">
            <el-icon style="margin: 0 4px 0 0"> <UserFilled /></el-icon>
            <span>
              {{ userName }}
            </span>
          </div>
        </el-col>
        <div class="window-controls">
          <div v-show="isUserDisable" id="exit-button" class="button" @click="loginOut">
            {{ t('登出') }}
          </div>
          <div class="button close-button" @click="closeWindow">
            <el-icon>
              <CloseBold />
            </el-icon>
          </div>
        </div>
      </el-row>
    </div>
  </header>
</template>

<style scoped>
#titlebar {
  background-color: rgb(64, 64, 64);
  display: block;
  height: 32px;
  width: calc(100% - 2px);
}

#titlebar {
  padding: 4px;
  color: #fff;
}

#titlebar #drag-region {
  width: 100%;
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
  span {
    width: 175px;
  }
}

.maximized #window-title {
  margin-left: 12px;
}

.user-button {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
}

#window-title span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.window-controls {
  display: flex;
  width: 130px;
  margin-left: 10px;
  justify-content: flex-end;
}

.window-controls .button {
  display: flex;
  justify-content: space-around;
  align-items: center;
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

.close-button:hover,
#exit-button:hover {
  background: #e81123 !important;
}

.close-button:active,
#exit-button:hover {
  background: #f1707a !important;
}

.close-button:active .icon {
  filter: invert(1);
}

#exit-button:active .icon {
  filter: invert(1);
}

.close-button {
  width: 50px !important;
}

.el-select {
  margin-left: 15px;
  width: 100px !important;
  -webkit-app-region: no-drag;
}
.els ::v-deep .el-select__wrapper {
  border-radius: 4px;
  margin: 2px 0;
  min-height: 0px !important;
}
</style>
