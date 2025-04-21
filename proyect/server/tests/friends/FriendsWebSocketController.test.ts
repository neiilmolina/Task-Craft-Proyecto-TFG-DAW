import IFriendsDAO from "@/src/friends/model/dao/IFriendsDAO";
import FriendsWebSocketController from "@/src/friends/controller/websocket/FriendsWebSocketController";
import { User } from "@/src/users/model/interfaces/interfacesUsers";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import { FriendReturn } from "@/src/friends/model/interfaces/interfacesFriends";
const KEY_ACCESS_COOKIE = "access_token";

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

  describe("handleSendFriendRequest", () => {
    it.only("should send a friend request and emit the success message", async () => {
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
      const mockError = new Error("Error al enviar solicitud de amistad");

      // Configurar el mock para simular un error
      mockFriendsModel.create.mockRejectedValue(mockError);

      // Llamar al método handleSendFriendRequest
      await controller["handleSendFriendRequest"](idSecondUser);

      // Verificar que el socket emite un error
      expect(socketMock.emit).toHaveBeenCalledWith("error", {
        message: "Error al enviar solicitud de amistad",
        error: mockError,
      });
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
