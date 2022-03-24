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

function publicRooms(){
  const {sockets: {
    adapter: {sids, rooms},
  },
} = wsServer
const publicRooms = []
rooms.forEach((_,key) => {
  if(sids.get(key)===undefined){
    publicRooms.push(key)
  }
})
return publicRooms
}

function countRoom(roomName){
  return wsServer.sockets.adapter.rooms.get(roomName)?.size
}

wsServer.on("connection", (socket) => {
  socket["nickname"] = "Anon"
  socket.onAny((e) => {
    console.log(`Sockent Event:${e}`)
  })
  socket.on("enter_room",(roomName, done)=>{
    socket.join(roomName)
    done()
    socket.to(roomName).emit("welcome",socket.nickname, countRoom(roomName))
    wsServer.sockets.emit("room_change", publicRooms())
  })
  socket.on("disconnecting", () => {
    socket.rooms.forEach(room => 
      socket.to(room).emit("bye",socket.nickname, countRoom(room) - 1)
      )
  })
  socket.on("disconnect", () => {
    wsServer.sockets.emit("room_change", publicRooms())
  })
  socket.on("new_message",(msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`)
    done()
  })
  socket.on("nickname",nickname => socket["nickname"] = nickname)
})

httpServer.listen(port, handleListen);