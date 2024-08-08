import { BrowserWindow } from 'electron'
import * as net from 'net'

export class SocketServer {
  port: number
  server: net.Server
  socket!: net.Socket

  constructor(port, mainWindow: BrowserWindow) {
    this.port = port
    this.server = net.createServer((socket) => {
      this.socket = socket
      console.log('Client connected')
      socket.on('data', (data) => {
        console.log('Received:', data.toString())
        // console.log(mainWindow.webContents)

        // console.log("11111111")
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
