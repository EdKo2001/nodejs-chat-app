import express from "express";
import http from "http";
import path from "path";
import { Server, Socket } from "socket.io";
import cors from "cors";
import compression from "compression";
import dotenv from "dotenv";
import Filter from "bad-words";

import { connectDB } from "./src/config";

import {
  accessLogger,
  addUser,
  errorLogger,
  generateLocationMessage,
  generateMessage,
  getUser,
  getUsersInRoom,
  removeUser,
} from "./src/utils";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

dotenv.config();
connectDB();

const publicDirectoryPath = path.join(__dirname, "./public");

app.use(express.static(publicDirectoryPath));

app.use(express.json());
app.use(cors());
app.use(compression());
app.use(accessLogger);

io.on("connection", (socket: Socket) => {
  console.log("New WebSocket connection");

  socket.on("join", (options, callback) => {
    const { error, user } = addUser({ id: socket.id, ...options });
    if (error) {
      return callback(error);
    } else {
      socket.join(user.room);

      socket.emit("message", generateMessage("Admin", "Welcome!"));
      socket.broadcast
        .to(user.room)
        .emit(
          "message",
          generateMessage("Admin", `${user.username} has joined!`)
        );
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });

      callback();
    }
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed!");
    } else {
      io.to(user.room).emit("message", generateMessage(user.username, message));
      callback();
    }
  });

  socket.on("sendLocation", (coords, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit(
      "locationMessage",
      generateLocationMessage(
        user.username,
        `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`
      )
    );
    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    console.log(user.username + " disconnected");

    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage("Admin", `${user.username} has left!`)
      );
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

app.use((req, res, next) => {
  res.status(404).json({
    message: "Not Found",
  });
});

// Error handling middleware
app.use(errorLogger);

const PORT = process.env.PORT || 8888;

server.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
