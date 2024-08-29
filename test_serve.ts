const net = require('net')

// 创建一个服务器实例

let mysocket: any
let myresolve: (value: unknown) => void
const server = net.createServer(async (socket) => {
  console.log('Client connected.')
  mysocket = socket
  const messages = [
    'Message 1',
    'Message 2',
    'Message 3',
    'Message 4',
    'Message 5',
    'Message 6',
    'Message 7'
  ]
  for (const m in messages) {
    await new Promise((resolve, reject) => {
      myresolve = resolve
      console.log(messages[m])
      socket.write(messages[m])
    })
  }
})

function listen() {
  mysocket.on('data', (data) => {
    myresolve(1)
    console.log(`data=>${data}`)
  })
}

// 启动服务器
server.listen(3333, () => {
  console.log('Server listening on port 3333')
  setTimeout(() => {
    listen()
  }, 5000)
})
