import io from "socket.io-client";

export const createSocketConnection = () => {
    const socketUrl = location.hostname === "localhost" ? "http://localhost:7777" : "/";
    return io(socketUrl, {
        withCredentials: true,
    });
};