import {Server} from "socket.io";
import express from 'express';
import http from 'http';

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors:{
        origin:['http://localhost:3000', 'http://localhost:5173'],
        methods: ['GET', 'POST']
    }
});

const userSocketMap = {}; // this map store socket id corresponding the user id; userId -> socketId

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if
})
