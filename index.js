const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });
const connectdb = require("./connectdb");
const http = require("http");
const { Server } = require("socket.io");
//POR
PORT = process.env.PORT || 8000;

//create the exppress app
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: "http://localhost:3000/",
});

const router = express.Router();

//connect the data base
connectdb();
mongoose.connect(process.env.CONNECT_DB_STR, { useNewUrlParser: true });
//socket middleware

//socket
io.on("connection", (socket) => {
  console.log("a user connected" + socket.id);
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      username: socket.username,
    });
  }
  // console.log(users);
  socket.emit("users", users);
  // socket.to(socket.id).emit("users", users);
  socket.broadcast.emit("user connected", {
    userID: socket.id,
    username: socket.username,
  });

  socket.on("private message", async ({ content, to }) => {
    socket.join(to);
    console.log(content);
    console.log(to);
    console.log(socket.rooms);
    socket.to(to).emit("recieve message", {
      from: socket.id,
      content,
    });
  });
});

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  next();
});

app.get("/", (req, res) => {
  res.json({ token: "please login..." });
});

app.post("/", (req, res) => {
  res.send("<h1> Lets Begin the War...! </h1");
});

//midlle ware example
// app.use("/user/:id", function (req, res, next) {
//   console.log("Request Type:", req.method);
//   next();
// });
// //middle ware example
// app.get("/user/:id", function (req, res, next) {
//   res.send("USER");
// });

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/auth", require("./routes/auth"));
app.use("/dashboard", require("./routes/dashboard"));

server.listen(PORT, () => {
  console.log("Server is running..!");
});
