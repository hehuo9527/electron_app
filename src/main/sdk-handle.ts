import { exec, execSync } from 'child_process'

export function startSDK() {
  try {
    // TODO 这里Path应该读环境变量
    const sdkProcess = exec('C:\\Users\\7000031561\\Desktop\\CameraSDK_Release\\CameraSDK.exe')
    console.log(sdkProcess)
  } catch (error) {
    console.error('Error executing file:', error)
  }
}
