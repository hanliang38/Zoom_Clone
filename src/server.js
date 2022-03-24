import http from "http"
// import WebSocket from "ws"
import SocketIO from "socket.io"
import express from "express";
import { doesNotMatch } from "assert";

const app = express();
const port = 3000;

app.set("view engine", "pug")
app.set("views", __dirname + "/views")
app.use("/public", express.static(__dirname + "/public"))
app.get("/", (_,res) => res.render("home"))
app.get("/*", (_,res) => res.render("/"))

const handleListen = () => console.log(`Listening on http://localhost:${port}`)
// app.listen(port, handleListen);

// http 서버 위에 webSocket 서버를 만을 수 있도록 함 (http 서버에 access)
const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer)

wsServer.on("connection", (socket) => {
  socket.on("enter_room",(msg,done)=>{
    console.log(msg)
    setTimeout(() =>{
      done()
    }, 10000)
  })
})

// const wss = new WebSocket.Server({server});

// const sockets = []
// wss.on("connection", (socket) => {
//   sockets.push(socket)
//   socket["nickname"] = "Anon"
//   console.log("Connected to Browser ✅")
//   socket.on("close", () => console.log("Disconnected from Browser ❌"))
//   socket.on("message", (msg) => {
//     const message = JSON.parse(msg)
//     // if else 대신에 switch
//     switch (message.type) {
//       case "new_message":
//         sockets.forEach(aSocket => aSocket.send(`${socket.nickname}:${message.payload}`))
//       case "nickname":
//         socket["nickname"] = message.payload
//     }
//   })
// })

httpServer.listen(port, handleListen);