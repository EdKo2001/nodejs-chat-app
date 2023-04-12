"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLocationMessage = exports.generateMessage = void 0;
const generateMessage = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime(),
    };
};
exports.generateMessage = generateMessage;
const generateLocationMessage = (username, url) => {
    return {
        username,
        url,
        createdAt: new Date().getTime(),
    };
};
exports.generateLocationMessage = generateLocationMessage;
