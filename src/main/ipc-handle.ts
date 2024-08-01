import { ipcMain } from 'electron'
import SocketClient from '../utils/socket-client'

export function initializeSocketClient(
  host: string,
  port: number,
  mainWindow: Electron.BrowserWindow
) {
  const socketClient = new SocketClient(host, port)
  console.log("host",host,"port",port)
  // socketClient
  //   .connect()
  //   .then(() => {
  //     console.log('Connected to server')

  //     socketClient.on('message', (message) => {
  //       console.log('Received message:', message)
  //       // 通过 IPC 发送消息到渲染进程
  //       mainWindow.webContents.send('socket-message', message)
  //     })

  //     socketClient.on('error', (err) => {
  //       console.error('Socket error:', err)
  //     })

  //     socketClient.on('close', () => {
  //       console.log('Socket connection closed')
  //     })
  //   })
  //   .catch((err) => {
  //     console.error('Connection error:', err)
  //   })

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
