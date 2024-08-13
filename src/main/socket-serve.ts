import { BrowserWindow } from 'electron'
import * as net from 'net'
import { responseEmitter } from '.'

export class SocketServer {
  port: number
  server: net.Server
  socket!: net.Socket

  constructor(port, mainWindow: BrowserWindow) {
    this.port = port
    let responses: any = []
    let currentRequestId: number

    this.server = net.createServer((socket) => {
      this.socket = socket
      console.log('Client connected')
      socket.on('data', (data) => {
        console.log('Received:', data.toString())
        // responses.push(data.toString())
        responseEmitter.emit('response', data.toString(), currentRequestId)
        // responses = []

        mainWindow.webContents.send('sdk:msg', `${data.toString()}`)
      })
      socket.on('end', () => {
        console.log('Client disconnected')
        mainWindow.webContents.send('log', `receive end from sdk `)
      })

      socket.on('error', (err) => {
        mainWindow.webContents.send('log', `receive error from sdk ${err.message}`)
      })
    })
    responseEmitter.on('send-to-server', (message: string, id: number) => {
      // 记录当前的请求 ID
      currentRequestId = id

      if (this.socket && !this.socket.destroyed) {
        // 发送消息到 TCP 服务器
        this.socket.write(message)
      } else {
        console.error('Socket is not connected')
      }
    })
  }

  start() {
    this.server.listen(this.port, () => {
      console.log(`TCP server listening on port ${this.port}`)
    })
  }

  stop() {
    this.server.close(() => {
      console.log('TCP server stopped')
    })
  }
}
