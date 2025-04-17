import createFriendsRoute from "@/src/friends/controller/http/routesFriends";
import IFriendsDAO from "@/src/friends/model/dao/IFriendsDAO";
import express from "express";
import request from "supertest";
import {
  FriendCreate,
  Friend,
  FriendReturn,
  FriendFilters,
} from "@/src/friends/model/interfaces/interfacesFriends";
import { v4 as uuidv4 } from "uuid";
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
});

describe("Friends Routes", () => {
  let app: express.Application;
  let mockFriendsModel: jest.Mocked<IFriendsDAO>;

  beforeEach(() => {
    mockFriendsModel = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<IFriendsDAO>;

    app = express();
    app.use(express.json());
    app.use("/friends", createFriendsRoute(mockFriendsModel));
  });

  describe("GET /friends", () => {
    const sampleFriends: Friend[] = [
      {
        idFriend: uuidv4(),
        friendRequestState: true,
        firstUser: {
          idUser: uuidv4(),
          urlImg: "https://example.com/image1.jpg",
          userName: "juan123",
          email: "juan@example.com",
        },
        secondUser: {
          idUser: uuidv4(),
          urlImg: "https://example.com/image2.jpg",
          userName: "maria456",
          email: "maria@example.com",
        },
      },
      {
        idFriend: uuidv4(),
        friendRequestState: false,
        firstUser: {
          idUser: uuidv4(),
          urlImg: null,
          userName: "carlos789",
          email: "carlos@example.com",
        },
        secondUser: {
          idUser: uuidv4(),
          urlImg: "https://example.com/image3.jpg",
          userName: "laura321",
          email: "laura@example.com",
        },
      },
    ];

    it("debe devolver un array de friends cuando la base de datos tiene datos", async () => {
      mockFriendsModel.getAll.mockResolvedValue(sampleFriends);

      const res = await request(app).get("/friends");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(sampleFriends);
      expect(mockFriendsModel.getAll).toHaveBeenCalledWith({});
    });

    it("debe devolver un array vacío cuando la base de datos no tiene datos", async () => {
      mockFriendsModel.getAll.mockResolvedValue([]);

      const res = await request(app).get("/friends");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
      expect(mockFriendsModel.getAll).toHaveBeenCalledWith({});
    });

    it("debe devolver un error 500 si falla la obtención de datos", async () => {
      mockFriendsModel.getAll.mockRejectedValue(new Error("DB error"));

      const res = await request(app).get("/friends");

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Error interno del servidor" });
      expect(mockFriendsModel.getAll).toHaveBeenCalled();
    });

    it("should filter by idFirstUser", async () => {
      const idUser = sampleFriends[0].firstUser.idUser;
      const filterFriends = sampleFriends.filter(
        (friend: Friend) => friend.firstUser.idUser === idUser
      );
      mockFriendsModel.getAll.mockResolvedValue(filterFriends);
      const res = await request(app)
        .get("/friends")
        .query({ idFirstUser: idUser });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(filterFriends);
      res.body.forEach((friend: Friend) => {
        expect(friend.firstUser.idUser).toBe(idUser);
      });
    });

    it("should filter by idSecondUser", async () => {
      const idUser = sampleFriends[0].secondUser.idUser;
      const filterFriends = sampleFriends.filter(
        (friend: Friend) => friend.secondUser.idUser === idUser
      );
      mockFriendsModel.getAll.mockResolvedValue(filterFriends);
      const res = await request(app)
        .get("/friends")
        .query({ idSecondUser: idUser });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(filterFriends);
      res.body.forEach((friend: Friend) => {
        expect(friend.secondUser.idUser).toBe(idUser);
      });
    });

    it("should filter by both idFirstUser and idSecondUser", async () => {
      const idUser1 = sampleFriends[1].firstUser.idUser;
      const idUser2 = sampleFriends[1].secondUser.idUser;
      const filterFriends = sampleFriends.filter(
        (friend: Friend) =>
          friend.firstUser.idUser === idUser1 &&
          friend.secondUser.idUser === idUser2
      );
      mockFriendsModel.getAll.mockResolvedValue(filterFriends);
      const res = await request(app)
        .get("/friends")
        .query({ idFirstUser: idUser1, idSecondUser: idUser2 });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(filterFriends);
      res.body.forEach((friend: Friend) => {
        expect(friend.firstUser.idUser).toBe(idUser1);
        expect(friend.secondUser.idUser).toBe(idUser2);
      });
    });

    it("should filter by friendRequestState=true", async () => {
      const filterFriends = sampleFriends.filter(
        (friend: Friend) => friend.friendRequestState
      );
      mockFriendsModel.getAll.mockResolvedValue(filterFriends);
      const res = await request(app)
        .get("/friends")
        .query({ friendRequestState: true });
      expect(res.status).toBe(200);
      expect(res.body).toEqual(filterFriends);
      res.body.forEach((friend: Friend) => {
        expect(friend.friendRequestState).toBe(true);
      });
    });

    it("should filter by friendRequestState=false", async () => {
      const filterFriends = sampleFriends.filter(
        (friend: Friend) => !friend.friendRequestState
      );
      mockFriendsModel.getAll.mockResolvedValue(filterFriends);
      const res = await request(app)
        .get("/friends")
        .query({ friendRequestState: false });
      expect(res.status).toBe(200);
      expect(res.body).toEqual(filterFriends);
      res.body.forEach((friend: Friend) => {
        expect(friend.friendRequestState).toBe(false);
      });
    });
  });

  describe("GET /friends/:idFriend", () => {
    it("debe devolver un friend cuando el idFriend existe", async () => {
      const mockFriends: Friend = {
        idFriend: uuidv4(),
        friendRequestState: true,
        firstUser: {
          idUser: uuidv4(),
          urlImg: "https://example.com/image1.jpg",
          userName: "juan123",
          email: "juan@example.com",
        },
        secondUser: {
          idUser: uuidv4(),
          urlImg: "https://example.com/image2.jpg",
          userName: "maria456",
          email: "maria@example.com",
        },
      };

      mockFriendsModel.getById.mockResolvedValue(mockFriends);
      const uuid = mockFriends.idFriend;
      const response = await request(app).get(`/friends/${uuid}`);
      const expectedfriend = { ...mockFriends };

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expectedfriend);
    });

    it("debe devolver un error 404 cuando el idFriend no existe", async () => {
      mockFriendsModel.getById.mockResolvedValue(null); // Simula que no se encontró la tarea

      const response = await request(app).get(
        "/friends/4d3c22bf-d51e-4f55-ae4d-ee81477aab4e"
      );

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Amistad no encontrada" });
    });

    it("debe devolver un error 500 si ocurre un fallo en la base de datos", async () => {
      mockFriendsModel.getById.mockRejectedValue(new Error("Database error")); // Simula un error en la base de datos

      const response = await request(app).get(
        "/friends/4d3c22bf-d51e-4f55-ae4d-ee81477aab4e"
      );

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error interno del servidor" });
    });

    it("debe manejar correctamente un idFriend inválido (NaN)", async () => {
      const response = await request(app).get("/friends/invalid-id");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "El ID de la amistad debe ser válido",
      });
    });
  });

  describe("POST /friends", () => {
    const mockFriend: FriendCreate = {
      firstUser: uuidv4(),
      secondUser: uuidv4(),
      friendRequestState: false,
    };

    const mockNewFriend: FriendReturn = {
      idFriend: uuidv4(),
      ...mockFriend,
    };
    it("debe devolver un friend cuando los datos son correctos", async () => {
      mockFriendsModel.create.mockResolvedValue(mockNewFriend);

      const response = await request(app).post("/friends").send(mockFriend);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockNewFriend);
    });

    it("debe devolver un error 500 si ocurre un fallo en el controlador", async () => {
      mockFriendsModel.create.mockRejectedValue(new Error("Database error"));

      const response = await request(app).post("/friends").send(mockFriend);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error interno del servidor" });
    });

    it("debe devolver un error 400 si los datos de entrada no son válidos", async () => {
      const invalidFriend = {
        firstUser: uuidv4(),
        friendRequestState: false,
      };

      const response = await request(app).post("/friends").send(invalidFriend);

      expect(response.status).toBe(400);
      expect(response.body.error).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ["secondUser"],
            message: "Required",
          }),
        ])
      );
    });
  });

  describe("PUT /friends/:idFriend", () => {
    const idFriend = "4d3c22bf-d51e-4f55-ae4d-ee81477aab4e";

    const mockUpdatedfriend = {
      idFriend: idFriend,
      firstUser: "",
      secondUser: "",
      friendRequestState: true,
    };
    it("debe actualizar un friend cuando los datos son válidos", async () => {
      // Simula que la tarea se actualiza correctamente
      mockFriendsModel.update.mockResolvedValue(mockUpdatedfriend);

      const response = await request(app).put(`/friends/${idFriend}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUpdatedfriend);
    });

    it("debe devolver 404 si el friend no existe", async () => {
      // Simula que no se encuentra la tarea para la actualización
      mockFriendsModel.update.mockResolvedValue(null);

      const response = await request(app).put(`/friends/${idFriend}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Amistad no encontrada");
    });

    it("debe devolver 500 si ocurre un error en el servidor", async () => {
      // Simula un error interno en el servidor
      mockFriendsModel.update.mockRejectedValue(new Error("Error interno"));

      const response = await request(app).put(`/friends/${idFriend}`);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Error interno del servidor");
    });

    it("debería devolver un estado 400 si el id no es un UUID válido", async () => {
      const invalidId = "invalid-id";

      const response = await request(app).put(`/friends/${invalidId}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("El ID de la amistad debe ser válido");
    });
  });

  describe("DELETE /friends/:idFriend", () => {
    const mockFriendId = "550e8400-e29b-41d4-a716-446655440000";
    it("debería eliminar un friend existente y devolver un estado 200", async () => {
      // Simula que la tarea fue eliminada correctamente
      mockFriendsModel.delete.mockResolvedValue(true);

      const response = await request(app)
        .delete(`/friends/${mockFriendId}`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual(true);
    });

    it("debería devolver un estado 404 si el friend no existe", async () => {
      // Simula que no se encuentra la tarea para eliminar
      mockFriendsModel.delete.mockResolvedValue(false);

      const response = await request(app)
        .delete(`/friends/${mockFriendId}`)
        .send();

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Amistad no encontrada");
    });

    it("debería devolver un estado 500 si ocurre un error interno", async () => {
      // Simula un error interno en el servidor
      mockFriendsModel.delete.mockRejectedValue(new Error("Error interno"));

      const response = await request(app)
        .delete(`/friends/${mockFriendId}`)
        .send();

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Error interno del servidor");
    });

    it("debería devolver un estado 400 si el id no es un UUID válido", async () => {
      const invalidId = "invalid-id";

      const response = await request(app)
        .delete(`/friends/${invalidId}`)
        .send();

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("El ID de la amistad debe ser válido");
    });
  });
});
