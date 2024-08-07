import * as net from "net";

let s_client = net.connect(3333, "127.0.0.1");
// s_client.on("data", (data) => {
//   console.log("client receive data->", String(data));
// });
s_client.write("love from client");
// setTimeout(() => {
// }, 3000);
