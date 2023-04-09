import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";

import cors from "cors";
import compression from "compression";
import dotenv from "dotenv";

import { connectDB } from "./src/config";

import { accessLogger, errorLogger } from "./src/utils";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

dotenv.config();
connectDB();

app.use(express.json());
app.use(cors());
app.use(compression());
app.use(accessLogger);

io.on("connection", (socket: Socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
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
