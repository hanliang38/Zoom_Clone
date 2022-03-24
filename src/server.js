import http from "http"
// import WebSocket from "ws"
import SocketIO from "socket.io"
import express from "express";

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
const httpServer = http.createServer(app)
const wsServer = SocketIO(httpServer)

wsServer.on("connection", (socket) => {
  socket.onAny((e) => {
    console.log(`Sockent Event:${e}`)
  })
  socket.on("enter_room",(roomName, done)=>{
    socket.join(roomName)
    done()
    socket.to(roomName).emit("welcome")
  })
  socket.on("disconnecting", () => {
    socket.rooms.forEach(room => socket.to(room).emit("bye"))
  })
  socket.on("new_message",(msg, room, done) => {
    socket.to(room).emit("new_message", msg)
    done()
  })
})

httpServer.listen(port, handleListen);