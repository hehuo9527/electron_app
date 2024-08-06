import { ChildProcess, exec, execFile, execSync } from 'child_process'
import * as path from 'path'

export function startSDK() {
  let cppProcess: ChildProcess | null = null
  const root_path = path.resolve(__dirname, '../../')
  try {
    cppProcess = exec(path.join(root_path, 'CameraSDK_Release/CameraSDK.exe'))
  } catch (error) {
    console.error('Error executing file:', error)
  }
  return cppProcess
}
