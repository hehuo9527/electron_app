<script setup lang="ts">
import { ref } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { LoginInfo, LoginResp, UserInfo } from '@src/types/userTypes'
import { ElMessage } from 'element-plus'
import { auth } from '../services/auth.service'
import { error } from 'console'
import { AuthService } from '../utils/authService'
import emitter from '@src/utils/emitter'
import router from '@renderer/router/router'
import { useI18n } from 'vue-i18n'
import { promises } from 'dns'
import { ipcRenderer } from 'electron'
import axios from 'axios'

const { t } = useI18n()
const loginRes = ref(false)
const loginForm = ref<LoginInfo>({ username: 'test_user', password: 'test_password' })
const loginHint = ref('Login Success !')
function checkEmpty(): boolean {
  return loginForm.value.username != '' && loginForm.value.password != ''
}
function check(): boolean {
  if (!checkEmpty()) {
    ElMessage.error('Username and Password cannot be empty!')
    return false
  }
  return true
}

async function getAllCameraValue() {
  try {
    // 发送七个同步 IPC 消息到主进程
    const responses: any = []
    for (let i = 0; i < 4; i++) {
      const response = ipcRenderer.sendSync('pc:msg', `Message ${i + 1}`)
      console.log('ev', response)
      responses.push(response)
    }
    console.log('resp', responses)
    const resp = await axios.post('https://jsonplaceholder.typicode.com/posts', {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    })
    console.log(resp.status) // Access data from the response
  } catch (error) {
    console.log(error)
  }
}
async function login(loginForm: LoginInfo) {
  getAllCameraValue()
  // if (!check()) {
  // }
  // try {
  //   const loginResp: LoginResp = await auth(loginForm)
  //   const userInfo: UserInfo = {
  //     username: loginForm.username,
  //     token: loginResp.data.token
  //   }
  //   const aService = new AuthService()
  //   aService.save(userInfo)
  //   emitter.emit('login-event')
  //   router.push('/Camera')
  // } catch (error) {
  //   loginRes.value = true
  //   loginHint.value = 'Login Failed'
  // }
}
</script>

<template>
  <div class="login-panel">
    <div class="login-panel-left">
      <img src="../../assets/bk.png" alt="bk" class="bk-img" />
    </div>
    <div class="login-panel-right">
      <img src="../../assets/login.png" alt="login" width="30%" />
      <h4>{{ $t('欢迎') }}</h4>
      <el-form ref="form" :model="loginForm" label-width="auto">
        <el-form-item>
          <el-input
            v-model="loginForm.username"
            placeholder="username"
            :prefix-icon="User"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="loginForm.password"
            placeholder="password"
            type="password"
            :prefix-icon="Lock"
            show-password
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="login(loginForm)" plain>{{ t('登录系统') }}</el-button>
      <span v-if="loginRes" class="hint">{{ loginHint }}</span>
    </div>
  </div>
</template>

<style scoped>
.login-panel {
  height: 100vh;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
}

.login-panel-left {
  width: 55%;
  height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #db969641;
}

.login-panel-left img {
  position: relative;
  top: 50%;
  left: 50%;
  width: 100%;
  transform: translate(-50%, -50%);
}

.login-panel-right {
  padding: 5%;
  flex-direction: column;
  flex: 1;
  height: 100%;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 1.9em;
  font-family:
    Microsoft Yahei,
    Arial;
}

.login-panel-right img {
  margin-bottom: 30px;
  width: 366px;
}

.el-input {
  height: 3em;
}
.hint {
  color: rgb(255, 127, 212);
  font-size: large;
  margin-left: 20px;
}
</style>
