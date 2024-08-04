import socket

def start_server():
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    host = '127.0.0.1'
    port = 3333
    server_address = (host, port)

    try:
        server_socket.bind(server_address)
        print(f"Server started on {host} port {port}")
    except Exception as e:
        print(f"Failed to bind server on {host} port {port}. Error: {e}")
        return

    server_socket.listen(5)

    print("Waiting for a connection...")

    while True:
        connection, address = server_socket.accept()
        print(f"Connected to {address}")
        connection.sendall("connect success".encode('utf-8'))
        try:
            while True:
                data = connection.recv(1024).decode('utf-8')
                if data:
                    print(f"Received: {data}")
                    data+=" love from serve"
                    connection.sendall(data.encode('utf-8'))
                else:
                    break
        except Exception as e:
            print(f"Connection error: {e}")
        finally:
            connection.close()
            print(f"Connection to {address} closed")

if __name__ == "__main__":
    # start_server()
    s=socket.socket()
    s.connect(("127.0.0.1",3333))
    s.send('能发送消息吗'.encode('utf-8'))
    ret_bytes=s.recv(2048)
    print(str(ret_bytes))
    import time
    time.sleep(3)
    data = b''
    while True:
        part = s.recv(10024)
        data += part
        if len(part) < 10024:
            # This means that there is no more data left to receive
            break
    print(data.decode('utf-8'))



