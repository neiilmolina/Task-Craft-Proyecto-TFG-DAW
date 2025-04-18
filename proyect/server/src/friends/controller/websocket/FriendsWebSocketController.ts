import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import FriendsRepository from "@/src/friends/model/FriendsRepository";
import { FriendCreate } from "@/src/friends/model/interfaces/interfacesFriends";
import IFriendsDAO from "@/src/friends/model/dao/IFriendsDAO";

const secretKey = process.env.JWT_SECRET as string;

export default class FriendsWebSocketController {
  private friendsRepository: FriendsRepository;
  constructor(private socket: Socket, IFriendsDAO: IFriendsDAO) {
    this.friendsRepository = new FriendsRepository(IFriendsDAO);
    this.authenticateAndInit();
  }

  private authenticateAndInit(): void {
    const token =
      this.socket.handshake.headers.cookie?.match(/access_token=([^;]+)/)?.[1];

    if (!token) {
      this.socket.emit("auth_error", "Token no proporcionado");
      this.socket.disconnect();
      return;
    }

    try {
      const decoded = jwt.verify(token, secretKey);
      this.socket.data.user = decoded;
      console.log(
        `✅ Usuario autenticado vía socket: ${this.socket.data.user.id}`
      );

      this.registerEvents();
    } catch (error) {
      this.socket.emit("auth_error", "Token inválido o expirado");
      this.socket.disconnect();
    }
  }

  private registerEvents(): void {
    this.socket.on("send_friend_request", this.handleSendFriendRequest);
    this.socket.on("accept_friend_request", this.handleAcceptFriendRequest);
    this.socket.on("disconnect", this.handleDisconnect);
  }

  private handleSendFriendRequest = async (data: FriendCreate) => {
    const userId = this.socket.data.user?.id;

    try {
      const result = await this.friendsRepository.create(userId, data);
      this.socket.emit("friend_request_sent", { success: true, result });
    } catch (error) {
      this.socket.emit("error", {
        message: "Error al enviar solicitud de amistad",
        error,
      });
    }
  };

  private handleAcceptFriendRequest = async (data: { friendId: string }) => {
    const userId = this.socket.data.user?.id;

    try {
      const result = await this.friendsRepository.update(userId);
      this.socket.emit("friend_request_accepted", { success: true, result });
    } catch (error) {
      this.socket.emit("error", {
        message: "Error al aceptar solicitud de amistad",
        error,
      });
    }
  };

  private handleDisconnect = () => {
    console.log(`🔌 Usuario desconectado: ${this.socket.id}`);
  };
}
