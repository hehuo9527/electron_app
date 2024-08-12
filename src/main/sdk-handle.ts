import { ChildProcess, exec } from 'child_process'
import * as path from 'path'
import * as fs from 'fs'
import { BrowserWindow } from 'electron'
import * as os from 'os'

export function startSDK(mainWindow: BrowserWindow): ChildProcess | null {
  let cppProcess: ChildProcess | null = null
  const rootPath = path.resolve(process.cwd(), '../../')

  try {
    const sdkPath = path.join(rootPath, '\\CameraSDK_Release\\CameraSDK.exe')
    console.log(sdkPath)
    cppProcess = exec(sdkPath)
    mainWindow.webContents.send(`log', 'start sdk success workDir ${rootPath}`)
    return cppProcess
  } catch (error) {
    console.error('exec Failed', error)
    mainWindow.webContents.send('log', 'start sdk failed')
    return null
  }
}

function terminateProcessByName(name) {
  let findCommand
  let killCommand

  if (os.platform() === 'win32') {
    findCommand = `tasklist | findstr /i ${name}`
    killCommand = `taskkill /IM ${name} /F`
  } else {
    findCommand = `ps aux | grep ${name} | grep -v grep | awk '{print $2}'`
    killCommand = `pkill -f ${name}`
  }

  // 查找进程
  exec(findCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`)
      return
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`)
      return
    }

    const pids = stdout.trim().split('\n')
    pids.forEach((pid) => {
      if (pid) {
        console.log(`Terminating PID: ${pid}`)
        exec(`kill -9 ${pid}`, (error) => {
          if (error) {
            console.error(`Failed to terminate PID ${pid}: ${error}`)
          } else {
            console.log(`Successfully terminated PID ${pid}`)
          }
        })
      }
    })
  })
}
