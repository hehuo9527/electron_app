<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ipcRenderer } from 'electron'
import { ElMessage } from 'element-plus'
import emitter from '@src/utils/emitter'
import { LoginInfo, LoginResp, UserInfo } from '@src/types/userTypes'
import { AuthService } from '@src//utils/authService'
import { useI18n } from 'vue-i18n'
import { auth } from '../services/auth.service'
import { error } from 'console'

const labelPosition = ref('top')
const router = useRouter()
const { t } = useI18n()
const formLabelAlign = reactive<LoginInfo>({
  username: 'test_user',
  password: 'test_password'
})

ipcRenderer.on('login', (_event, result) => {
  ElMessage.success(result)
  emitter.emit('login-event', 'test')
})

function checkEmpty(): boolean {
  return formLabelAlign.username != '' && formLabelAlign.password != ''
}

function check(): boolean {
  if (!checkEmpty()) {
    ElMessage.error('Username and Password cannot be empty!')
    return false
  }
  return true
}

async function login() {
  if (check()) {
    const loginResp: LoginResp = await auth(formLabelAlign)
    if (loginResp.message != 'OK') {
      throw error('Login failed')
    }
    const userInfo: UserInfo = {
      username: formLabelAlign.username,
      token: loginResp.data.token
    }
    const aService = new AuthService()
    aService.save(userInfo)
    emitter.emit('login-event')
    router.push('/Camera')
  }
}

const onSubmit = async () => {
  await login()
}
</script>
<template>
  <el-card class="login-card" shadow="hover">
    <el-row :gutter="20">
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
              <el-input v-model="formLabelAlign.username" />
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
  margin-top: 10%;
}

.login-card {
  width: 99%;
  height: 630px;
  /* margin:5px; */
  background-color: rgb(253, 242, 235) !important;
}

.login-form {
  background-color: rgb(252, 255, 250) !important;
  border-bottom: 2px solid rgb(247, 220, 228) !important;
  margin: 130px 0 0 0;
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

b {
  font-weight: bold !important;
}
</style>
