import { ipcMain } from 'electron'
import SocketClient from '../utils/socket-client'

export function initializeSocketClient(
  host: string,
  port: number,
  mainWindow: Electron.BrowserWindow
) {
  const socketClient = new SocketClient(host, port)

  socketClient.client.on('data', (message) => {
    // 通过 IPC 发送消息到渲染进程
    mainWindow.webContents.send('socket-message', String(message))
  })

  return socketClient
}

export function setupIpcHandlers(socketClient: SocketClient) {
  ipcMain.on('send-message', (event, message) => {
    if (socketClient) {
      socketClient.send(message)
    } else {
      console.error('Socket client is not connected')
    }
  })
}
