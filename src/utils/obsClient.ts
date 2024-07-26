import OBSWebSocket, { EventSubscription } from 'obs-websocket-js'
const obs = new OBSWebSocket()

// connect to obs-websocket running on localhost with same port
await obs.connect()

// Connect to obs-ws running on 192.168.0.4
await obs.connect('ws://192.168.0.4:4455')

// Connect to localhost with password
await obs.connect('ws://127.0.0.1:4455', 'super-sekret')

// Connect expecting RPC version 1
await obs.connect('ws://127.0.0.1:4455', undefined, { rpcVersion: 1 })

// Connect with request for high-volume event
await obs.connect('ws://127.0.0.1:4455', undefined, {
  eventSubscriptions: EventSubscription.All | EventSubscription.InputVolumeMeters,
  rpcVersion: 1
})

// A complete example
try {
  const { obsWebSocketVersion, negotiatedRpcVersion } = await obs.connect(
    'ws://192.168.0.4:4455',
    'password',
    {
      rpcVersion: 1
    }
  )
  console.log(`Connected to server ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`)
} catch (error) {
  console.error('Failed to connect', error)
}
