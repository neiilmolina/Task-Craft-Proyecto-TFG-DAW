import { Server as SocketIOServer, Socket } from "socket.io";
// import { createWebSocketController } from "@/src/friends/controller/FriendsWebSocketController";

const setupWebSocket = (io: SocketIOServer) => {
  io.on("connection", (socket: Socket) => {
    console.log(`🔌 Cliente conectado: ${socket.id}`);

    // createWebSocketController(io, socket); // tu lógica de friends
  });
};

export default setupWebSocket;
