import net from 'net'
import EventEmitter from 'events'

class SocketClient extends EventEmitter {
  host: any
  port: any
  client: net.Socket
  constructor(host, port) {
    super()
    this.host = host
    this.port = port
    this.client = net.connect(port, host)
    this.client.on('data', (data) => {
      this.emit('message', data.toString())
    })
  }

  send(message) {
    this.client.write(message)
  }

  disconnect() {
    this.client.end()
  }
}

export default SocketClient
