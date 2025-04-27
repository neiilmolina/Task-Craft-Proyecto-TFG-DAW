import { Server as ServerHTTP } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import IFriendsDAO from "@/src/friends/model/dao/IFriendsDAO";
import FriendsWebSocketController from "@/src/friends/controller/websocket/FriendsWebSocketController";
import FriendsHasTasksWebSocketsController from "@/src/friends_has_tasks/controller/websockets/FriendsHasTasksWebSocketsController";
import IFriendsHasTasksDAO from "@/src/friends_has_tasks/model/dao/IFriendsHasTasksDAO";

const setupWebSocket = (
  server: ServerHTTP,
  IFriendsDAO: IFriendsDAO,
  IFriendsHasTasksDAO: IFriendsHasTasksDAO
) => {
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
    new FriendsHasTasksWebSocketsController(socket, IFriendsHasTasksDAO);
  });
};

export default setupWebSocket;
