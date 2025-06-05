import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import FriendsRepository from "@/src/friends/model/FriendsRepository";
import { FriendCreate, FriendFilters } from "task-craft-models";
import IFriendsDAO from "@/src/friends/model/dao/IFriendsDAO";
import { randomUUID } from "crypto";
import { validateFriendCreate, validateFriendFilters } from "task-craft-models";
import { UUID_REGEX } from "@/src/core/constants";

const secretKey = process.env.JWT_SECRET as string;

const SOCKET_EVENTS_NAMES = {
  SEND_FRIEND_REQUEST: "send_friend_request",
  ACCEPT_FRIEND_REQUEST: "accept_friend_request",
  DISCONNECT: "disconnect",
  DELETE_FRIEND_REQUEST: "delete_friend_request",
  GET_FRIEND_REQUESTS: "get_friend_requests",
  AUTH_ERROR: "auth_error",
};

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
      this.socket.emit(
        SOCKET_EVENTS_NAMES.AUTH_ERROR,
        "Token no proporcionado"
      );
      this.socket.disconnect();
      return;
    }

    try {
      const decoded = jwt.verify(token, secretKey);
      this.socket.data.user = decoded;
      // console.log(
      //   `✅ Usuario autenticado vía socket: ${this.socket.data.user.idUser}`
      // );

      this.registerEvents();
    } catch (error) {
      this.socket.emit(
        SOCKET_EVENTS_NAMES.AUTH_ERROR,
        "Token inválido o expirado"
      );
      this.socket.disconnect();
    }
  }

  private registerEvents(): void {
    this.socket.on(
      SOCKET_EVENTS_NAMES.SEND_FRIEND_REQUEST,
      this.handleSendFriendRequest
    );
    this.socket.on(
      SOCKET_EVENTS_NAMES.ACCEPT_FRIEND_REQUEST,
      this.handleAcceptFriendRequest
    );
    this.socket.on(SOCKET_EVENTS_NAMES.DISCONNECT, this.handleDisconnect);
    this.socket.on(
      SOCKET_EVENTS_NAMES.DELETE_FRIEND_REQUEST,
      this.handleDeleteFriendRequest
    );
    this.socket.on(
      SOCKET_EVENTS_NAMES.GET_FRIEND_REQUESTS,
      this.getFriendRequests
    );
  }

  private getFriendRequests = async (filters?: FriendFilters) => {
    const SOCKET_EVENTS_NAMES = {
      EMIT: "friend_requests",
      ERROR: "friend_requests_error",
    };

    try {
      // Validación de filtros
      if (filters) {
        const result = validateFriendFilters(filters);
        console.log("Resultado validación", result);

        if (!result || !result.success) {
          const errorMessages = result?.errors
            ?.map((error) => error.message)
            .join(", ");
          console.error("Errores de validación:", errorMessages);
          this.socket.emit(SOCKET_EVENTS_NAMES.ERROR, {
            message: "Filtros inválidos:",
            details: result.errors.map((error) => ({
              field: error.field,
              message: error.message,
            })),
          });
          return;
        }
      }

      // Obtener solicitudes de amistad
      const friendRequests = await this.friendsRepository.getAll(filters || {});
      console.log("Solicitudes de amistad:", friendRequests);

      // Si no hay solicitudes, lanzar un error
      if (!friendRequests || friendRequests.length === 0) {
        throw new Error("No se encontraron solicitudes de amistad");
      }

      // Emitir las solicitudes de amistad
      this.socket.emit(SOCKET_EVENTS_NAMES.EMIT, friendRequests);
    } catch (error) {
      // Manejo de errores
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      console.log("Error:", errorMessage);

      if (error instanceof Error && error.stack) {
        console.error("Stack trace:", error.stack);
      }

      // Enviar el error al cliente
      this.socket.emit(SOCKET_EVENTS_NAMES.ERROR, {
        message: "Error al mostrar las solicitudes de amistad",
        error: errorMessage,
      });
    }
  };

  private handleSendFriendRequest = async (idSecondUser: string) => {
    const SOCKET_EVENTS_NAMES = {
      EMIT: "friend_request_sent",
      ERROR: "friend_request_sent_error",
    };

    try {
      const firstUser = this.socket.data.user?.idUser;
      if (!firstUser) {
        throw new Error("El id del usuario no está disponible.");
      }

      const data: FriendCreate = {
        firstUser: firstUser,
        secondUser: idSecondUser,
        friendRequestState: false,
      };

      // Realizar la validación
      const result = validateFriendCreate(data);
      console.log("Resultado de la validación:", result);

      if (!result || !result.success) {
        this.socket.emit(SOCKET_EVENTS_NAMES.ERROR, {
          message: "Error al crear la solicitud de amistad",
          details: result.errors.map((error) => ({
            field: error.field,
            message: error.message,
          })),
        });
        return;
      }

      // Generar un id para la amistad
      const idFriend = randomUUID();

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
      this.socket.emit(SOCKET_EVENTS_NAMES.EMIT, { success: true, friend });
    } catch (error) {
      // Emitir el error al cliente
      this.socket.emit(SOCKET_EVENTS_NAMES.ERROR, {
        message: "Error al enviar solicitud de amistad",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  };

  private handleAcceptFriendRequest = async (friendId: string) => {
    const SOCKET_EVENTS_NAMES = {
      EMIT: "friend_request_accepted",
      ERROR: "friend_request_accepted_error",
    };

    try {
      if (!UUID_REGEX.test(friendId))
        throw new Error("El ID de la amistad debe ser válido");

      const result = await this.friendsRepository.update(friendId);
      if (!result) throw new Error("Error al actualizar la amistad");

      // Emitir el resultado exitoso
      this.socket.emit(SOCKET_EVENTS_NAMES.EMIT, { success: true, result });
    } catch (error) {
      // Emitir el error al cliente
      this.socket.emit(SOCKET_EVENTS_NAMES.ERROR, {
        message: "Error al aceptar solicitud de amistad",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  };

  private handleDeleteFriendRequest = async (friendId: string) => {
    const SOCKET_EVENTS_NAMES = {
      EMIT: "friend_request_deleted",
      ERROR: "friend_request_deleted_error",
    };

    try {
      if (!UUID_REGEX.test(friendId))
        throw new Error("El ID de la amistad debe ser válido");

      const result = await this.friendsRepository.delete(friendId);
      if (!result) throw new Error("Error al eliminar la amistad");

      // Emitir el resultado exitoso
      this.socket.emit(SOCKET_EVENTS_NAMES.EMIT, { success: true, result });
    } catch (error) {
      // Emitir el error al cliente
      this.socket.emit(SOCKET_EVENTS_NAMES.ERROR, {
        message: "Error al eliminar solicitud de amistad",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  };

  private handleDisconnect = () => {
    console.log(`🔌 Usuario desconectado: ${this.socket.id}`);
  };
}
