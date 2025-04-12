import createTasksRoute from "@/src/tasks/controller/routesTasks";
import express from "express";
import request from "supertest";
import ITasksDAO from "@/src/tasks/model/dao/ITasksDAO";
import {
  Task,
  TaskCreate,
  TaskReturn,
  TaskUpdate,
} from "@/src/tasks/model/interfaces/interfacesTasks";
import { Temporal } from "@js-temporal/polyfill";

const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
});

describe("Tasks Routes", () => {
  let app: express.Application;
  let mockTaskModel: jest.Mocked<ITasksDAO>;

  beforeEach(() => {
    mockTaskModel = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<ITasksDAO>;

    app = express();
    app.use(express.json());
    app.use("/tasks", createTasksRoute(mockTaskModel));
  });

  describe("GET /tasks", () => {
    const sampleTasks: Task[] = [
      {
        idTask: "4d3c22bf-d51e-4f55-ae4d-ee81477aab4e",
        title: "Tarea de ejemplo",
        description: "Descripción de prueba",
        activityDate: Temporal.PlainDateTime.from("2025-04-11T10:00:00"), // Usar Temporal
        state: { idState: 1, state: "Pendiente" },
        type: { idType: 1, type: "Trabajo", color: "#ff0000" },
        idUser: "bb89888b-2921-453f-b8c2-49dc2668595f",
      },
    ];

    it("debe devolver un array de tasks cuando la base de datos tiene datos", async () => {
      mockTaskModel.getAll.mockResolvedValue(sampleTasks);

      const res = await request(app).get("/tasks");

      // Convertir la fecha de la respuesta a Temporal.PlainDateTime
      const receivedTasks = res.body.map((task: Task) => ({
        ...task,
        activityDate: Temporal.PlainDateTime.from(task.activityDate),
      }));

      expect(res.status).toBe(200);
      expect(receivedTasks).toEqual(sampleTasks);
      expect(mockTaskModel.getAll).toHaveBeenCalledWith(undefined);
    });

    it("debe devolver un array vacío cuando la base de datos no tiene datos", async () => {
      mockTaskModel.getAll.mockResolvedValue([]);

      const res = await request(app).get("/tasks");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
      expect(mockTaskModel.getAll).toHaveBeenCalledWith(undefined);
    });

    it("debe devolver un error 500 si falla la obtención de datos", async () => {
      mockTaskModel.getAll.mockRejectedValue(new Error("DB error"));

      const res = await request(app).get("/tasks");

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Error interno del servidor" });
      expect(mockTaskModel.getAll).toHaveBeenCalled();
    });

    it("debe filtrar tasks por idUser cuando se proporciona un id válido", async () => {
      const idUser = "123e4567-e89b-12d3-a456-426614174000"; // UUID válido
      mockTaskModel.getAll.mockResolvedValue(sampleTasks);

      const res = await request(app).get(`/tasks?idUser=${idUser}`);

      expect(res.status).toBe(200);
      expect(mockTaskModel.getAll).toHaveBeenCalledWith(idUser);
    });

    it("debe devolver un error 400 si el idUser es inválido", async () => {
      const res = await request(app).get("/tasks?idUser=invalid-id");

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "El ID del user debe ser válido" });
      expect(mockTaskModel.getAll).not.toHaveBeenCalled();
    });
  });

  describe("GET /tasks/:idTask", () => {
    it("debe devolver un task cuando el idTask existe", async () => {
      // Mockea la respuesta de la base de datos
      const mockTask = {
        idTask: "4d3c22bf-d51e-4f55-ae4d-ee81477aab4e",
        title: "Tarea de ejemplo",
        description: "Descripción de prueba",
        activityDate: Temporal.PlainDateTime.from("2025-04-11T10:00:00"),
        state: { idState: 1, state: "Pendiente" },
        type: { idType: 1, type: "Trabajo", color: "#ff0000" },
        idUser: "bb89888b-2921-453f-b8c2-49dc2668595f",
      };

      mockTaskModel.getById.mockResolvedValue(mockTask); // Mockea la llamada al repositorio

      const response = await request(app).get(
        "/tasks/4d3c22bf-d51e-4f55-ae4d-ee81477aab4e"
      );
      const expectedTask = {
        ...mockTask,
        activityDate: mockTask.activityDate.toString(), // Convertir la fecha a cadena
      };

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expectedTask);
    });

    it("debe devolver un error 404 cuando el idTask no existe", async () => {
      mockTaskModel.getById.mockResolvedValue(null); // Simula que no se encontró la tarea

      const response = await request(app).get(
        "/tasks/4d3c22bf-d51e-4f55-ae4d-ee81477aab4e"
      );

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Tarea no encontrada" });
    });

    it("debe devolver un error 500 si ocurre un fallo en la base de datos", async () => {
      mockTaskModel.getById.mockRejectedValue(new Error("Database error")); // Simula un error en la base de datos

      const response = await request(app).get(
        "/tasks/4d3c22bf-d51e-4f55-ae4d-ee81477aab4e"
      );

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error interno del servidor" });
    });

    it("debe manejar correctamente un idTask inválido (NaN)", async () => {
      const response = await request(app).get("/tasks/invalid-id");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "El ID del user debe ser válido",
      });
    });
  });

  describe("POST /tasks", () => {
    it("debe devolver un task cuando los datos son correctos", async () => {
      const mockTaskData = {
        title: "Tarea de ejemplo",
        description: "Descripción de prueba",
        activityDate: "2025-04-11 10:00:00",
        state: { idState: 1, state: "Pendiente" },
        type: { idType: 1, type: "Trabajo", color: "#ff0000" },
        idUser: "bb89888b-2921-453f-b8c2-49dc2668595f",
      };

      const mockNewTask: TaskReturn = {
        idTask: "4d3c22bf-d51e-4f55-ae4d-ee81477aab4e",
        title: mockTaskData.title,
        description: mockTaskData.description,
        activityDate: Temporal.PlainDateTime.from(mockTaskData.activityDate),
        idState: 1,
        idType: 1,
        idUser: "bb89888b-2921-453f-b8c2-49dc2668595f",
      };

      mockTaskModel.create.mockResolvedValue(mockNewTask); // Simula la creación de una tarea

      const response = await request(app).post("/tasks").send(mockTaskData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockNewTask);
    });

    it("debe devolver un error 404 si el user no existe", async () => {
      const mockTaskData = {
        title: "Tarea de ejemplo",
        description: "Descripción de prueba",
        activityDate: "2025-04-11T10:00:00",
        state: { idState: 1, state: "Pendiente" },
        type: { idType: 1, type: "Trabajo", color: "#ff0000" },
        idUser: "non-existent-user", // Usuario no existente
      };

      mockTaskModel.create.mockResolvedValue(null); // Simula que no se puede crear la tarea

      const response = await request(app).post("/tasks").send(mockTaskData);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Usuario no encontrado" }); // Error relacionado con usuario no encontrado
    });

    it("debe devolver un error 500 si ocurre un fallo en el controlador", async () => {
      const mockTaskData = {
        title: "Tarea de ejemplo",
        description: "Descripción de prueba",
        activityDate: "2025-04-11T10:00:00",
        state: { idState: 1, state: "Pendiente" },
        type: { idType: 1, type: "Trabajo", color: "#ff0000" },
        idUser: "bb89888b-2921-453f-b8c2-49dc2668595f",
      };

      mockTaskModel.create.mockRejectedValue(new Error("Database error")); // Simula un error en la creación

      const response = await request(app).post("/tasks").send(mockTaskData);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error interno del servidor" });
    });

    it("debe devolver un error 400 si los datos de entrada no son válidos", async () => {
      const invalidTaskData = {
        // Datos inválidos (falta campo necesario)
        title: "Tarea de ejemplo",
        // Falta descripción
        activityDate: "2025-04-11T10:00:00",
        state: { idState: 1, state: "Pendiente" },
        type: { idType: 1, type: "Trabajo", color: "#ff0000" },
        idUser: "bb89888b-2921-453f-b8c2-49dc2668595f",
      };

      const response = await request(app).post("/tasks").send(invalidTaskData);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Datos de tarea no válidos" }); // Error de validación de datos
    });
  });
});
