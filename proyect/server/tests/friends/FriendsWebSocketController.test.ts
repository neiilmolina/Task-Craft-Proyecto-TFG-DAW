import IFriendsDAO from "../../src/friends/model/dao/IFriendsDAO";
import FriendsWebSocketController from "../../src/friends/controller/websocket/FriendsWebSocketController";
import { User } from "task-craft-models";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import { Friend, FriendFilters, FriendReturn } from "task-craft-models";

const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
});

// Mockear jwt.sign para que devuelva un token predecible
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("mockToken123"),
  verify: jest.fn(),
}));

jest.mock("cookie-parser", () =>
  jest.fn(() => (req: any, res: any, next: any) => next())
);

describe("FriendsWebSocketController", () => {
  let userMock: User;
  let mockFriendsModel: jest.Mocked<IFriendsDAO>;
  let secretKey: string;
  let controller: FriendsWebSocketController;
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
    mockFriendsModel = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<IFriendsDAO>;
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
    controller = new FriendsWebSocketController(socketMock, mockFriendsModel);
    (controller as any).socket.data.user = userMock;
    // controller["socket"].data.user = userMock;
  });

  describe("getFriendRequests", () => {
    it("should retrieve all friend requests and emit the success message", async () => {
      const mockFriendRequests: Friend[] = [
        {
          idFriend: randomUUID(),
          firstUser: {
            idUser: randomUUID(),
            urlImg: null,
            userName: "User One",
            email: "user1@example.com",
          },
          secondUser: {
            idUser: randomUUID(),
            urlImg: "image1.jpg",
            userName: "User Two",
            email: "user2@example.com",
          },
          friendRequestState: false,
        },
      ];

      const filters: FriendFilters = {
        idFirstUser: mockFriendRequests[0].firstUser.idUser,
        idSecondUser: mockFriendRequests[0].secondUser.idUser,
      };
      // Simulamos la validación exitosa de los filtros
      (mockFriendsModel.getAll as jest.Mock).mockResolvedValue(
        mockFriendRequests
      );

      await controller["getFriendRequests"](filters);

      // Verifica que `getAll` haya sido llamado con los filtros correctos
      expect(mockFriendsModel.getAll).toHaveBeenCalledWith(filters);
      expect(socketMock.emit).toHaveBeenCalledWith(
        "friend_requests",
        mockFriendRequests
      );
    });

    it("should emit an error if no friend requests are found", async () => {
      const filters: FriendFilters = { idFirstUser: randomUUID() };

      mockFriendsModel.getAll.mockResolvedValue([]);

      await controller["getFriendRequests"](filters);

      expect(socketMock.emit).toHaveBeenCalledWith("friend_requests_error", {
        error: "No se encontraron solicitudes de amistad",
        message: "Error al mostrar las solicitudes de amistad",
      });
    });

    it("should emit an error if validation of filters fails", async () => {
      const filters: FriendFilters = { idFirstUser: "user1" }; // Este valor puede ser inválido según tu esquema Zod

      await controller["getFriendRequests"](filters);

      expect(socketMock.emit).toHaveBeenCalledWith("friend_requests_error", {
        details: [
          {
            field: "idFirstUser",
            message: "Invalid uuid",
          },
        ],
        message: "Filtros inválidos:",
      });
    });

    it("should emit an error if an unexpected error occurs", async () => {
      const filters: FriendFilters = { idFirstUser: randomUUID() };

      mockFriendsModel.getAll.mockRejectedValue(new Error("Unexpected error"));

      await controller["getFriendRequests"](filters);

      expect(socketMock.emit).toHaveBeenCalledWith("friend_requests_error", {
        error: "Unexpected error",
        message: "Error al mostrar las solicitudes de amistad",
      });
    });
  });

  describe("handleSendFriendRequest", () => {
    it("should send a friend request and emit the success message", async () => {
      const idSecondUser = randomUUID();
      const idFriend = randomUUID(); // Este será el mismo que el generado dentro del método

      const expectedFriend = {
        idFriend,
        firstUser: userMock.idUser,
        secondUser: idSecondUser,
        friendRequestState: false,
      };

      // Mock del UUID
      jest.spyOn(require("crypto"), "randomUUID").mockReturnValue(idFriend);

      // Mock del repositorio
      (mockFriendsModel.create as jest.Mock).mockResolvedValue(expectedFriend);

      await controller["handleSendFriendRequest"](idSecondUser);

      expect(mockFriendsModel.create).toHaveBeenCalledWith(idFriend, {
        firstUser: userMock.idUser,
        secondUser: idSecondUser,
        friendRequestState: false,
      });

      expect(socketMock.emit).toHaveBeenCalledWith("friend_request_sent", {
        success: true,
        friend: expectedFriend,
      });
    });

    it("should emit an error if the friend request fails", async () => {
      const idSecondUser = randomUUID();
      const mockErrorMessage = "Error al enviar solicitud de amistad";
      const mockError = new Error(mockErrorMessage);

      // Configurar el mock para simular un error
      mockFriendsModel.create.mockRejectedValue(mockError);

      // Llamar al método handleSendFriendRequest
      await controller["handleSendFriendRequest"](idSecondUser);

      // Verificar que el socket emite un error
      expect(socketMock.emit).toHaveBeenCalledWith(
        "friend_request_sent_error",
        {
          message: "Error al enviar solicitud de amistad",
          error: mockErrorMessage,
        }
      );
    });

    it("should emit an error if firstUser is not available", async () => {
      socketMock.data.user = undefined;

      await controller["handleSendFriendRequest"]("any-user-id");

      expect(socketMock.emit).toHaveBeenCalledWith(
        "friend_request_sent_error",
        {
          error: "El id del usuario no está disponible.",
          message: "Error al enviar solicitud de amistad",
        }
      );
    });

    it("should emit an error if validation fails", async () => {
      const invalidId = ""; // ID inválido
      socketMock.data.user = { idUser: invalidId };

      await controller["handleSendFriendRequest"]("invalid-id");

      expect(socketMock.emit).toHaveBeenCalledWith(
        "friend_request_sent_error",
        {
          error: "El id del usuario no está disponible.",
          message: "Error al enviar solicitud de amistad",
        }
      );
    });

    it("should emit an error if idFriend is invalid", async () => {
      const idSecondUser = randomUUID();
      const invalidIdFriend = "not-a-valid-uuid";

      jest
        .spyOn(require("crypto"), "randomUUID")
        .mockReturnValue(invalidIdFriend);

      await controller["handleSendFriendRequest"](idSecondUser);

      expect(socketMock.emit).toHaveBeenCalledWith(
        "friend_request_sent_error",
        {
          error: "El ID de la amistad debe ser válido",
          message: "Error al enviar solicitud de amistad",
        }
      );
    });

    it("should emit an error if friend creation returns null", async () => {
      const idSecondUser = randomUUID();
      const idFriend = randomUUID();

      jest.spyOn(require("crypto"), "randomUUID").mockReturnValue(idFriend);
      mockFriendsModel.create.mockResolvedValue(null);

      await controller["handleSendFriendRequest"](idSecondUser);

      expect(socketMock.emit).toHaveBeenCalledWith(
        "friend_request_sent_error",
        {
          error: "Error al crear la amistad",
          message: "Error al enviar solicitud de amistad",
        }
      );
    });
  });

  describe("handleAcceptFriendRequest", () => {
    it("should accept a friend request and emit the success message", async () => {
      const friendId = randomUUID();
      const updatedFriend = {
        idFriend: friendId,
        firstUser: "user1",
        secondUser: "user2",
        friendRequestState: true,
      };

      mockFriendsModel.update.mockResolvedValue(updatedFriend);

      await controller["handleAcceptFriendRequest"](friendId);

      expect(mockFriendsModel.update).toHaveBeenCalledWith(friendId);
      expect(socketMock.emit).toHaveBeenCalledWith("friend_request_accepted", {
        success: true,
        result: updatedFriend,
      });
    });

    it("should emit an error if friendId is invalid", async () => {
      const invalidId = "invalid-uuid";

      await controller["handleAcceptFriendRequest"](invalidId);

      expect(socketMock.emit).toHaveBeenCalledWith(
        "friend_request_accepted_error",
        {
          error: "El ID de la amistad debe ser válido",
          message: "Error al aceptar solicitud de amistad",
        }
      );
    });

    it("should emit an error if the update returns null", async () => {
      const friendId = randomUUID();

      mockFriendsModel.update.mockResolvedValue(null);

      await controller["handleAcceptFriendRequest"](friendId);

      expect(socketMock.emit).toHaveBeenCalledWith(
        "friend_request_accepted_error",
        {
          error: "Error al actualizar la amistad",
          message: "Error al aceptar solicitud de amistad",
        }
      );
    });

    it("should emit an error if the repository throws an exception", async () => {
      const friendId = randomUUID();

      mockFriendsModel.update.mockRejectedValue(new Error("DB Error"));

      await controller["handleAcceptFriendRequest"](friendId);

      expect(socketMock.emit).toHaveBeenCalledWith(
        "friend_request_accepted_error",
        { error: "DB Error", message: "Error al aceptar solicitud de amistad" }
      );
    });
  });

  describe.only("handleDeleteFriendRequest", () => {
    it("should delete a friend request and emit the success message", async () => {
      const friendId = randomUUID();
      const deletedFriend = {
        idFriend: friendId,
        firstUser: "user1",
        secondUser: "user2",
        friendRequestState: false,
      };

      // Simulamos que el repositorio devuelve true (indicando éxito)
      mockFriendsModel.delete.mockResolvedValue(true);

      // Llamamos al método para manejar la eliminación
      await controller["handleDeleteFriendRequest"](friendId);

      // Verificamos que la función de eliminación fue llamada con el ID correcto
      expect(mockFriendsModel.delete).toHaveBeenCalledWith(friendId);

      // Verificamos que el socket emite el mensaje adecuado con un éxito
      expect(socketMock.emit).toHaveBeenCalledWith("friend_request_deleted", {
        success: true,
        result: true,
      });
    });

    it("should emit an error if friendId is invalid", async () => {
      const invalidId = "not-a-uuid";

      await controller["handleDeleteFriendRequest"](invalidId);

      expect(socketMock.emit).toHaveBeenCalledWith(
        "friend_request_deleted_error",
        {
          error: "El ID de la amistad debe ser válido",
          message: "Error al eliminar solicitud de amistad",
        }
      );
    });

    it("should emit an error if the repository throws an exception", async () => {
      const friendId = randomUUID();

      mockFriendsModel.delete.mockRejectedValue(new Error("DB error"));

      await controller["handleDeleteFriendRequest"](friendId);

      expect(socketMock.emit).toHaveBeenCalledWith(
        "friend_request_deleted_error",
        { error: "DB error", message: "Error al eliminar solicitud de amistad" }
      );
    });
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
});
