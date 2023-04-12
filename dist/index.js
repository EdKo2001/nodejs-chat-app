"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const socket_io_1 = require("socket.io");
const bad_words_1 = __importDefault(require("bad-words"));
const utils_1 = require("./src/utils");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
const publicDirectoryPath = path_1.default.join(__dirname, "./public");
app.use(express_1.default.static(publicDirectoryPath));
io.on("connection", (socket) => {
    console.log("New WebSocket connection");
    socket.on("join", (options, callback) => {
        const { error, user } = (0, utils_1.addUser)(Object.assign({ id: socket.id }, options));
        if (error) {
            return callback(error);
        }
        else {
            socket.join(user.room);
            io.to(user.room).emit("message", (0, utils_1.generateMessage)("Admin", "Welcome!"));
            socket.broadcast
                .to(user.room)
                .emit("message", (0, utils_1.generateMessage)("Admin", `${user.username} has joined!`));
            io.to(user.room).emit("roomData", {
                room: user.room,
                users: (0, utils_1.getUsersInRoom)(user.room),
            });
            io.to(user.room).emit("roomData", {
                room: user.room,
                users: (0, utils_1.getUsersInRoom)(user.room),
            });
            callback();
        }
    });
    socket.on("sendMessage", (message, callback) => {
        const user = (0, utils_1.getUser)(socket.id);
        const filter = new bad_words_1.default();
        if (filter.isProfane(message)) {
            return callback("Profanity is not allowed!");
        }
        else {
            io.to(user.room).emit("message", (0, utils_1.generateMessage)(user.username, message));
            callback();
        }
    });
    socket.on("sendLocation", (coords, callback) => {
        const user = (0, utils_1.getUser)(socket.id);
        io.to(user.room).emit("locationMessage", (0, utils_1.generateLocationMessage)(user.username, `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`));
        callback();
    });
    socket.on("disconnect", () => {
        const user = (0, utils_1.removeUser)(socket.id);
        console.log("user", user);
        console.log(user.username + " disconnected");
        if (user) {
            io.to(user.room).emit("message", (0, utils_1.generateMessage)("Admin", `${user.username} has left!`));
            io.to(user.room).emit("roomData", {
                room: user.room,
                users: (0, utils_1.getUsersInRoom)(user.room),
            });
        }
    });
});
const PORT = process.env.PORT || 8888;
server.listen(PORT, () => {
    console.log("Server is running on http://localhost:" + PORT);
});
