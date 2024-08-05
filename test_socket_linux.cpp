#include <iostream>
#include <string>
#include <thread>
#include <cstring>
#include <arpa/inet.h>
#include <sys/socket.h>
#include <unistd.h>

void handle_client(int client_socket) {
    const std::string welcome_message = "connect success";
    send(client_socket, welcome_message.c_str(), welcome_message.size(), 0);

    char buffer[1024];
    while (true) {
        memset(buffer, 0, sizeof(buffer));
        int bytes_received = recv(client_socket, buffer, sizeof(buffer) - 1, 0);
        if (bytes_received > 0) {
            std::string received_data(buffer);
            std::cout << "Received: " << received_data << std::endl;
            std::string send_msg = "{\"operation\":\"WhiteBalance\",\"value\":\"Cloudy\"}";
            send(client_socket, send_msg.c_str(), send_msg.size(), 0);
        }
        else {
            break;
        }
    }

    close(client_socket);
    std::cout << "Connection closed" << std::endl;
}

void start_server() {
    int server_socket = socket(AF_INET, SOCK_STREAM, 0);
    if (server_socket == -1) {
        std::cerr << "Failed to create socket" << std::endl;
        return;
    }

    sockaddr_in server_address;
    server_address.sin_family = AF_INET;
    server_address.sin_addr.s_addr = inet_addr("127.0.0.1");
    server_address.sin_port = htons(3333);

    if (bind(server_socket, (sockaddr*)&server_address, sizeof(server_address)) == -1) {
        std::cerr << "Failed to bind server on 127.0.0.1 port 3333" << std::endl;
        close(server_socket);
        return;
    }

    std::cout << "Server started on 127.0.0.1 port 3333" << std::endl;

    if (listen(server_socket, 5) == -1) {
        std::cerr << "Failed to listen on socket" << std::endl;
        close(server_socket);
        return;
    }

    std::cout << "Waiting for a connection..." << std::endl;

    while (true) {
        sockaddr_in client_address;
        socklen_t client_address_len = sizeof(client_address);
        int client_socket = accept(server_socket, (sockaddr*)&client_address, &client_address_len);
        if (client_socket == -1) {
            std::cerr << "Failed to accept connection" << std::endl;
            continue;
        }

        std::cout << "Connected to " << inet_ntoa(client_address.sin_addr) << std::endl;

        std::thread client_thread(handle_client, client_socket);
        client_thread.detach();
    }

    close(server_socket);
}

int main() {
    start_server();
    return 0;
}
