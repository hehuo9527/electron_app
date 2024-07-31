import socket

def start_server():
    # 创建一个 TCP/IP 套接字
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    
    # 绑定套接字到地址和端口
    server_address = ('localhost', 8080)
    print(f'Starting server on {server_address[0]} port {server_address[1]}')
    server_socket.bind(server_address)
    
    # 监听传入的连接
    server_socket.listen(5)
    
    while True:
        # 等待连接
        print('Waiting for a connection...')
        connection, client_address = server_socket.accept()
        
        try:
            print(f'Connection from {client_address}')
            
            # 接收数据并回显
            while True:
                data = connection.recv(1024)
                if data:
                    print(f'Received: {data.decode()}')
                    connection.sendall(data)
                else:
                    break
                
        finally:
            # 清理连接
            connection.close()

if __name__ == '__main__':
    start_server()
