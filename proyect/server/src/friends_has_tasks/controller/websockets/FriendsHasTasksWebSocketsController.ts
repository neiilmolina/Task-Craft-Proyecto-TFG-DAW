import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import FriendsHasTasksRepository from "@/src/friends_has_tasks/model/FriendsHasTasksRepository";
import IFriendsHasTasksDAO from "@/src/friends_has_tasks/model/dao/IFriendsHasTasksDAO";
import { randomUUID } from "crypto";
import {
  FriendHasTasksCreate,
  FriendHasTasksFilters,
  validateFriendHasTasksCreate,
  validateFriendHasTasksFilters,
} from "task-craft-models";
import { UUID_REGEX } from "@/src/core/constants";

const secretKey = process.env.JWT_SECRET as string;

const SOCKET_EVENTS_NAMES = {
  SEND_SHARED_TASK_REQUEST: "send_shared_task_request",
  ACCEPT_SHARED_TASK_REQUEST: "accept_shared_task_request",
  DELETE_SHARED_TASK_REQUEST: "delete_shared_task_request",
  GET_SHARED_TASK_REQUESTS: "get_Sshared_taskrequests",
  AUTH_ERROR: "auth_error",
  DISCONNECT: "disconnect",
};

export default class FriendsHasTasksWebSocketsController {
  private friendsHasTasksRepository: FriendsHasTasksRepository;
  constructor(private socket: Socket, friendsHasTasksDAO: IFriendsHasTasksDAO) {
    this.friendsHasTasksRepository = new FriendsHasTasksRepository(
      friendsHasTasksDAO
    );
    this.authenticateAndInit();
  }

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
      SOCKET_EVENTS_NAMES.SEND_SHARED_TASK_REQUEST,
      this.handleSendSharedTaskRequest
    );
    this.socket.on(
      SOCKET_EVENTS_NAMES.ACCEPT_SHARED_TASK_REQUEST,
      this.handleAcceptSharedTaskRequest
    );
    this.socket.on(SOCKET_EVENTS_NAMES.DISCONNECT, this.handleDisconnect);
    this.socket.on(
      SOCKET_EVENTS_NAMES.DELETE_SHARED_TASK_REQUEST,
      this.handleDeleteSharedTaskRequest
    );
    this.socket.on(
      SOCKET_EVENTS_NAMES.GET_SHARED_TASK_REQUESTS,
      this.getSharedTaskRequests
    );
  }

  private handleDisconnect = async () => {
    console.log(`🔌 Usuario desconectado: ${this.socket.id}`);
  };
  private getSharedTaskRequests = async (filters?: FriendHasTasksFilters) => {
    const SOCKET_EVENTS_NAMES = {
      EMIT: "shared_task_requests",
      ERROR: "shared_task_requests_error",
    };

    try {
      // Validación de filtros
      if (filters) {
        const result = validateFriendHasTasksFilters(filters);
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
      const sharedTasksRequests = await this.friendsHasTasksRepository.getAll(
        filters || {}
      );
      console.log("Solicitudes de amistad:", sharedTasksRequests);

      // Si no hay solicitudes, lanzar un error
      if (!sharedTasksRequests || sharedTasksRequests.length === 0) {
        throw new Error("No se encontraron solicitudes de amistad");
      }

      // Emitir las solicitudes de amistad
      this.socket.emit(SOCKET_EVENTS_NAMES.EMIT, sharedTasksRequests);
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
        message: "Error al mostrar las solicitudes de compartir tareas",
        error: errorMessage,
      });
    }
  };

  private handleSendSharedTaskRequest = async ({
    idAssignedUser,
    idTask,
  }: any) => {
    const SOCKET_EVENTS_NAMES = {
      EMIT: "shared_task_sent",
      ERROR: "shared_task_sent_error",
    };

    try {
      const data: FriendHasTasksCreate = {
        idAssignedUser: idAssignedUser,
        idTask: idTask,
        friendHasTaskRequestState: false,
      };

      // Realizar la validación
      const result = validateFriendHasTasksCreate(data);
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
      const idFriendsHasTasks = randomUUID();

      // Verificar que el idFriendsHasTasks sea válido
      if (!UUID_REGEX.test(idFriendsHasTasks)) {
        throw new Error("El ID al compartir la tarea debe ser válido");
      }

      // Intentar crear la amistad
      const friend = await this.friendsHasTasksRepository.create(
        idFriendsHasTasks,
        data
      );
      if (!friend) {
        throw new Error("Error al compartir la tarea");
      }

      // Emitir el resultado exitoso
      this.socket.emit(SOCKET_EVENTS_NAMES.EMIT, { success: true, friend });
    } catch (error) {
      // Emitir el error al cliente
      this.socket.emit(SOCKET_EVENTS_NAMES.ERROR, {
        message: "Error al compartir la tarea",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  };

  private handleAcceptSharedTaskRequest = async (idFriendsHasTasks: string) => {
    const SOCKET_EVENTS_NAMES = {
      EMIT: "shared_task_accepted",
      ERROR: "shared_task_accepted_error",
    };

    try {
      if (!UUID_REGEX.test(idFriendsHasTasks))
        throw new Error("El ID de la amistad debe ser válido");

      const result = await this.friendsHasTasksRepository.update(
        idFriendsHasTasks
      );
      if (!result) throw new Error("Error al actualizar la amistad");

      // Emitir el resultado exitoso
      this.socket.emit(SOCKET_EVENTS_NAMES.EMIT, { success: true, result });
    } catch (error) {
      // Emitir el error al cliente
      this.socket.emit(SOCKET_EVENTS_NAMES.ERROR, {
        message: "Error al aceptar la solicitud de compartir la tarea",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  };

  private handleDeleteSharedTaskRequest = async (idFriendsHasTasks: string) => {
    const SOCKET_EVENTS_NAMES = {
      EMIT: "shared_task_deleted",
      ERROR: "shared_task_deleted_error",
    };

    try {
      if (!UUID_REGEX.test(idFriendsHasTasks))
        throw new Error("El ID de compartir la tarea debe ser válido");

      const result = await this.friendsHasTasksRepository.delete(
        idFriendsHasTasks
      );
      if (!result)
        throw new Error("Error al eliminar la solicitud de compartir la tarea");

      // Emitir el resultado exitoso
      this.socket.emit(SOCKET_EVENTS_NAMES.EMIT, { success: true, result });
    } catch (error) {
      // Emitir el error al cliente
      this.socket.emit(SOCKET_EVENTS_NAMES.ERROR, {
        message: "Error al eliminar la solicitud de compartir la tarea",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  };
}
