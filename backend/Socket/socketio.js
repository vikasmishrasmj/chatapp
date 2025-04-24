// ✅ Importing the Server class from socket.io and renaming it to avoid conflict with http.Server
import { Server as SocketIOServer } from "socket.io";

// ✅ Importing http module to create a server and express for handling routes
import http from 'http';
import express from 'express';

// ✅ Creating an express application
const app = express();

// ✅ Creating an HTTP server from the express app
const server = http.createServer(app);

// ✅ Creating a new instance of Socket.IO server and attaching it to the HTTP server
const io = new SocketIOServer(server, {
    cors: {
        origin: ['http://localhost:5173'], // ✅ Allowing frontend (React) from this origin to connect via socket
        methods: ["GET", "POST"]           // ✅ Allowing only GET and POST methods for CORS
    }
});

// ✅ This object will store which user is connected with which socketId
const userSocketmap = {};  // Format: { userId: socketId }

// ✅ This function returns the socket ID of the receiver (used for sending message to correct user)
export const getRecieverSocketId = (recieverId) => {
    return userSocketmap[recieverId];
};

// ✅ Whenever a new client connects to socket.io, this function is triggered
io.on('connection', (socket) => {
    // ✅ Getting userId from the socket handshake query (sent from frontend at connection time)
    const userId = socket.handshake.query.userId;

    // ✅ If userId is valid (not undefined), map it to the current socket.id
    if (userId !== "undefined") {
        userSocketmap[userId] = socket.id;
    }

    // ✅ Send the updated list of online users to all clients
    io.emit("getOnlineUsers", Object.keys(userSocketmap));

    // ✅ When a user disconnects (closes tab or internet lost), this runs
    socket.on('disconnect', () => {
        // ✅ Remove the user from the map
        delete userSocketmap[userId];

        // ✅ Again, send the updated list of online users
        io.emit("getOnlineUsers", Object.keys(userSocketmap));
    });
});

// ✅ Exporting the express app, socket.io instance, and server for use in other files
export { app, io, server };
