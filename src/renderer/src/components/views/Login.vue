<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ipcRenderer } from 'electron'
import { ElMessage } from 'element-plus'
import emitter from '@src/utils/emitter'
import { loginInfo, userInfo } from '@src/types/userTypes'
import { SendCommandToCameraService } from '../services/send-command-to-camera.service'
import { authService } from '@src//utils/authService'
import { useI18n } from 'vue-i18n'

function testws() {
  const commandToCameraService = new SendCommandToCameraService()
  commandToCameraService.SendCommandToCamera('test')
}

const labelPosition = ref('top')
const router = useRouter()
const { t } = useI18n()
const formLabelAlign = reactive<loginInfo>({
  userName: '',
  password: ''
})

ipcRenderer.on('login', (_event, result) => {
  ElMessage.success(result)
  emitter.emit('login-event', 'test')
  router.push('/Camera')
})

// function checkEmpty(): boolean {
//   return formLabelAlign.userName!='' && formLabelAlign.password!=''
// }

// function check():boolean {
//   if(!checkEmpty()){
//     ElMessage.error('Username and Password cannot be empty!')
//     return false;
//   }
//   return true;
// }

async function login() {
  //if(check()){
  // const response=await auth(formLabelAlign)
  // console.log(response)
  const aService = new authService()
  const user: userInfo = {
    userName: 'hello',
    token: 'world'
  }
  aService.save(user)
  emitter.emit('login-event', 'test')
  router.push('amera')
  //}
}

const onSubmit = async () => {
  await login()
}
</script>
<template>
  <el-card class="login-card" shadow="hover">
    <el-row :gutter="20">
      <div class="grid-content" />
      <el-col :span="12" class="img-box">
        <img src="../../assets/login.png" style="max-width: 200px" />
      </el-col>
      <el-col :span="12">
        <el-card shadow="never" class="login-form">
          <el-row style="margin-bottom: 10px">
            <el-col>
              <span class="login-title">{{ t('logIn') }}</span>
            </el-col>
          </el-row>
          <el-form
            :label-position="labelPosition"
            label-width="100px"
            :model="formLabelAlign"
            style="max-width: 460px"
          >
            <el-form-item :label="t('userName')" class="input-label">
              <el-input v-model="formLabelAlign.userName" />
            </el-form-item>
            <el-form-item :label="t('password')" class="input-label">
              <el-input
                v-model="formLabelAlign.password"
                type="password"
                show-password
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="danger" @click="onSubmit">{{ t('loginIn') }}</el-button>
              <!-- <el-button @click="testws">test</el-button> -->
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<style>
.button-style {
  color: rgb(218, 11, 98) !important;
}

.img-box {
  display: flex !important;
  justify-content: center;
  align-items: center;
}

.login-card {
  width: 99%;
  /* margin:5px; */
  background-color: rgb(253, 242, 235) !important;
}

.login-form {
  background-color: rgb(252, 255, 250) !important;
  border-bottom: 2px solid rgb(247, 220, 228) !important;
}

.login-title {
  font-size: 18px;
  font-weight: bold;
  color: rgb(179, 125, 174) !important;
}

.el-form-item__label {
  color: rgb(214, 188, 211) !important;
}

.el-radio-group {
  margin-left: 5%;
}

.block {
  text-align: center;
  display: inline-block;
  width: 50%;
  height: 100%;
  box-sizing: border-box;
  vertical-align: top;
}

.path-input {
  margin-left: 7.5%;
  margin-right: 5px;
}

.el-row:last-child {
  margin-bottom: 10px;
}

.el-col {
  text-align: left;
  vertical-align: middle;
  border-radius: 4px;
  /* border: 1px solid grey; */
}

.grid-content {
  border-radius: 1px;
  min-height: 5px;
  justify-content: center;
}

b {
  font-weight: bold !important;
}
</style>
