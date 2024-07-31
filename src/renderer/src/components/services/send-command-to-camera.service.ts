export default class WebSocketService {
  url = ''
  client: WebSocket
  messageListeners = []
  constructor(url) {
    this.url = url
    this.client = new WebSocket(`ws://${this.url}`)
  }

  async sendMessage(message) {
    const json_msg = JSON.stringify(message)
    if (!this.client || this.client.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not open. Cannot send message.')
      return
    }
    this.client.send(json_msg)
  }
}
