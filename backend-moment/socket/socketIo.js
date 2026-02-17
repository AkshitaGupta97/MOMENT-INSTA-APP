// Import Socket.IO server
import { Server } from "socket.io";

// Import Express framework
import express from "express";

// Import HTTP module to create server
import http from "http";

// Create Express app instance
const app = express();

// Create HTTP server using Express app
// Socket.IO attaches to this HTTP server
const server = http.createServer(app);

// Create Socket.IO server and configure CORS
const io = new Server(server, {
    cors: {
        // Allow frontend apps running on these ports
        origin: ['http://localhost:3000', 'http://localhost:5173'],
        
        // Allowed request methods
        methods: ['GET', 'POST']
    }
});

// Object to store online users
// Structure: { userId : socketId }
const userSocketMap = {}; 
// Example:
// {
//   "user123": "socket_abc123",
//   "user456": "socket_xyz456"
// }

// Runs whenever a new client connects
io.on('connection', (socket) => {

    // Get userId sent from frontend while connecting
    // Example: io("server-url", { query: { userId } })
    const userId = socket.handshake.query.userId;

    // If userId exists, store mapping
    if (userId) {
        userSocketMap[userId] = socket.id;

        console.log(
            "from socketio connection",
            userId,
            socket.id
        );
    }

    // Send updated online users list to everyone
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    // Triggered when a user disconnects
    socket.on('disconnect', () => {

        // Remove user from online list
        if (userId) {
            delete userSocketMap[userId];

            console.log(
                "from socketio diconnect",
                userId,
                socket.id
            );
        }

        // Broadcast updated online users again
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

// Export app, server, and io
export { app, server, io };
