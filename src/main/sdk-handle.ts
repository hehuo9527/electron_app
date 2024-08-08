import { ChildProcess, exec } from 'child_process'
import * as path from 'path'
import * as fs from 'fs'
import { BrowserWindow } from 'electron'
export function startSDK(mainWindow: BrowserWindow): ChildProcess | null {
  let cppProcess: ChildProcess | null = null
  const rootPath = path.resolve(process.cwd(), '../../')

  try {
    console.log('rootPath', rootPath)
    //     fs.writeFile('1111111111.txt',  path.join(rootPath,  '\\CameraSDK_Release\\CameraSDK.exe'), 'utf8', (err) => {
    //       if (err) {
    //           console.error(err);
    //       } else {
    //           console.log('文件写入成功！');
    //       }
    //   });
    const sdkPath = path.join(rootPath, '\\CameraSDK_Release\\CameraSDK.exe')
    cppProcess = exec(sdkPath)
    mainWindow.webContents.send('log', 'start sdk success')
    return cppProcess
  } catch (error) {
    console.error('exec Failed', error)
    mainWindow.webContents.send('log', 'start sdk failed')
    return null
  }
}
