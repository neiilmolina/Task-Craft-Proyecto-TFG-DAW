import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import FriendsRepository from "@/src/friends/model/FriendsRepository";
import { FriendCreate } from "@/src/friends/model/interfaces/interfacesFriends";
import IFriendsDAO from "@/src/friends/model/dao/IFriendsDAO";
import { randomUUID } from "crypto";
import { validateFriendCreate } from "@/src/friends/model/interfaces/schemasFriends";
import { UUID_REGEX } from "@/src/core/constants";

const secretKey = process.env.JWT_SECRET as string;

export default class FriendsWebSocketController {
  private friendsRepository: FriendsRepository;
  constructor(private socket: Socket, IFriendsDAO: IFriendsDAO) {
    this.friendsRepository = new FriendsRepository(IFriendsDAO);
    this.authenticateAndInit();
  }

  // Authenticate the user and initialize the events
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
    this.socket.on("delete_friend_request", this.handleDeleteFriendRequest);
  }

  private handleSendFriendRequest = async (idSecondUser: string) => {
    try {
      const firstUser = this.socket.data.user?.id;
      if (!firstUser) {
        throw new Error("El primer usuario no está disponible.");
      }

      const data: FriendCreate = {
        firstUser: firstUser,
        secondUser: idSecondUser,
        friendRequestState: false,
      };

      console.log("friendData:", data);

      // Realizar la validación
      const result = validateFriendCreate(data);
      console.log("Validation result:", result);

      if (!result.success) {
        const errorMessages = result.errors
          ?.map((error) => error.message)
          .join(", ");
        console.error("Validation errors:", errorMessages); // Mostrar los errores de validación
        throw new Error(errorMessages);
      }

      // Generar un id para la amistad
      const idFriend = randomUUID();
      console.log("Generated idFriend:", idFriend);

      // Verificar que el idFriend sea válido
      if (!UUID_REGEX.test(idFriend)) {
        throw new Error("El ID de la amistad debe ser válido");
      }

      // Intentar crear la amistad
      const friend = await this.friendsRepository.create(idFriend, data);
      if (!friend) {
        throw new Error("Error al crear la amistad");
      }

      // Emitir el resultado exitoso
      this.socket.emit("friend_request_sent", { success: true, friend });
    } catch (error) {
      console.error("Error en handleSendFriendRequest:", error); // Mostrar el error completo
      this.socket.emit("error", {
        message: "Error al enviar solicitud de amistad",
        error,
      });
    }
  };

  private handleAcceptFriendRequest = async (friendId: string) => {
    try {
      if (!UUID_REGEX.test(friendId))
        throw new Error("El ID de la amistad debe ser válido");
      const result = await this.friendsRepository.update(friendId);

      if (!result) throw new Error("Error al actualizar la amistad");
      this.socket.emit("friend_request_accepted", { success: true, result });
    } catch (error) {
      this.socket.emit("error", {
        message: "Error al aceptar solicitud de amistad",
        error,
      });
    }
  };

  private handleDeleteFriendRequest = async (friendId: string) => {
    try {
      if (!UUID_REGEX.test(friendId))
        throw new Error("El ID de la amistad debe ser válido");
      const result = await this.friendsRepository.delete(friendId);
      if (!result) throw new Error("Error al eliminar la amistad");
      this.socket.emit("friend_request_deleted", { success: true, result });
    } catch (error) {
      this.socket.emit("error", {
        message: "Error al eliminar solicitud de amistad",
        error,
      });
    }
  };

  private handleDisconnect = () => {
    console.log(`🔌 Usuario desconectado: ${this.socket.id}`);
  };
}
