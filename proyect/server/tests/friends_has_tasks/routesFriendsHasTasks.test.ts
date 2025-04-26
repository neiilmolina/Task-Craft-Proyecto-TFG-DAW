import createFriendsHasTasksRoutes from "@/src/friends_has_tasks/controller/http/routesFriendsHasTasks";
import IFriendsHasTasksDAO from "@/src/friends_has_tasks/model/dao/IFriendsHasTasksDAO";
import { Temporal } from "@js-temporal/polyfill";
import express from "express";
import request from "supertest";
import {
  FriendHasTasksCreate,
  FriendHasTasksFilters,
  validateFriendHasTasksCreate,
  validateFriendHasTasksFilters,
  FriendHasTasks,
  FriendHasTasksReturn,
} from "task-craft-models";
import { v4 as uuidv4 } from "uuid";

const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
});

describe("FriendsHasTasks Routes", () => {
  let app: express.Application;
  let mockFriendsHasTasksDAO: jest.Mocked<IFriendsHasTasksDAO>;
  mockFriendsHasTasksDAO = {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as unknown as jest.Mocked<IFriendsHasTasksDAO>;

  app = express();
  app.use(express.json());
  app.use(
    "/friendsHasTasks",
    createFriendsHasTasksRoutes(mockFriendsHasTasksDAO)
  );

  describe("GET /friendsHasTasks", () => {
    const sampleSharedTasks: FriendHasTasks[] = [];

    const creatorUser1 = {
      idUser: uuidv4(),
      userName: "Alice",
      email: "alice@example.com",
      urlImg: "https://example.com/alice.png",
    };

    const assignedUser1 = {
      idUser: uuidv4(),
      userName: "Bob",
      email: "bob@example.com",
      urlImg: "https://example.com/bob.png",
    };

    sampleSharedTasks.push({
      idFriendHasTasks: uuidv4(),
      creatorUser: creatorUser1,
      assignedUser: assignedUser1,
      friendHasTaskRequestState: false,
      task: {
        idTask: uuidv4(),
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
      idUser: uuidv4(),
      userName: "Charlie",
      email: "charlie@example.com",
      urlImg: "https://example.com/charlie.png",
    };

    const assignedUser2 = {
      idUser: uuidv4(),
      userName: "Dave",
      email: "dave@example.com",
      urlImg: "https://example.com/dave.png",
    };

    sampleSharedTasks.push({
      idFriendHasTasks: uuidv4(),
      creatorUser: creatorUser2,
      assignedUser: assignedUser2,
      friendHasTaskRequestState: false,
      task: {
        idTask: uuidv4(),
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
      idUser: uuidv4(),
      userName: "Eve",
      email: "eve@example.com",
      urlImg: "https://example.com/eve.png",
    };

    const assignedUser3 = {
      idUser: uuidv4(),
      userName: "Frank",
      email: "frank@example.com",
      urlImg: "https://example.com/frank.png",
    };

    sampleSharedTasks.push({
      idFriendHasTasks: uuidv4(),
      creatorUser: creatorUser3,
      assignedUser: assignedUser3,
      friendHasTaskRequestState: true,
      task: {
        idTask: uuidv4(),
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

    it("debe devolver un array de friends cuando la base de datos tiene datos", async () => {
      mockFriendsHasTasksDAO.getAll.mockResolvedValue(sampleSharedTasks);

      const res = await request(app).get("/friendsHasTasks");
      const receivedSharedTasks = res.body.map((request: FriendHasTasks) => ({
        ...request,
        task: {
          ...request.task,
          activityDate: Temporal.PlainDateTime.from(request.task.activityDate),
        },
      }));
      expect(res.status).toBe(200);
      expect(receivedSharedTasks).toEqual(sampleSharedTasks); // Aquí comparas contra lo mockeado directamente
      expect(mockFriendsHasTasksDAO.getAll).toHaveBeenCalledWith({});
    });

    it("debe devolver un array vacío cuando la base de datos no tiene datos", async () => {
      mockFriendsHasTasksDAO.getAll.mockResolvedValue([]);

      const res = await request(app).get("/friendsHasTasks");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
      expect(mockFriendsHasTasksDAO.getAll).toHaveBeenCalledWith({});
    });

    it("debe devolver un error 500 si falla la obtención de datos", async () => {
      mockFriendsHasTasksDAO.getAll.mockRejectedValue(new Error("DB error"));

      const res = await request(app).get("/friendsHasTasks");

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Error interno del servidor" });
      expect(mockFriendsHasTasksDAO.getAll).toHaveBeenCalled();
    });

    it("should filter by idCreatorUser", async () => {
      const idUser = sampleSharedTasks[0].creatorUser.idUser;
      const filterFriends = sampleSharedTasks.filter(
        (friendsHasTasks: FriendHasTasks) =>
          friendsHasTasks.creatorUser.idUser === idUser
      );
      mockFriendsHasTasksDAO.getAll.mockResolvedValue(filterFriends);
      const res = await request(app)
        .get("/friendsHasTasks")
        .query({ idCreatorUser: idUser });
      const receivedSharedTasks = res.body.map((request: FriendHasTasks) => ({
        ...request,
        task: {
          ...request.task,
          activityDate: Temporal.PlainDateTime.from(request.task.activityDate),
        },
      }));
      expect(res.status).toBe(200);
      expect(receivedSharedTasks).toEqual(receivedSharedTasks);
      res.body.forEach((friendsHasTasks: FriendHasTasks) => {
        expect(friendsHasTasks.creatorUser.idUser).toBe(idUser);
      });
    });

    it("should filter by idAssignedUser", async () => {
      const idUser = sampleSharedTasks[0].assignedUser.idUser;
      const filterFriends = sampleSharedTasks.filter(
        (friendsHasTasks: FriendHasTasks) =>
          friendsHasTasks.assignedUser.idUser === idUser
      );
      const filters: FriendHasTasksFilters = {
        idAssignedUser: idUser,
      };
      mockFriendsHasTasksDAO.getAll.mockResolvedValue(filterFriends);
      const res = await request(app).get("/friendsHasTasks").query(filters);
      const receivedSharedTasks = res.body.map((request: FriendHasTasks) => ({
        ...request,
        task: {
          ...request.task,
          activityDate: Temporal.PlainDateTime.from(request.task.activityDate),
        },
      }));
      expect(res.status).toBe(200);
      expect(receivedSharedTasks).toEqual(receivedSharedTasks);
      res.body.forEach((friendsHasTasks: FriendHasTasks) => {
        expect(friendsHasTasks.assignedUser.idUser).toBe(idUser);
      });
    });

    it("should filter by both idCreatorUser and idAssignedUser", async () => {
      const idUser1 = sampleSharedTasks[1].creatorUser.idUser;
      const idUser2 = sampleSharedTasks[1].assignedUser.idUser;
      const filterFriends = sampleSharedTasks.filter(
        (friendsHasTasks: FriendHasTasks) =>
          friendsHasTasks.creatorUser.idUser === idUser1 &&
          friendsHasTasks.assignedUser.idUser === idUser2
      );
      const filters: FriendHasTasksFilters = {
        idAssignedUser: idUser2,
        idCreatorUser: idUser1,
      };
      mockFriendsHasTasksDAO.getAll.mockResolvedValue(filterFriends);
      const res = await request(app).get("/friendsHasTasks").query(filters);
      const receivedSharedTasks = res.body.map((request: FriendHasTasks) => ({
        ...request,
        task: {
          ...request.task,
          activityDate: Temporal.PlainDateTime.from(request.task.activityDate),
        },
      }));
      expect(res.status).toBe(200);
      expect(receivedSharedTasks).toEqual(receivedSharedTasks);
      res.body.forEach((friendsHasTasks: FriendHasTasks) => {
        expect(friendsHasTasks.creatorUser.idUser).toBe(idUser1);
        expect(friendsHasTasks.assignedUser.idUser).toBe(idUser2);
      });
    });

    it("should filter by friendHasTaskRequestState=true", async () => {
      const filterFriends = sampleSharedTasks.filter(
        (friendsHasTasks: FriendHasTasks) =>
          friendsHasTasks.friendHasTaskRequestState
      );
      mockFriendsHasTasksDAO.getAll.mockResolvedValue(filterFriends);
      const res = await request(app)
        .get("/friendsHasTasks")
        .query({ friendHasTaskRequestState: true });
      const receivedSharedTasks = res.body.map((request: FriendHasTasks) => ({
        ...request,
        task: {
          ...request.task,
          activityDate: Temporal.PlainDateTime.from(request.task.activityDate),
        },
      }));
      expect(res.status).toBe(200);
      expect(receivedSharedTasks).toEqual(receivedSharedTasks);
      res.body.forEach((friendsHasTasks: FriendHasTasks) => {
        expect(friendsHasTasks.friendHasTaskRequestState).toBe(true);
      });
    });

    it("should filter by friendHasTaskRequestState=false", async () => {
      const filterFriends = sampleSharedTasks.filter(
        (friendsHasTasks: FriendHasTasks) =>
          !friendsHasTasks.friendHasTaskRequestState
      );
      mockFriendsHasTasksDAO.getAll.mockResolvedValue(filterFriends);
      const res = await request(app)
        .get("/friendsHasTasks")
        .query({ friendHasTaskRequestState: false });
      const receivedSharedTasks = res.body.map((request: FriendHasTasks) => ({
        ...request,
        task: {
          ...request.task,
          activityDate: Temporal.PlainDateTime.from(request.task.activityDate),
        },
      }));
      expect(res.status).toBe(200);
      expect(receivedSharedTasks).toEqual(receivedSharedTasks);
      res.body.forEach((friendsHasTasks: FriendHasTasks) => {
        expect(friendsHasTasks.friendHasTaskRequestState).toBe(false);
      });
    });

    it("should return all friends where the user appears as either firstUser or secondUser (OR logic via HTTP)", async () => {
      const idUser = sampleSharedTasks[0].creatorUser.idUser;

      // Simula que el usuario está en cualquiera de las dos posiciones
      const filterFriends = sampleSharedTasks.filter(
        (friendsHasTasks: FriendHasTasks) =>
          friendsHasTasks.creatorUser.idUser === idUser ||
          friendsHasTasks.assignedUser.idUser === idUser
      );

      const filters: FriendHasTasksFilters = {
        idCreatorUser: idUser,
        idAssignedUser: idUser,
      };
      mockFriendsHasTasksDAO.getAll.mockResolvedValue(filterFriends);

      const res = await request(app).get("/friendsHasTasks").query(filters);
      const receivedSharedTasks = res.body.map((request: FriendHasTasks) => ({
        ...request,
        task: {
          ...request.task,
          activityDate: Temporal.PlainDateTime.from(request.task.activityDate),
        },
      }));
      expect(res.status).toBe(200);
      expect(receivedSharedTasks).toEqual(receivedSharedTasks);

      res.body.forEach((friendsHasTasks: FriendHasTasks) => {
        const isFirst = friendsHasTasks.creatorUser.idUser === idUser;
        const isSecond = friendsHasTasks.assignedUser.idUser === idUser;
        expect(isFirst || isSecond).toBe(true);
      });
    });
  });

  describe("GET /friendsHasTasks/:idFriendHasTasks", () => {
    it("debe devolver una tarea compartida cuando el idFriendHasTasks existe", async () => {
      const creatorUser1 = {
        idUser: uuidv4(),
        userName: "Alice",
        email: "alice@example.com",
        urlImg: "https://example.com/alice.png",
      };

      const assignedUser1 = {
        idUser: uuidv4(),
        userName: "Bob",
        email: "bob@example.com",
        urlImg: "https://example.com/bob.png",
      };
      // Mockea la respuesta de la base de datos
      const mockSharedTasks = {
        idFriendHasTasks: uuidv4(),
        creatorUser: creatorUser1,
        assignedUser: assignedUser1,
        friendHasTaskRequestState: false,
        task: {
          idTask: uuidv4(),
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
      };

      mockFriendsHasTasksDAO.getById.mockResolvedValue(mockSharedTasks); // Mockea la llamada al repositorio
      console.log(mockSharedTasks.idFriendHasTasks);
      const response = await request(app).get(
        `/friendsHasTasks/${mockSharedTasks.idFriendHasTasks}`
      );

      const expectedSharedTask = {
        ...mockSharedTasks,
        task: {
          ...mockSharedTasks.task,
          activityDate: mockSharedTasks.task.activityDate.toString(), // aquí es donde debe convertirse
        },
      };

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expectedSharedTask);
    });

    it("debe devolver un error 404 cuando el idFriendHasTasks no existe", async () => {
      mockFriendsHasTasksDAO.getById.mockResolvedValue(null); // Simula que no se encontró la tarea

      const response = await request(app).get(
        "/friendsHasTasks/4d3c22bf-d51e-4f55-ae4d-ee81477aab4e"
      );

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: "Tarea compartida no encontrada",
      });
    });

    it("debe devolver un error 500 si ocurre un fallo en la base de datos", async () => {
      mockFriendsHasTasksDAO.getById.mockRejectedValue(
        new Error("Database error")
      ); // Simula un error en la base de datos

      const response = await request(app).get(
        "/friendsHasTasks/4d3c22bf-d51e-4f55-ae4d-ee81477aab4e"
      );

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error interno del servidor" });
    });

    it("debe manejar correctamente un idFriendHasTasks inválido (NaN)", async () => {
      const response = await request(app).get("/friendsHasTasks/invalid-id");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "El ID de la tarea compartida debe ser válido",
      });
    });
  });

  describe("POST /friendsHasTasks", () => {
    const mockFriend: FriendHasTasksCreate = {
      idTask: uuidv4(),
      idAssignedUser: uuidv4(),
      friendHasTaskRequestState: false,
    };

    const mockNewFriend: FriendHasTasksReturn = {
      idFriendHasTasks: uuidv4(),
      ...mockFriend,
    };
    it("debe devolver un friend cuando los datos son correctos", async () => {
      mockFriendsHasTasksDAO.create.mockResolvedValue(mockNewFriend);

      const response = await request(app)
        .post("/friendsHasTasks")
        .send(mockFriend);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockNewFriend);
    });

    it("debe devolver un error 500 si ocurre un fallo en el controlador", async () => {
      mockFriendsHasTasksDAO.create.mockRejectedValue(
        new Error("Database error")
      );

      const response = await request(app)
        .post("/friendsHasTasks")
        .send(mockFriend);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error interno del servidor" });
    });

    it("debe devolver un error 400 si los datos de entrada no son válidos", async () => {
      const invalidFriend = {
        firstUser: uuidv4(),
        friendRequestState: false,
      };

      const response = await request(app)
        .post("/friendsHasTasks")
        .send(invalidFriend);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
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
        error: "Error de validación",
      });
    });
  });

  describe("PUT /friendsHasTasks/:idFriendsHasTasks", () => {
    const idFriendsHasTasks = "4d3c22bf-d51e-4f55-ae4d-ee81477aab4e";

    const mockUpdateSharedTask: FriendHasTasksReturn = {
      idFriendHasTasks: idFriendsHasTasks,
      idTask: "",
      idAssignedUser: "",
      friendHasTaskRequestState: true,
    };
    it("debe actualizar una tarea compartida cuando los datos son válidos", async () => {
      // Simula que la tarea se actualiza correctamente
      mockFriendsHasTasksDAO.update.mockResolvedValue(mockUpdateSharedTask);

      const response = await request(app).put(
        `/friendsHasTasks/${idFriendsHasTasks}`
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUpdateSharedTask);
    });

    it("debe devolver 404 si la tarea compartida no existe", async () => {
      // Simula que no se encuentra la tarea para la actualización
      mockFriendsHasTasksDAO.update.mockResolvedValue(null);

      const response = await request(app).put(
        `/friendsHasTasks/${idFriendsHasTasks}`
      );

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Tarea compartida no encontrada");
    });

    it("debe devolver 500 si ocurre un error en el servidor", async () => {
      // Simula un error interno en el servidor
      mockFriendsHasTasksDAO.update.mockRejectedValue(
        new Error("Error interno")
      );

      const response = await request(app).put(
        `/friendsHasTasks/${idFriendsHasTasks}`
      );

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Error interno del servidor");
    });

    it("debería devolver un estado 400 si el id no es un UUID válido", async () => {
      const invalidId = "invalid-id";

      const response = await request(app).put(`/friendsHasTasks/${invalidId}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe(
        "El ID de la tarea compartida debe ser válido"
      );
    });
  });

  describe("DELETE /friendsHasTasks/:idFriendsHasTasks", () => {
    const mockFriendId = "550e8400-e29b-41d4-a716-446655440000";
    it("debería eliminar un friend existente y devolver un estado 200", async () => {
      // Simula que la tarea fue eliminada correctamente
      mockFriendsHasTasksDAO.delete.mockResolvedValue(true);

      const response = await request(app)
        .delete(`/friendsHasTasks/${mockFriendId}`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual(true);
    });

    it("debería devolver un estado 404 si el friend no existe", async () => {
      // Simula que no se encuentra la tarea para eliminar
      mockFriendsHasTasksDAO.delete.mockResolvedValue(false);

      const response = await request(app)
        .delete(`/friendsHasTasks/${mockFriendId}`)
        .send();

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Tarea compartida no encontrada");
    });

    it("debería devolver un estado 500 si ocurre un error interno", async () => {
      // Simula un error interno en el servidor
      mockFriendsHasTasksDAO.delete.mockRejectedValue(
        new Error("Error interno")
      );

      const response = await request(app)
        .delete(`/friendsHasTasks/${mockFriendId}`)
        .send();

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Error interno del servidor");
    });

    it("debería devolver un estado 400 si el id no es un UUID válido", async () => {
      const invalidId = "invalid-id";

      const response = await request(app)
        .delete(`/friendsHasTasks/${invalidId}`)
        .send();

      expect(response.status).toBe(400);
      expect(response.body.error).toBe(
        "El ID de la tarea compartida debe ser válido"
      );
    });
  });
});
