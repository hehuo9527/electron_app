import * as net from "net";
import { mylog } from ".";

export async function initServe() {
  return new Promise((resolve, reject) => {
    const server = net.createServer((connection) => {
      connection.on("data", (data) => {
        console.log("node js receive data", String(data));
        // mylog(String(data));
      });

      // 监听客户端断开连接
      connection.on("end", () => {
        console.log("Client disconnected");
        // 可选：使用 mylog 记录日志
        // mylog("Client disconnected");
      });

      connection.on("close", () => {
        console.log("Client connection closed");
        // 可选：使用 mylog 记录日志
        // mylog("Client connection closed");
      });
    });
    
    server.on("error", (err) => {
      console.error("Server error:", err);
      reject({ status: "error", error: err });
    });

    server.listen(3333, () => {
      console.log("Server is listening on port 3333");
      resolve({ status: "success", server });
    });
  });
}
