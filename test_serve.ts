const net = require('net')

// 创建一个服务器实例
const server = net.createServer((socket) => {
  console.log('Client connected.')

  // 发送七个消息并处理响应
  const sendMessages = async () => {
    const messages = [
      'Message 1',
      'Message 2',
      'Message 3',
      'Message 4',
      'Message 5',
      'Message 6',
      'Message 7'
    ]

    let responses: string[] = []

    // 发送消息并等待响应
    const sendMessageAndWaitForResponse = (message: string) => {
      return new Promise<string>((resolve, reject) => {
        const onData = (data: Buffer) => {
          socket.removeListener('data', onData)
          resolve(data.toString())
        }

        socket.on('data', onData)

        socket.write(message, (err) => {
          if (err) {
            socket.removeListener('data', onData)
            reject(err)
          } else {
            console.log('Message sent:', message)
          }
        })
      })
    }

    try {
      for (const message of messages) {
        const response = await sendMessageAndWaitForResponse(message)
        responses.push(response)
      }

      // 打印所有消息的响应
      console.log('All messages received:', responses)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      socket.end() // 结束连接
    }
  }

  // 调用发送消息的函数
  sendMessages()
})

// 启动服务器
server.listen(1234, () => {
  console.log('Server listening on port 1234')
})
