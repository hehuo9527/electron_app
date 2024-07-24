import { BrowserWindow } from 'electron'
import { WebSocket } from 'ws'

function sendWebContents(msg: string, cata: string) {
  if (msg != '') {
    const windows = BrowserWindow.getAllWindows()
    windows.forEach((window) => {
      if (window && window.webContents) {
        window.webContents.send(cata, msg)
      }
    })
  }
}

export async function wsSend(_event: any, args: string[]) {
  try {
    // const WebSocket = require('ws')
    const socket = new WebSocket(`ws://${args[1]}`)
    socket.on('open', () => {
      socket.send(args[2])
    })
    socket.on('message', (message) => {
      const msg = message.toString()
      if (msg == 'over') {
        socket.close()
        sendWebContents(msg, args[0])
      }
    })
  } catch (error) {
    sendWebContents((error as Error).message, args[0])
  }
}
