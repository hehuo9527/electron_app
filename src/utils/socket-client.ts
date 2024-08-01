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

    this.client.on('error', (err) => {
      this.emit('error', err)
    })

    this.client.on('close', () => {
      this.emit('close')
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
