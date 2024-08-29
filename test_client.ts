import * as net from 'net'
const client = new net.Socket()

// 连接到服务器
client.connect(3333, '127.0.0.1', () => {
  console.log('Connected to server.')
})

// 监听从服务器接收到的数据
client.on('data', (data) => {
  console.log('Received from server:', data.toString())

  // 对每个消息加上后缀并返回
  if (data.toString().match('1')) {
    let data = { name: 'wb', status: 'ok', value: 'cloudy' }
    setTimeout(() => {
      client.write(JSON.stringify(data))
    }, 1000)
  }
  if (data.toString().match('2')) {
    let data = { name: 'ios', status: 'ok', value: '110' }
    setTimeout(() => {
      client.write(JSON.stringify(data))
    }, 1000)
  }
  if (data.toString().match('3')) {
    let data = { name: 'focus', status: 'ok', value: 'auto' }
    setTimeout(() => {
      client.write(JSON.stringify(data))
    }, 1000)
  }
  if (data.toString().match('4')) {
    let data = { name: 'flash', status: 'ok', value: 'true' }
    setTimeout(() => {
      client.write(JSON.stringify(data))
    }, 1000)
  }
  if (data.toString().match('5')) {
    let data = { name: '5', status: 'ok', value: 'true' }
    setTimeout(() => {
      client.write(JSON.stringify(data))
    }, 1000)
  }
  if (data.toString().match('6')) {
    let data = { name: '6', status: 'ok', value: 'true' }
    setTimeout(() => {
      client.write(JSON.stringify(data))
    }, 1000)
  }
  if (data.toString().match('7')) {
    let data = { name: '7', status: 'ok', value: 'true' }
    setTimeout(() => {
      client.write(JSON.stringify(data))
    }, 4000)
  }
})

// 监听连接关闭事件
client.on('close', () => {
  console.log('Connection closed.')
})
