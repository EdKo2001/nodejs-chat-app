"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersInRoom = exports.getUser = exports.removeUser = exports.addUser = void 0;
const users = [];
const addUser = ({ id, username, room }) => {
    // Clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();
    // Validate the data
    if (!username || !room) {
        return {
            error: "Username and room are required!",
        };
    }
    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username;
    });
    // Validate username
    if (existingUser) {
        return {
            error: "Username is in use!",
        };
    }
    // Store user
    const user = { id, username, room };
    users.push(user);
    return { user };
};
exports.addUser = addUser;
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};
exports.removeUser = removeUser;
const getUser = (id) => {
    return users.find((user) => user.id === id);
};
exports.getUser = getUser;
const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase();
    return users.filter((user) => user.room === room);
};
exports.getUsersInRoom = getUsersInRoom;
