import { ResultSetHeader } from "mysql2";
import mysql from "@/tests/__mocks__/mysql";
import {
  Task,
  TaskBD,
  TaskCreate,
  TaskReturn,
  TaskUpdate,
} from "@/src/tasks/model/interfaces/interfacesTasks";
import TaskMysqlDAO from "@/src/tasks/model/dao/TasksMysqlDAO";
import { Temporal } from "@js-temporal/polyfill";

jest.mock("mysql2", () => ({
  createConnection: mysql.createConnection,
}));

describe("TaskMysqlDAO", () => {
  let taskDAO: TaskMysqlDAO;
  beforeEach(() => {
    taskDAO = new TaskMysqlDAO();

    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("getAll", () => {
    const mockResultsList: TaskBD[] = [
      {
        idTarea: "1",
        titulo: "Task 1",
        descripcion: "Description 1",
        fechaActividad: new Temporal.PlainDateTime(2023, 10, 1, 0, 0, 0),
        idEstado: 1,
        estado: "Pending",
        idTipo: 1,
        tipo: "Type 1",
        color: "#FFFFFF",
        idUsuario: "user1",
      },
      {
        idTarea: "2",
        titulo: "Task 2",
        descripcion: "Description 2",
        fechaActividad: new Temporal.PlainDateTime(2023, 10, 1, 0, 0, 0),
        idEstado: 2,
        estado: "In Progress",
        idTipo: 2,
        tipo: "Type 2",
        color: "#FFFFFF",
        idUsuario: "user2",
      },
    ];

    it("should return an array of tasks when query is successful", async () => {
      const mockConnection = mysql.createConnection();

      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[] | ((err: Error | null, results?: any[]) => void),
          callback?: (err: Error | null, results?: any[]) => void
        ) => {
          if (typeof params === "function") {
            params(null, mockResultsList);
          } else if (callback) {
            callback(null, mockResultsList);
          }
          return {} as any;
        }
      );

      const tasks = await taskDAO.getAll();

      const expectedResults: Task[] = mockResultsList.map((row) => ({
        idTask: row.idTarea,
        title: row.titulo,
        description: row.descripcion,
        activityDate: row.fechaActividad,
        state: {
          idState: row.idEstado,
          state: row.estado,
        },
        type: {
          idType: row.idTipo,
          type: row.tipo,
          color: row.color,
        },
        idUser: row.idUsuario,
      }));

      expect(tasks).toEqual(expectedResults);
      expect(mockConnection.query).toHaveBeenCalledTimes(1);
      expect(tasks[0].activityDate instanceof Temporal.PlainDateTime).toBe(
        true
      );
    });

    it("should throw an error if query fails", async () => {
      const mockConnection = mysql.createConnection();

      const mockError = new Error("Database error");

      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[] | ((err: Error | null, results?: any[]) => void),
          callback?: (err: Error | null, results?: any[]) => void
        ) => {
          if (typeof params === "function") {
            params(mockError);
          } else if (callback) {
            callback(mockError);
          }
        }
      );

      await expect(taskDAO.getAll()).rejects.toThrow("Database error");
    });

    it("should throw an error if results are not an array", async () => {
      const mockConnection = mysql.createConnection();

      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[] | ((err: Error | null, results?: any[]) => void),
          callback?: (err: Error | null, results?: any[]) => void
        ) => {
          const fakeResults = { not: "an array" };
          if (typeof params === "function") {
            params(null, fakeResults as any);
          } else if (callback) {
            callback(null, fakeResults as any);
          }
        }
      );

      await expect(taskDAO.getAll()).rejects.toThrow(
        "Expected array of results but got something else."
      );
    });

    it("should return an empty array if no tasks are found", async () => {
      const mockConnection = mysql.createConnection();

      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[] | ((err: Error | null, results?: any[]) => void),
          callback?: (err: Error | null, results?: any[]) => void
        ) => {
          if (typeof params === "function") {
            params(null, []);
          } else if (callback) {
            callback(null, []);
          }
        }
      );

      const tasks = await taskDAO.getAll();
      expect(tasks).toEqual([]);
    });

    it("should handle filtering tasks by idUser", async () => {
      const mockConnection = mysql.createConnection();
      const idUser = "user123";

      const filteredResults = mockResultsList.filter(
        (row) => row.idUsuario === idUser
      );

      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[] | ((err: Error | null, results?: any[]) => void),
          callback?: (err: Error | null, results?: any[]) => void
        ) => {
          if (typeof params === "function") {
            params(null, filteredResults);
          } else if (callback) {
            expect(params).toContain(idUser); // Asegura que se pasa el parámetro
            callback(null, filteredResults);
          }
        }
      );

      const tasks = await taskDAO.getAll(idUser);

      const expectedResults: Task[] = filteredResults.map((row) => ({
        idTask: row.idTarea,
        title: row.titulo,
        description: row.descripcion,
        activityDate: row.fechaActividad,
        state: {
          idState: row.idEstado,
          state: row.estado,
        },
        type: {
          idType: row.idTipo,
          type: row.tipo,
          color: row.color,
        },
        idUser: row.idUsuario,
      }));

      expect(tasks).toEqual(expectedResults);
    });
  });

  describe("getById", () => {
    const mockConnection = mysql.createConnection();

    const mockTaskRow = {
      idTarea: "t1",
      titulo: "Título prueba",
      descripcion: "Descripción de prueba",
      fechaActividad: Temporal.PlainDateTime.from("2025-04-10T00:00:00"),
      idEstado: 1,
      estado: "Pendiente",
      idTipo: 2,
      tipo: "Trabajo",
      color: "#FF0000",
      idUsuario: "u1",
    };

    it("should return a task when a valid ID is provided", async () => {
      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[] | ((err: Error | null, results?: any[]) => void),
          callback?: (err: Error | null, results?: any[]) => void
        ) => {
          if (typeof params === "function") {
            params(null, [mockTaskRow]);
          } else if (callback) {
            callback(null, [mockTaskRow]);
          }
        }
      );

      const task = await taskDAO.getById("t1");

      expect(task).toEqual({
        idTask: mockTaskRow.idTarea,
        title: mockTaskRow.titulo,
        description: mockTaskRow.descripcion,
        activityDate: mockTaskRow.fechaActividad,
        state: {
          idState: mockTaskRow.idEstado,
          state: mockTaskRow.estado,
        },
        type: {
          idType: mockTaskRow.idTipo,
          type: mockTaskRow.tipo,
          color: mockTaskRow.color,
        },
        idUser: mockTaskRow.idUsuario,
      });

      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining("WHERE"),
        ["t1"],
        expect.any(Function)
      );
    });

    it("should return null when no user is found", async () => {
      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[] | ((err: Error | null, results?: any[]) => void),
          callback?: (err: Error | null, results?: any[]) => void
        ) => {
          if (typeof params === "function") {
            params(null, []);
          } else if (callback) {
            callback(null, []);
          }
        }
      );

      const result = await taskDAO.getById("not-found-id");
      expect(result).toBeNull();
    });

    it("should throw an error if database query fails", async () => {
      const dbError = new Error("Query failed");

      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[] | ((err: Error | null, results?: any[]) => void),
          callback?: (err: Error | null, results?: any[]) => void
        ) => {
          if (typeof params === "function") {
            params(dbError);
          } else if (callback) {
            callback(dbError);
          }
        }
      );

      await expect(taskDAO.getById("t1")).rejects.toThrow("Query failed");
    });
  });

  describe.only("TasksMysqlDAO - create", () => {
    const mockConnection = mysql.createConnection();

    const idTask = "task-123";
    const taskInput: TaskCreate = {
      title: "Nueva tarea",
      description: "Descripción de la nueva tarea",
      activityDate: "2025-04-10T10:00:00",
      idState: 1,
      idType: 2,
      idUser: "user-456",
    };

    const expectedReturn: TaskReturn = {
      idTask: idTask,
      title: taskInput.title,
      description: taskInput.description,
      activityDate: Temporal.PlainDateTime.from("2025-04-10T10:00:00"),
      idState: taskInput.idState,
      idType: taskInput.idType,
      idUser: taskInput.idUser,
    };

    it("should successfully create a new task", async () => {
      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[],
          callback: (err: Error | null, results?: any) => void
        ) => {
          callback(null, { affectedRows: 1 });
        }
      );

      const result = await taskDAO.create(idTask, taskInput);

      expect(result).toEqual(expectedReturn);

      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO"),
        expect.arrayContaining([
          idTask,
          taskInput.title,
          taskInput.description,
          expect.stringContaining("2025-04-10"), // Fecha formateada
          taskInput.idState,
          taskInput.idType,
          taskInput.idUser,
        ]),
        expect.any(Function)
      );
    });

    it("should throw an error if database query fails", async () => {
      const dbError = new Error("Insert failed");

      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[],
          callback: (err: Error | null, results?: any) => void
        ) => {
          callback(dbError);
        }
      );

      await expect(taskDAO.create(idTask, taskInput)).rejects.toThrow(
        "Database insertion error"
      );
    });
  });

  describe.only("TasksMysqlDAO - update", () => {
    const mockConnection = mysql.createConnection();

    const idTask = "task-789";
    const taskInput: TaskUpdate = {
      title: "Tarea actualizada",
      description: "Nueva descripción",
      activityDate: "2025-04-15T09:30:00", // Se mantiene con T
      idState: 2,
      idType: 3,
      idUser: "user-999",
    };

    const expectedReturn: TaskReturn = {
      idTask: idTask,
      title: taskInput.title ?? "",
      description: taskInput.description ?? "",
      activityDate:
        Temporal.PlainDateTime.from("2025-04-15T09:30:00") ??
        Temporal.PlainDateTime.from(""),
      idState: taskInput.idState ?? 0,
      idType: taskInput.idType ?? 0,
      idUser: taskInput.idUser ?? "",
    };

    it("should successfully update an existing task", async () => {
      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[],
          callback: (err: Error | null, results?: any) => void
        ) => {
          callback(null, { affectedRows: 1 });
        }
      );

      const result = await taskDAO.update(idTask, taskInput);

      expect(result).toEqual(expectedReturn);
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE"),
        expect.arrayContaining([
          taskInput.title,
          taskInput.description,
          "2025-04-15 09:30:00",
          taskInput.idState,
          taskInput.idType,
          taskInput.idUser,
          idTask,
        ]),
        expect.any(Function)
      );
    });

    it("should throw an error if user is not found", async () => {
      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[],
          callback: (err: Error | null, results?: any) => void
        ) => {
          callback(null, { affectedRows: 0 });
        }
      );

      await expect(taskDAO.update(idTask, taskInput)).rejects.toThrow(
        "User not found"
      );
    });

    it("should throw an error if database query fails", async () => {
      const dbError = new Error("Database crashed");

      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[],
          callback: (err: Error | null, results?: any) => void
        ) => {
          callback(dbError);
        }
      );

      await expect(taskDAO.update(idTask, taskInput)).rejects.toThrow(
        /Database update error/
      );
    });
  });

  describe("TasksMysqlDAO - delete", () => {
    const mockConnection = mysql.createConnection();
    const idTask = "task-999";

    it("should return true when the task is successfully deleted", async () => {
      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[],
          callback: (err: any, results: any) => void
        ) => {
          callback(null, { affectedRows: 1 });
        }
      );

      const result = await taskDAO.delete(idTask);

      expect(result).toBe(true);
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining("DELETE FROM"),
        [idTask],
        expect.any(Function)
      );
    });

    it("should throw an error if task is not found", async () => {
      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[],
          callback: (err: any, results: any) => void
        ) => {
          callback(null, { affectedRows: 0 });
        }
      );

      await expect(taskDAO.delete(idTask)).rejects.toThrow(
        "Tarea no encontrada"
      );
    });

    it("should throw an error if database query fails", async () => {
      const dbError = new Error("Database failure");

      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[],
          callback: (err: any, results: any) => void
        ) => {
          callback(dbError, null);
        }
      );

      await expect(taskDAO.delete(idTask)).rejects.toThrow("Database failure");
    });
  });
});
