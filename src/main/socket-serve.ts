import { BrowserWindow } from 'electron'
import * as net from 'net'

export class SocketServer {
  port: number
  server: net.Server
  socket!: net.Socket

  constructor(port, mainWindow: BrowserWindow) {
    this.port = port
    this.server = net.createServer((socket) => {
      console.log('Client connected')
      socket.on('data', (data) => {
        console.log('Received:', data.toString())
        mainWindow.webContents.send('sdk:msg', `receive data from sdk ${data.toString()}`)
      })

      socket.on('end', () => {
        console.log('Client disconnected')
        mainWindow.webContents.send('log', `receive end from sdk `)
      })

      socket.on('error', (err) => {
        mainWindow.webContents.send('log', `receive error from sdk ${err.message}`)
      })

      this.socket = socket
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
