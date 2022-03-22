import http from "http"
import WebSocket from "ws"
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
const server = http.createServer(app);
const wss = new WebSocket.Server({server});

const sockets = []

wss.on("connection", (socket) => {
  sockets.push(socket)
  console.log("Connected to Browser ✅")
  socket.on("close", () => console.log("Disconnected from Browser ❌"))
  socket.on("message", (message) => {
    sockets.forEach(aSocket => aSocket.send(message.toString('utf8')))
  })
})

server.listen(port, handleListen);