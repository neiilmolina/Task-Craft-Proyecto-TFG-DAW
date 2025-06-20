import createTasksRoute from "../../src/tasks/controller/routesTasks";
import express from "express";
import request from "supertest";
import ITasksDAO from "../../src/tasks/model/dao/ITasksDAO";
import { Task, TaskReturn } from "task-craft-models";
import { Temporal } from "@js-temporal/polyfill";
import { randomUUID } from "crypto";

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
  afterEach(() => {
    jest.restoreAllMocks();
  });
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
        idTask: randomUUID(),
        title: "Tarea de ejemplo 1",
        description: "Descripción de prueba 1",
        activityDate: Temporal.PlainDateTime.from("2025-04-11T10:00:00"), // Usar Temporal
        state: { idState: 1, state: "Pendiente" },
        type: { idType: 1, type: "Trabajo", color: "#ff0000" },
        idUser: "bb89888b-2921-453f-b8c2-49dc2668595f",
      },
      {
        idTask: randomUUID(),
        title: "Tarea de ejemplo 2",
        description: "Descripción de prueba 2",
        activityDate: Temporal.PlainDateTime.from("2025-04-12T14:30:00"),
        state: { idState: 2, state: "En Progreso" },
        type: { idType: 2, type: "Reunión", color: "#00ff00" },
        idUser: "aaccbbdd-2921-453f-b8c2-49dc2668595f",
      },
      {
        idTask: randomUUID(),
        title: "Tarea de ejemplo 3",
        description: "Descripción de prueba 3",
        activityDate: Temporal.PlainDateTime.from("2025-04-13T09:00:00"),
        state: { idState: 3, state: "Completada" },
        type: { idType: 3, type: "Mantenimiento", color: "#0000ff" },
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
      expect(mockTaskModel.getAll).toHaveBeenCalledWith({});
    });

    it("debe devolver un array vacío cuando la base de datos no tiene datos", async () => {
      mockTaskModel.getAll.mockResolvedValue([]);

      const res = await request(app).get("/tasks");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
      expect(mockTaskModel.getAll).toHaveBeenCalledWith({});
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
      expect(mockTaskModel.getAll).toHaveBeenCalledWith({ idUser: idUser });
    });

    it("debe devolver un error 400 si el idUser es inválido", async () => {
      const res = await request(app).get("/tasks?idUser=invalid-id");

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        details: [
          {
            field: "idUser",
            message: "Invalid uuid",
          },
        ],
        error: "Error de validación en los filtros de tareas",
      });
      expect(mockTaskModel.getAll).not.toHaveBeenCalled();
    });

    it("debe filtrar tasks por idUser cuando se proporciona un id válido", async () => {
      const idUser = "bb89888b-2921-453f-b8c2-49dc2668595f";
      mockTaskModel.getAll.mockResolvedValue(sampleTasks);

      const res = await request(app).get(`/tasks?idUser=${idUser}`);

      expect(res.status).toBe(200);
      expect(mockTaskModel.getAll).toHaveBeenCalledWith({ idUser });
    });

    it("debe filtrar tasks por estado cuando se proporciona un estado válido", async () => {
      const state = "Pendiente";
      mockTaskModel.getAll.mockResolvedValue(sampleTasks);

      const res = await request(app).get(`/tasks?state=${state}`);

      expect(res.status).toBe(200);
      expect(mockTaskModel.getAll).toHaveBeenCalledWith({ state: state });
    });

    it("debe filtrar tasks por tipo cuando se proporciona un tipo válido", async () => {
      const type = "Trabajo";
      mockTaskModel.getAll.mockResolvedValue(sampleTasks);

      const res = await request(app).get(`/tasks?type=${type}`);

      expect(res.status).toBe(200);
      expect(mockTaskModel.getAll).toHaveBeenCalledWith({ type: type });
    });

    it("debe filtrar tasks por título cuando se proporciona un título válido", async () => {
      const title = "Tarea de ejemplo";
      mockTaskModel.getAll.mockResolvedValue(sampleTasks);

      const res = await request(app).get(`/tasks?title=${title}`);

      expect(res.status).toBe(200);
      expect(mockTaskModel.getAll).toHaveBeenCalledWith({ title: title });
    });

    it("debe filtrar tasks por fecha futura cuando se proporciona una fecha válida", async () => {
      const futureDate = Temporal.Now.plainDateTimeISO()
        .add({ days: 1 })
        .toString();
      mockTaskModel.getAll.mockResolvedValue(sampleTasks);

      const res = await request(app).get(`/tasks?futureDate=${futureDate}`);

      expect(res.status).toBe(200);
      expect(mockTaskModel.getAll).toHaveBeenCalledWith({ futureDate });
    });

    it("debe filtrar tasks por fecha pasada cuando se proporciona una fecha válida", async () => {
      const pastDate = "2025-04-10T00:00:00";
      mockTaskModel.getAll.mockResolvedValue(sampleTasks);

      const res = await request(app).get(`/tasks?pastDate=${pastDate}`);

      expect(res.status).toBe(200);
      expect(mockTaskModel.getAll).toHaveBeenCalledWith({ pastDate });
    });

    it("debe filtrar tasks por un rango de fechas cuando se proporcionan fechas válidas", async () => {
      const pastDate = "2025-04-10T00:00:00";
      const futureDate = Temporal.Now.plainDateTimeISO()
        .add({ days: 1 })
        .toString();
      mockTaskModel.getAll.mockResolvedValue(sampleTasks);

      const res = await request(app).get(
        `/tasks?pastDate=${pastDate}&futureDate=${futureDate}`
      );

      expect(res.status).toBe(200);
      expect(mockTaskModel.getAll).toHaveBeenCalledWith({
        pastDate,
        futureDate,
      });
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
        error: "El ID de la tarea debe ser válido",
      });
    });
  });

  describe("POST /tasks", () => {
    const mockTaskData = {
      title: "Tarea de ejemplo",
      description: "Descripción de prueba",
      activityDate: Temporal.Now.plainDateTimeISO().add({ days: 1 }).toString(),
      idState: 1,
      idType: 1,
      idUser: "bb89888b-2921-453f-b8c2-49dc2668595f",
    };

    const mockNewTask: TaskReturn = {
      idTask: "4d3c22bf-d51e-4f55-ae4d-ee81477aab4e",
      title: mockTaskData.title,
      description: mockTaskData.description,
      activityDate: Temporal.PlainDateTime.from(mockTaskData.activityDate), // Sigue usando PlainDateTime
      idState: 1,
      idType: 1,
      idUser: "bb89888b-2921-453f-b8c2-49dc2668595f",
    };
    it("debe devolver un task cuando los datos son correctos", async () => {
      mockTaskModel.create.mockResolvedValue(mockNewTask); // Simula la creación de una tarea

      const response = await request(app).post("/tasks").send(mockTaskData);

      expect(response.status).toBe(200);
      expect(response.body.activityDate).toEqual(
        mockNewTask.activityDate.toString()
      ); // Compara las fechas como strings
    });

    it("debe devolver un error 500 si ocurre un fallo en el controlador", async () => {
      mockTaskModel.create.mockRejectedValue(new Error("Database error")); // Simula un error en la creación

      const response = await request(app).post("/tasks").send(mockTaskData);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error interno del servidor" });
    });

    it("debe devolver un error 400 si los datos de entrada no son válidos", async () => {
      const invalidTaskData = {
        title: "Tarea de ejemplo",
        // Falta descripción
        activityDate: "2025-04-11T10:00:00",
        idState: 1,
        type: 1,
        idUser: "bb89888b-2921-453f-b8c2-49dc2668595f",
      };

      const response = await request(app).post("/tasks").send(invalidTaskData);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        details: [
          { field: "description", message: "Required" },
          {
            field: "activityDate",
            message: "fecha debe ser una fecha futura válida",
          },
          { field: "idType", message: "Required" },
        ],
        error: "Error de validación",
      });
    });
  });

  describe("PUT /tasks/:idTask", () => {
    const idTask = "4d3c22bf-d51e-4f55-ae4d-ee81477aab4e";
    it("debe actualizar un task cuando los datos son válidos", async () => {
      const mockTaskData = {
        title: "Tarea actualizada",
        description: "Descripción actualizada",
        activityDate: Temporal.Now.plainDateTimeISO()
          .add({ days: 1 })
          .toString(),
        idState: 2,
        idType: 1,
        idUser: "bb89888b-2921-453f-b8c2-49dc2668595f",
      };

      const mockUpdatedTask = {
        idTask: idTask,
        ...mockTaskData,
      };
      const mockUpdatedTaskReturn: TaskReturn = {
        idTask: mockUpdatedTask.idTask,
        title: mockUpdatedTask.title,
        description: mockUpdatedTask.description,
        activityDate: Temporal.PlainDateTime.from(mockUpdatedTask.activityDate),
        idState: mockUpdatedTask.idState,
        idType: mockUpdatedTask.idType,
        idUser: mockTaskData.idUser,
      };

      // Simula que la tarea se actualiza correctamente
      mockTaskModel.update.mockResolvedValue(mockUpdatedTaskReturn);

      const response = await request(app)
        .put(`/tasks/${idTask}`)
        .send(mockTaskData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUpdatedTask);
    });

    it("debe devolver 400 si la validación falla", async () => {
      const invalidTaskData = {
        // Falta descripción
        title: "Tarea incompleta",
        activityDate: Temporal.Now.plainDateTimeISO()
          .add({ days: 1 })
          .toString(),
        idState: 2,
        idType: "fdfds",
        idUser: "bb89888b-2921-453f-b8c2-49dc2668595f",
      };

      const response = await request(app)
        .put(`/tasks/${idTask}`)
        .send(invalidTaskData);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        details: [
          { field: "idType", message: "Expected number, received string" },
        ],
        error: "Error de validación",
      });
    });

    it("debe devolver 404 si el task no existe", async () => {
      const mockTaskData = {
        title: "Tarea de ejemplo",
        description: "Descripción de prueba",
        activityDate: Temporal.Now.plainDateTimeISO()
          .add({ days: 1 })
          .toString(),
        idState: 1,
        idType: 1,
        idUser: "bb89888b-2921-453f-b8c2-49dc2668595f",
      };

      // Simula que no se encuentra la tarea para la actualización
      mockTaskModel.update.mockResolvedValue(null);

      const response = await request(app)
        .put(`/tasks/${idTask}`)
        .send(mockTaskData);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Tarea no encontrada");
    });

    it("debe devolver 500 si ocurre un error en el servidor", async () => {
      const mockTaskData = {
        title: "Tarea de ejemplo",
        description: "Descripción de prueba",
        activityDate: Temporal.Now.plainDateTimeISO()
          .add({ days: 1 })
          .toString(),
        idState: 1,
        idType: 1,
        idUser: "bb89888b-2921-453f-b8c2-49dc2668595f",
      };

      // Simula un error interno en el servidor
      mockTaskModel.update.mockRejectedValue(new Error("Error interno"));

      const response = await request(app)
        .put(`/tasks/${idTask}`)
        .send(mockTaskData);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Error interno del servidor");
    });
  });

  describe("DELETE /tasks/:idTask", () => {
    const mockTaskId = "550e8400-e29b-41d4-a716-446655440000";
    it("debería eliminar un task existente y devolver un estado 200", async () => {
      // Simula que la tarea fue eliminada correctamente
      mockTaskModel.delete.mockResolvedValue(true);

      const response = await request(app).delete(`/tasks/${mockTaskId}`).send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual(true);
    });

    it("debería devolver un estado 404 si el task no existe", async () => {
      // Simula que no se encuentra la tarea para eliminar
      mockTaskModel.delete.mockResolvedValue(false);

      const response = await request(app).delete(`/tasks/${mockTaskId}`).send();

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Tarea no encontrada");
    });

    it("debería devolver un estado 500 si ocurre un error interno", async () => {
      // Simula un error interno en el servidor
      mockTaskModel.delete.mockRejectedValue(new Error("Error interno"));

      const response = await request(app).delete(`/tasks/${mockTaskId}`).send();

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Error interno del servidor");
    });

    it("debería devolver un estado 400 si el id no es un UUID válido", async () => {
      const invalidId = "invalid-id";

      const response = await request(app).delete(`/tasks/${invalidId}`).send();

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("El ID de la tarea debe ser válido");
    });
  });
});
