import { v4 as uuidv4 } from 'uuid'
import mqtt from 'mqtt'
import type { MqttClient } from 'mqtt'

// let pMQTT: MQTT

// export function initMQTT(username: string) {
//   pMQTT = new MQTT(username)
//   pMQTT.createConnection()
//   pMQTT.topicSubscribe()
// }

// export function releaseMQTT() {
//   pMQTT.destroyConnection()
// }

export class MQTT {
  url: string
  client!: MqttClient
  clientId: string
  topic: string
  isConnect: boolean

  constructor(username: string) {
    this.url = `wss://${import.meta.env.VITE_MQTT_URL}/mqtt`
    this.clientId = `${username}-${uuidv4()}`
    this.topic = `${username}/${btoa(username)}`
    this.isConnect = false
  }

  async createConnection() {
    const options = {
      clean: true,
      clientId: this.clientId,
      connectTimeout: 4000
    }

    this.client = mqtt.connect(this.url, options)
    this.client.on('connect', () => {
      console.log('Connect Success')
      this.isConnect = true
    })

    this.client.on('error', (error: any) => {
      console.log(error)
    })

    this.client.on('reconnect', () => {
      console.log('Reconnecting...')
    })

    // this.client.on('message', (topic, message) => {
    //   console.log(`Received message ${message} from topic ${topic}`)
    // })
  }

  topicSubscribe() {
    console.log('topic', this.topic)
    this.client.subscribe(this.topic, (error, res) => {
      if (error) {
        console.log('Subscribe to topics error', error)
        return
      }
      console.log('Subscribe to topics res', res)
    })
  }

  topicUnsubscribes() {
    this.client.unsubscribe(this.topic, (error) => {
      if (error) {
        console.log('Unsubscribe error:', error)
        return
      }
      console.log(`Unsubscribed topic: ${this.topic}`)
    })
  }

  destroyConnection() {
    if (this.client.connected) {
      try {
        this.client.end()
        console.log('Successfully disconnected!')
        this.isConnect = false
      } catch (error: any) {
        console.log('Disconnect failed', error.toString())
      }
    }
  }
}
