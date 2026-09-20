import io from "socket.io-client";

export const createSocketConnection = () => {
    const socketUrl = location.hostname === "localhost" ? "http://localhost:7777" : "/";
    return io(socketUrl, {
        withCredentials: true,
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
    });
};