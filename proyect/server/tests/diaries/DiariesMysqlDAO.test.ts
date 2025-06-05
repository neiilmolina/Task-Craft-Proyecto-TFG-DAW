import mysql from "@/tests/__mocks__/mysql";
import DiariesMysqlDAO from "@/src/diaries/model/dao/DiariesMysqlDAO";
import { Temporal } from "@js-temporal/polyfill";
import {
  Diary,
  DiaryBD,
  DiaryCreate,
  DiaryReturn,
  DiaryUpdate,
} from "task-craft-models";

jest.mock("mysql2", () => ({
  createConnection: mysql.createConnection,
}));

describe("DiariesMysqlDAO", () => {
  let diaryDAO: DiariesMysqlDAO;
  beforeEach(() => {
    diaryDAO = new DiariesMysqlDAO();

    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe.only("getAll", () => {
    const mockResultsList: DiaryBD[] = [
      {
        idDiario: "1",
        titulo: "Diary 1",
        descripcion: "Description 1",
        fechaActividad: "2023-10-01 00:00:00",
        idUsuario: "user1",
      },
      {
        idDiario: "2",
        titulo: "Diary 2",
        descripcion: "Description 2",
        fechaActividad: "2023-10-01 00:00:00",
        idUsuario: "user2",
      },
    ];

    it("should return an array of Diarys when query is successful", async () => {
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

      const diaries = await diaryDAO.getAll();

      const expectedResults: Diary[] = mockResultsList.map((row) => ({
        idDiary: row.idDiario,
        title: row.titulo,
        description: row.descripcion,
        activityDate: Temporal.PlainDateTime.from(
          row.fechaActividad.replace(" ", "T")
        ),
        idUser: row.idUsuario,
      }));

      expect(diaries).toEqual(expectedResults);
      expect(mockConnection.query).toHaveBeenCalledTimes(1);
      expect(diaries[0].activityDate instanceof Temporal.PlainDateTime).toBe(
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

      await expect(diaryDAO.getAll()).rejects.toThrow("Database error");
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

      await expect(diaryDAO.getAll()).rejects.toThrow(
        "Expected array of results but got something else."
      );
    });

    it("should return an empty array if no Diarys are found", async () => {
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

      const diaries = await diaryDAO.getAll();
      expect(diaries).toEqual([]);
    });

    it("should handle filtering Diarys by idUser", async () => {
      const mockConnection = mysql.createConnection();
      const idUser = "user1";

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

      const diaries = await diaryDAO.getAll({ idUser: idUser });

      const expectedResults: Diary[] = filteredResults.map((row) => ({
        idDiary: row.idDiario,
        title: row.titulo,
        description: row.descripcion,
        activityDate: Temporal.PlainDateTime.from(
          row.fechaActividad.replace(" ", "T")
        ),
        idUser: row.idUsuario,
      }));

      expect(diaries).toEqual(expectedResults);
    });

    it("should filter Diaries by title", async () => {
      const mockConnection = mysql.createConnection();
      const title = "Diary 1";

      const filteredResults = mockResultsList.filter((row) =>
        row.titulo.includes(title)
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
            expect(params).toContain(`%${title}%`);
            callback(null, filteredResults);
          }
        }
      );

      const diaries = await diaryDAO.getAll({ title });

      const expectedResults: Diary[] = filteredResults.map((row) => ({
        idDiary: row.idDiario,
        title: row.titulo,
        description: row.descripcion,
        activityDate: Temporal.PlainDateTime.from(
          row.fechaActividad.replace(" ", "T")
        ),
        idUser: row.idUsuario,
      }));

      expect(diaries).toEqual(expectedResults);
    });

    it("should filter Diaries by date range", async () => {
      const mockConnection = mysql.createConnection();
      const pastDate = "2023-01-01T00:00:00";
      const futureDate = "2023-12-31T23:59:59";

      const filteredResults = mockResultsList.filter(
        (row) =>
          row.fechaActividad >= pastDate.replace("T", " ") &&
          row.fechaActividad <= futureDate.replace("T", " ")
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
            expect(params).toContain(pastDate.replace("T", " "));
            expect(params).toContain(futureDate.replace("T", " "));
            callback(null, filteredResults);
          }
        }
      );

      const diaries = await diaryDAO.getAll({ pastDate, futureDate });

      const expectedResults: Diary[] = filteredResults.map((row) => ({
        idDiary: row.idDiario,
        title: row.titulo,
        description: row.descripcion,
        activityDate: Temporal.PlainDateTime.from(
          row.fechaActividad.replace(" ", "T")
        ),
        idUser: row.idUsuario,
      }));

      expect(diaries).toEqual(expectedResults);
    });

    it("should filter Diaries by past date", async () => {
      const mockConnection = mysql.createConnection();
      const pastDate = "2023-01-01T00:00:00";

      const filteredResults = mockResultsList.filter(
        (row) => row.fechaActividad >= pastDate.replace("T", " ")
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
            expect(params).toContain(pastDate.replace("T", " "));
            callback(null, filteredResults);
          }
        }
      );

      const diaries = await diaryDAO.getAll({ pastDate });

      const expectedResults: Diary[] = filteredResults.map((row) => ({
        idDiary: row.idDiario,
        title: row.titulo,
        description: row.descripcion,
        activityDate: Temporal.PlainDateTime.from(
          row.fechaActividad.replace(" ", "T")
        ),
        idUser: row.idUsuario,
      }));

      expect(diaries).toEqual(expectedResults);
    });

    it("should filter Diaries by future date", async () => {
      const mockConnection = mysql.createConnection();
      const futureDate = "2023-12-31T23:59:59";

      const filteredResults = mockResultsList.filter(
        (row) => row.fechaActividad <= futureDate.replace("T", " ")
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
            expect(params).toContain(futureDate.replace("T", " "));
            callback(null, filteredResults);
          }
        }
      );

      const diaries = await diaryDAO.getAll({ futureDate });

      const expectedResults: Diary[] = filteredResults.map((row) => ({
        idDiary: row.idDiario,
        title: row.titulo,
        description: row.descripcion,
        activityDate: Temporal.PlainDateTime.from(
          row.fechaActividad.replace(" ", "T")
        ),
        idUser: row.idUsuario,
      }));

      expect(diaries).toEqual(expectedResults);
    });
  });

  describe("getById", () => {
    const mockConnection = mysql.createConnection();

    const mockDiaryRow = {
      idDiario: "t1",
      titulo: "Título prueba",
      descripcion: "Descripción de prueba",
      fechaActividad: "2025-04-10T00:00:00",
      idUsuario: "u1",
    };

    it("should return a Diary when a valid ID is provided", async () => {
      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[] | ((err: Error | null, results?: any[]) => void),
          callback?: (err: Error | null, results?: any[]) => void
        ) => {
          if (typeof params === "function") {
            params(null, [mockDiaryRow]);
          } else if (callback) {
            callback(null, [mockDiaryRow]);
          }
        }
      );

      const Diary = await diaryDAO.getById("t1");

      expect(Diary).toEqual({
        idDiary: mockDiaryRow.idDiario,
        title: mockDiaryRow.titulo,
        description: mockDiaryRow.descripcion,
        activityDate: Temporal.PlainDateTime.from(mockDiaryRow.fechaActividad),
        idUser: mockDiaryRow.idUsuario,
      });

      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining("WHERE"),
        ["t1"],
        expect.any(Function)
      );
    });

    it("should return null when no diary is found", async () => {
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

      const result = await diaryDAO.getById("not-found-id");
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

      await expect(diaryDAO.getById("t1")).rejects.toThrow("Query failed");
    });
  });

  describe("create", () => {
    const mockConnection = mysql.createConnection();

    const idDiary = "diary-123";
    const diaryInput: DiaryCreate = {
      title: "Nuevo diario",
      description: "Descripción de la nuevo diario",
      activityDate: "2025-04-10T10:00:00",
      idUser: "user-456",
    };

    const expectedReturn: DiaryReturn = {
      idDiary: idDiary,
      title: diaryInput.title,
      description: diaryInput.description,
      activityDate: Temporal.PlainDateTime.from("2025-04-10T10:00:00"),
      idUser: diaryInput.idUser,
    };

    it("should successfully create a new Diary", async () => {
      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[],
          callback: (err: Error | null, results?: any) => void
        ) => {
          callback(null, { affectedRows: 1 });
        }
      );

      const result = await diaryDAO.create(idDiary, diaryInput);

      expect(result).toEqual(expectedReturn);

      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO"),
        expect.arrayContaining([
          idDiary,
          diaryInput.title,
          diaryInput.description,
          expect.stringContaining("2025-04-10"),
          diaryInput.idUser,
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

      await expect(diaryDAO.create(idDiary, diaryInput)).rejects.toThrow(
        "Database insertion error"
      );
    });
  });

  describe("update", () => {
    const mockConnection = mysql.createConnection();

    const idDiary = "Diary-789";
    const diaryInput: DiaryUpdate = {
      title: "Diario actualizada",
      description: "Nueva descripción",
      idUser: "user-999",
    };

    const expectedReturn: DiaryReturn = {
      idDiary: idDiary,
      title: diaryInput.title ?? "",
      description: diaryInput.description ?? "",
      activityDate:
        Temporal.PlainDateTime.from("2025-04-15T09:30:00") ??
        Temporal.PlainDateTime.from(""),
      idUser: diaryInput.idUser ?? "",
    };

    it("should successfully update an existing Diary", async () => {
      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[],
          callback: (err: Error | null, results?: any) => void
        ) => {
          callback(null, { affectedRows: 1 });
        }
      );

      const result = await diaryDAO.update(idDiary, diaryInput);

      expect(result).toEqual(expectedReturn);
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE"),
        expect.arrayContaining([
          diaryInput.title,
          diaryInput.description,
          "2025-04-15 09:30:00",
          diaryInput.idUser,
          idDiary,
        ]),
        expect.any(Function)
      );
    });

    it("should throw an error if diary is not found", async () => {
      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[],
          callback: (err: Error | null, results?: any) => void
        ) => {
          callback(null, { affectedRows: 0 });
        }
      );

      await expect(diaryDAO.update(idDiary, diaryInput)).rejects.toThrow(
        "Diary not found"
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

      await expect(diaryDAO.update(idDiary, diaryInput)).rejects.toThrow(
        /Database update error/
      );
    });
  });

  describe("delete", () => {
    const mockConnection = mysql.createConnection();
    const idDiary = "Diary-999";

    it("should return true when the Diary is successfully deleted", async () => {
      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[],
          callback: (err: any, results: any) => void
        ) => {
          callback(null, { affectedRows: 1 });
        }
      );

      const result = await diaryDAO.delete(idDiary);

      expect(result).toBe(true);
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining("DELETE FROM"),
        [idDiary],
        expect.any(Function)
      );
    });

    it("should throw an error if Diary is not found", async () => {
      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[],
          callback: (err: any, results: any) => void
        ) => {
          callback(null, { affectedRows: 0 });
        }
      );

      await expect(diaryDAO.delete(idDiary)).rejects.toThrow("Diary not found");
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

      await expect(diaryDAO.delete(idDiary)).rejects.toThrow(
        "Database failure"
      );
    });
  });
});
