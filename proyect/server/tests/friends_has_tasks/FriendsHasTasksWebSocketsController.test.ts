import IFriendsHasTasksDAO from "@/src/friends_has_tasks/model/dao/IFriendsHasTasksDAO";
import FriendsHasTasksWebSocketsController from "@/src/friends_has_tasks/controller/websockets/FriendsHasTasksWebSocketsController";
import { randomUUID } from "crypto";
import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import {
  FriendHasTasksCreate,
  FriendHasTasksFilters,
  validateFriendHasTasksCreate,
  validateFriendHasTasksFilters,
  User,
  FriendHasTasks,
  FriendHasTasksReturn,
} from "task-craft-models";
import { Temporal } from "@js-temporal/polyfill";

const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
});

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("mockToken123"),
  verify: jest.fn(),
}));

jest.mock("cookie-parser", () =>
  jest.fn(() => (req: any, res: any, next: any) => next())
);

describe("FriendsHasTasksWebSocketsController", () => {
  let userMock: User;
  let mockFriendsHasTasksModel: jest.Mocked<IFriendsHasTasksDAO>;
  let secretKey: string;
  let controller: FriendsHasTasksWebSocketsController;
  let socketMock: Socket;

  beforeEach(() => {
    userMock = {
      idUser: randomUUID(),
      userName: "john_doe",
      email: "john@example.com",
      urlImg: null,
      role: {
        idRole: 1,
        role: "admin",
      },
    };
    (jwt.verify as jest.Mock).mockReturnValue(userMock);
    mockFriendsHasTasksModel = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<IFriendsHasTasksDAO>;
    secretKey = process.env.JWT_SECRET as string;
    socketMock = {
      id: "mock-socket-id",
      data: {
        user: userMock,
      },
      handshake: {
        headers: {
          cookie: "access_token=mockToken123",
        },
        time: Date.now(),
        address: "mock-address",
        xdomain: false,
        secure: false,
      },
      emit: jest.fn(),
      on: jest.fn(),
      disconnect: jest.fn(),
    } as unknown as Socket;
    controller = new FriendsHasTasksWebSocketsController(
      socketMock,
      mockFriendsHasTasksModel
    );
    (controller as any).socket.data.user = userMock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
  describe("getSharedTaskRequests", () => {
    const emitName = "shared_task_requests";
    const emitErrorName = "shared_task_requests_error";
    it("should retrieve all shared task requests and emit the success message", async () => {
      const sampleSharedTasks: FriendHasTasks[] = [];

      const creatorUser1 = {
        idUser: randomUUID(),
        userName: "Alice",
        email: "alice@example.com",
        urlImg: "https://example.com/alice.png",
      };

      const assignedUser1 = {
        idUser: randomUUID(),
        userName: "Bob",
        email: "bob@example.com",
        urlImg: "https://example.com/bob.png",
      };

      sampleSharedTasks.push({
        idFriendHasTasks: randomUUID(),
        creatorUser: creatorUser1,
        assignedUser: assignedUser1,
        friendHasTaskRequestState: false,
        task: {
          idTask: randomUUID(),
          title: "Tarea 1",
          description: "Descripción de tarea 1",
          activityDate: Temporal.PlainDateTime.from("2025-04-11T10:00:00"),
          state: {
            idState: 1,
            state: "Pendiente",
          },
          type: {
            idType: 1,
            type: "Personal",
            color: "#FF0000",
          },
          idUser: creatorUser1.idUser, // correcto
        },
      });

      const creatorUser2 = {
        idUser: randomUUID(),
        userName: "Charlie",
        email: "charlie@example.com",
        urlImg: "https://example.com/charlie.png",
      };

      const assignedUser2 = {
        idUser: randomUUID(),
        userName: "Dave",
        email: "dave@example.com",
        urlImg: "https://example.com/dave.png",
      };

      sampleSharedTasks.push({
        idFriendHasTasks: randomUUID(),
        creatorUser: creatorUser2,
        assignedUser: assignedUser2,
        friendHasTaskRequestState: false,
        task: {
          idTask: randomUUID(),
          title: "Tarea 2",
          description: "Descripción de tarea 2",
          activityDate: Temporal.PlainDateTime.from("2025-04-11T10:00:00"),
          state: {
            idState: 2,
            state: "En progreso",
          },
          type: {
            idType: 2,
            type: "Trabajo",
            color: "#00FF00",
          },
          idUser: creatorUser2.idUser,
        },
      });

      const creatorUser3 = {
        idUser: randomUUID(),
        userName: "Eve",
        email: "eve@example.com",
        urlImg: "https://example.com/eve.png",
      };

      const assignedUser3 = {
        idUser: randomUUID(),
        userName: "Frank",
        email: "frank@example.com",
        urlImg: "https://example.com/frank.png",
      };

      sampleSharedTasks.push({
        idFriendHasTasks: randomUUID(),
        creatorUser: creatorUser3,
        assignedUser: assignedUser3,
        friendHasTaskRequestState: true,
        task: {
          idTask: randomUUID(),
          title: "Tarea 3",
          description: "Descripción de tarea 3",
          activityDate: Temporal.PlainDateTime.from("2025-04-11T10:00:00"),
          state: {
            idState: 3,
            state: "Completada",
          },
          type: {
            idType: 3,
            type: "Otro",
            color: "#0000FF",
          },
          idUser: creatorUser3.idUser,
        },
      });

      const filters: FriendHasTasksFilters = {
        idCreatorUser: sampleSharedTasks[0].creatorUser.idUser,
        idAssignedUser: sampleSharedTasks[0].assignedUser.idUser,
      };
      // Simulamos la validación exitosa de los filtros
      (mockFriendsHasTasksModel.getAll as jest.Mock).mockResolvedValue(
        sampleSharedTasks
      );

      await controller["getSharedTaskRequests"](filters);

      // Verifica que `getAll` haya sido llamado con los filtros correctos
      expect(mockFriendsHasTasksModel.getAll).toHaveBeenCalledWith(filters);
      expect(socketMock.emit).toHaveBeenCalledWith(emitName, sampleSharedTasks);
    });

    it("should emit an error if no shared task requests are found", async () => {
      const filters: FriendHasTasksFilters = { idCreatorUser: randomUUID() };

      mockFriendsHasTasksModel.getAll.mockResolvedValue([]);

      await controller["getSharedTaskRequests"](filters);

      expect(socketMock.emit).toHaveBeenCalledWith(emitErrorName, {
        error: "No se encontraron solicitudes de tarea compartida",
        message: "Error al mostrar las solicitudes de compartir tareas",
      });
    });

    it("should emit an error if validation of filters fails", async () => {
      const filters: FriendHasTasksFilters = { idCreatorUser: "user1" }; // Este valor puede ser inválido según tu esquema Zod

      await controller["getSharedTaskRequests"](filters);

      expect(socketMock.emit).toHaveBeenCalledWith(emitErrorName, {
        details: [
          {
            field: "idCreatorUser",
            message: "Invalid uuid",
          },
        ],
        message: "Filtros inválidos:",
      });
    });

    it("should emit an error if an unexpected error occurs", async () => {
      const filters: FriendHasTasksFilters = { idCreatorUser: randomUUID() };

      mockFriendsHasTasksModel.getAll.mockRejectedValue(
        new Error("Unexpected error")
      );

      await controller["getSharedTaskRequests"](filters);

      expect(socketMock.emit).toHaveBeenCalledWith(emitErrorName, {
        error: "Unexpected error",
        message: "Error al mostrar las solicitudes de compartir tareas",
      });
    });
  });

  describe("handleSendSharedTaskRequest", () => {
    const emitName = "shared_task_sent";
    const emitErrorName = "shared_task_sent_error";
    it("should send a shared task request and emit the success message", async () => {
      const idAssignedUser = randomUUID();
      const idFriendHasTasks = randomUUID();
      const idTask = randomUUID();
      const expectedFriendsHasTasks: FriendHasTasksReturn = {
        idFriendHasTasks,
        idTask: idTask,
        idAssignedUser: idAssignedUser,
        friendHasTaskRequestState: false,
      };

      // Mock del UUID
      jest
        .spyOn(require("crypto"), "randomUUID")
        .mockReturnValue(idFriendHasTasks);

      // Mock del repositorio
      (mockFriendsHasTasksModel.create as jest.Mock).mockResolvedValue(
        expectedFriendsHasTasks
      );

      await controller["handleSendSharedTaskRequest"]({
        idAssignedUser,
        idTask,
      });

      expect(mockFriendsHasTasksModel.create).toHaveBeenCalledWith(
        idFriendHasTasks,
        {
          idAssignedUser,
          idTask,
          friendHasTaskRequestState: false,
        }
      );

      expect(socketMock.emit).toHaveBeenCalledWith(emitName, {
        success: true,
        friend: expectedFriendsHasTasks,
      });
    });

    it("should emit an error if the shared task request fails", async () => {
      const idAssignedUser = randomUUID();

      // Configurar el mock para simular un error
      mockFriendsHasTasksModel.create.mockRejectedValue(null);

      // Llamar al método handleSendSharedTaskRequest
      await controller["handleSendSharedTaskRequest"](idAssignedUser);

      // Verificar que el socket emite un error
      expect(socketMock.emit).toHaveBeenCalledWith(emitErrorName, {
        details: [
          {
            field: "idAssignedUser",
            message: "Required",
          },
          {
            field: "idTask",
            message: "Required",
          },
        ],
        message: "Error al crear la solicitud de tarea compartida",
      });
    });

    it("should emit an error if assigned is not available", async () => {
      await controller["handleSendSharedTaskRequest"]("any-user-id");

      expect(socketMock.emit).toHaveBeenCalledWith(emitErrorName, {
        details: [
          {
            field: "idAssignedUser",
            message: "Required",
          },
          {
            field: "idTask",
            message: "Required",
          },
        ],
        message: "Error al crear la solicitud de tarea compartida",
      });
    });

    it("should emit an error if validation fails", async () => {
      const invalidId = ""; // ID inválido
      socketMock.data.user = { idUser: invalidId };

      await controller["handleSendSharedTaskRequest"]("invalid-id");

      expect(socketMock.emit).toHaveBeenCalledWith(emitErrorName, {
        details: [
          {
            field: "idAssignedUser",
            message: "Required",
          },
          {
            field: "idTask",
            message: "Required",
          },
        ],
        message: "Error al crear la solicitud de tarea compartida",
      });
    });

    it("should emit an error if idFriendHasTasks is invalid", async () => {
      const idAssignedUser = randomUUID();
      const invalidIdFriendHasTasks = "not-a-valid-uuid";

      jest
        .spyOn(require("crypto"), "randomUUID")
        .mockReturnValue(invalidIdFriendHasTasks);

      await controller["handleSendSharedTaskRequest"](idAssignedUser);

      expect(socketMock.emit).toHaveBeenCalledWith(emitErrorName, {
        details: [
          {
            field: "idAssignedUser",
            message: "Required",
          },
          {
            field: "idTask",
            message: "Required",
          },
        ],
        message: "Error al crear la solicitud de tarea compartida",
      });
    });

    it("should emit an error if shared task creation returns null", async () => {
      const idAssignedUser = randomUUID();
      const idFriendHasTasks = randomUUID();

      jest
        .spyOn(require("crypto"), "randomUUID")
        .mockReturnValue(idFriendHasTasks);
      mockFriendsHasTasksModel.create.mockResolvedValue(null);

      await controller["handleSendSharedTaskRequest"](idAssignedUser);

      expect(socketMock.emit).toHaveBeenCalledWith(emitErrorName, {
        details: [
          {
            field: "idAssignedUser",
            message: "Required",
          },
          {
            field: "idTask",
            message: "Required",
          },
        ],
        message: "Error al crear la solicitud de tarea compartida",
      });
    });
  });

  describe("handleAcceptSharedTaskRequest", () => {
    const emitName = "shared_task_accepted";
    const emitErrorName = "shared_task_accepted_error";
    it("should accept a friend request and emit the success message", async () => {
      const sharedTaskId = randomUUID();
      const taskId = randomUUID();
      const assignedUserId = randomUUID();
      const updateSharedTask: FriendHasTasksReturn = {
        idFriendHasTasks: sharedTaskId,
        idTask: taskId,
        idAssignedUser: assignedUserId,
        friendHasTaskRequestState: true,
      };

      mockFriendsHasTasksModel.update.mockResolvedValue(updateSharedTask);

      await controller["handleAcceptSharedTaskRequest"](sharedTaskId);

      expect(mockFriendsHasTasksModel.update).toHaveBeenCalledWith(
        sharedTaskId
      );
      expect(socketMock.emit).toHaveBeenCalledWith(emitName, {
        success: true,
        result: updateSharedTask,
      });
    });

    it("should emit an error if sharedTaskId is invalid", async () => {
      const invalidId = "invalid-uuid";

      await controller["handleAcceptSharedTaskRequest"](invalidId);

      expect(socketMock.emit).toHaveBeenCalledWith(emitErrorName, {
        error: "El ID de la tarea compartida debe ser válido",
        message: "Error al aceptar la solicitud de compartir la tarea",
      });
    });

    it("should emit an error if the update returns null", async () => {
      const idFriendsHasTasks = randomUUID();

      mockFriendsHasTasksModel.update.mockResolvedValue(null);

      await controller["handleAcceptSharedTaskRequest"](idFriendsHasTasks);

      expect(socketMock.emit).toHaveBeenCalledWith(emitErrorName, {
        error: "Error al actualizar la tarea compartida",
        message: "Error al aceptar la solicitud de compartir la tarea",
      });
    });

    it("should emit an error if the repository throws an exception", async () => {
      const idFriendsHasTasks = randomUUID();

      mockFriendsHasTasksModel.update.mockRejectedValue(new Error("DB Error"));

      await controller["handleAcceptSharedTaskRequest"](idFriendsHasTasks);

      expect(socketMock.emit).toHaveBeenCalledWith(emitErrorName, {
        error: "DB Error",
        message: "Error al aceptar la solicitud de compartir la tarea",
      });
    });
  });

  describe.only("handleDeleteSharedTaskRequest", () => {
    const emitName = "shared_task_deleted";
    const emitErrorName = "shared_task_deleted_error";
    it("should delete a friend request and emit the success message", async () => {
      const idFriendsHasTasks = randomUUID();

      // Simulamos que el repositorio devuelve true (indicando éxito)
      mockFriendsHasTasksModel.delete.mockResolvedValue(true);

      // Llamamos al método para manejar la eliminación
      await controller["handleDeleteSharedTaskRequest"](idFriendsHasTasks);

      // Verificamos que la función de eliminación fue llamada con el ID correcto
      expect(mockFriendsHasTasksModel.delete).toHaveBeenCalledWith(
        idFriendsHasTasks
      );

      // Verificamos que el socket emite el mensaje adecuado con un éxito
      expect(socketMock.emit).toHaveBeenCalledWith("shared_task_deleted", {
        success: true,
        result: true,
      });
    });

    it("should emit an error if idFriendsHasTasks is invalid", async () => {
      const invalidId = "not-a-uuid";

      await controller["handleDeleteSharedTaskRequest"](invalidId);

      expect(socketMock.emit).toHaveBeenCalledWith(
        "shared_task_deleted_error",
        {
          error: "El ID de compartir la tarea debe ser válido",
          message: "Error al eliminar la solicitud de compartir la tarea",
        }
      );
    });

    it("should emit an error if the repository throws an exception", async () => {
      const idFriendsHasTasks = randomUUID();

      mockFriendsHasTasksModel.delete.mockRejectedValue(new Error("DB error"));

      await controller["handleDeleteSharedTaskRequest"](idFriendsHasTasks);

      expect(socketMock.emit).toHaveBeenCalledWith(
        "shared_task_deleted_error",
        {
          error: "DB error",
          message: "Error al eliminar la solicitud de compartir la tarea",
        }
      );
    });
  });
});
