const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: true, // Allow your Next.js app to connect
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // socket.on("message", (data) => {
    //     console.log("Message received:", data);
    //     io.emit("message", data); // Broadcast the message to all clients
    // });

    socket.onAny((eventName, data) => {
        console.log("Message received:", data);
        io.emit(eventName, data);
    })

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

const PORT = 3001; // Port for Socket.IO server
server.listen(PORT, () => {
    console.log(`Socket.IO server is running on port ${PORT}`);
});
