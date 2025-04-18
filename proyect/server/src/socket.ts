import { Server as ServerHTTP } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import IFriendsDAO from "@/src/friends/model/dao/IFriendsDAO";
import FriendsWebSocketController from "@/src/friends/controller/websocket/FriendsWebSocketController";

const setupWebSocket = (server: ServerHTTP, IFriendsDAO: IFriendsDAO) => {
  // Socket.io se engancha al server HTTP
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*", // o el origen que quieras permitir
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`🔌 Cliente conectado: ${socket.id}`);
    new FriendsWebSocketController(socket, IFriendsDAO);
    // createWebSocketController(io, socket); // tu lógica de friends
  });
};

export default setupWebSocket;
