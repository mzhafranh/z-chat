import { NextApiRequest, NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { Socket } from "socket.io";

interface ExtendedServer extends HTTPServer {
    io?: SocketIOServer;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!res.socket.server.io) {
        const httpServer = res.socket.server as ExtendedServer;
        const io = new SocketIOServer(httpServer, {
            path: "/api/socket",
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
        });

        io.on("connection", (socket: Socket) => {
            console.log("Client connected:", socket.id);

            socket.on("message", (msg: string) => {
                console.log("Message received:", msg);
                socket.broadcast.emit("message", msg);
            });

            socket.on("disconnect", () => {
                console.log("Client disconnected:", socket.id);
            });
        });

        res.socket.server.io = io;
        console.log("Socket.IO server started");
    } else {
        console.log("Socket.IO server already running");
    }

    res.end();
}
