import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {

    if (!process.env.NEXT_PUBLIC_SOCKET_URL){
        throw new Error("SOCKET_URL is not defined in the environment variables");
    } else if (!socket) {
        socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);
    }
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};