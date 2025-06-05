import createDiariesRoute from "@/src/diaries/controller/routesDiaries";
import express from "express";
import request from "supertest";
import IDiariesDAO from "@/src/diaries/model/dao/IDiariesDAO";
import { Temporal } from "@js-temporal/polyfill";
import {
  Diary,
  DiaryCreate,
  DiaryReturn,
  DiaryUpdate,
} from "task-craft-models";
import { randomUUID } from "crypto";

const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
});

describe("Diaries Routes", () => {
  let app: express.Application;
  let mockDiariesModel: jest.Mocked<IDiariesDAO>;

  beforeEach(() => {
    mockDiariesModel = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<IDiariesDAO>;

    app = express();
    app.use(express.json());
    app.use("/diaries", createDiariesRoute(mockDiariesModel));
  });

  describe("GET /diaries", () => {
    const sampleDiaries: Diary[] = [
      {
        idDiary: randomUUID(),
        title: "Diario de ejemplo",
        description: "Descripción de prueba",
        activityDate: Temporal.PlainDateTime.from("2025-04-11T10:00:00"),
        idUser: "bb89888b-2921-453f-b8c2-49dc2668595f",
      },
      {
        idDiary: randomUUID(),
        title: "Diario de ejemplo 2",
        description: "Descripción de prueba 2",
        activityDate: Temporal.PlainDateTime.from("2025-04-12T14:00:00"),
        idUser: "b39b2d75-2ed9-4f87-b53d-dbb3e0b943ea",
      },
      {
        idDiary: randomUUID(),
        title: "Diario de ejemplo 3",
        description: "Descripción de prueba 3",
        activityDate: Temporal.PlainDateTime.from("2025-04-13T09:00:00"),
        idUser: "c421d674-f800-4a34-8247-2be0f17c6d0f",
      },
      {
        idDiary: randomUUID(),
        title: "Diario de ejemplo 4",
        description: "Descripción de prueba 4",
        activityDate: Temporal.PlainDateTime.from("2025-04-14T16:30:00"),
        idUser: "d928826f-7b10-474b-8ab5-e292f3d459c4",
      },
      {
        idDiary: randomUUID(),
        title: "Diario de ejemplo 5",
        description: "Descripción de prueba 5",
        activityDate: Temporal.PlainDateTime.from("2025-04-15T18:00:00"),
        idUser: "e72c3db7-4d7d-4213-8f4a-62d0c56c292d",
      },
    ];

    it("debe devolver un array de diaries cuando la base de datos tiene datos", async () => {
      mockDiariesModel.getAll.mockResolvedValue(sampleDiaries);

      const res = await request(app).get("/diaries");

      // Convertir la fecha de la respuesta a Temporal.PlainDateTime
      const receivedDiaries = res.body.map((diary: any) => ({
        ...diary,
        activityDate: Temporal.PlainDateTime.from(diary.activityDate),
      }));

      expect(res.status).toBe(200);
      expect(receivedDiaries).toEqual(sampleDiaries);
      expect(mockDiariesModel.getAll).toHaveBeenCalledWith({});
    });

    it("debe devolver un array vacío cuando la base de datos no tiene datos", async () => {
      mockDiariesModel.getAll.mockResolvedValue([]);

      const res = await request(app).get("/diaries");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
      expect(mockDiariesModel.getAll).toHaveBeenCalledWith({});
    });

    it("debe devolver un error 500 si falla la obtención de datos", async () => {
      mockDiariesModel.getAll.mockRejectedValue(new Error("DB error"));

      const res = await request(app).get("/diaries");

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Error interno del servidor" });
      expect(mockDiariesModel.getAll).toHaveBeenCalled();
    });

    it("debe filtrar diaries por idUser cuando se proporciona un id válido", async () => {
      const idUser = "123e4567-e89b-12d3-a456-426614174000"; // UUID válido
      mockDiariesModel.getAll.mockResolvedValue(sampleDiaries);

      const res = await request(app).get(`/diaries?idUser=${idUser}`);

      expect(res.status).toBe(200);
      expect(mockDiariesModel.getAll).toHaveBeenCalledWith({ idUser: idUser });
    });

    it("debe devolver un error 400 si el idUser es inválido", async () => {
      const res = await request(app).get("/diaries?idUser=invalid-id");

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        details: [
          {
            field: "idUser",
            message: "Invalid uuid",
          },
        ],
        error: "Error de validación en los filtros de diarios",
      });
      expect(mockDiariesModel.getAll).not.toHaveBeenCalled();
    });

    it("debe filtrar diaries por fecha si se proporcionan parámetros futureDate y pastDate", async () => {
      const pastDate = "2025-04-10T00:00:00";
      const futureDate = Temporal.Now.plainDateTimeISO()
        .add({ days: 1 })
        .toString();
      mockDiariesModel.getAll.mockResolvedValue(sampleDiaries);

      const res = await request(app).get(
        `/diaries?pastDate=${pastDate}&futureDate=${futureDate}`
      );

      expect(res.status).toBe(200);
      expect(mockDiariesModel.getAll).toHaveBeenCalledWith({
        pastDate: pastDate,
        futureDate: futureDate,
      });
    });

    it("debe devolver un error 400 si las fechas proporcionadas son inválidas", async () => {
      const res = await request(app).get(
        "/diaries?pastDate=invalid-date&futureDate=invalid-date"
      );

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        details: [
          {
            field: "pastDate",
            message: "fecha pasada debe ser una fecha pasada válida",
          },
          {
            field: "futureDate",
            message: "fecha futura debe ser una fecha futura válida",
          },
        ],
        error: "Error de validación en los filtros de diarios",
      });
      expect(mockDiariesModel.getAll).not.toHaveBeenCalled();
    });
  });

  describe("GET /diaries/:idDiary", () => {
    it("debe devolver un diary cuando el idDiary existe", async () => {
      // Mockea la respuesta de la base de datos
      const mockDiary: Diary = {
        idDiary: "4d3c22bf-d51e-4f55-ae4d-ee81477aab4e",
        title: "Diario de ejemplo",
        description: "Descripción de prueba",
        activityDate: Temporal.PlainDateTime.from("2025-04-11T10:00:00"),
        idUser: "bb89888b-2921-453f-b8c2-49dc2668595f",
      };

      mockDiariesModel.getById.mockResolvedValue(mockDiary); // Mockea la llamada al repositorio

      const response = await request(app).get(
        "/diaries/4d3c22bf-d51e-4f55-ae4d-ee81477aab4e"
      );
      const expectedDiary = {
        ...mockDiary,
        activityDate: mockDiary.activityDate.toString(), // Convertir la fecha a cadena
      };

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expectedDiary);
    });

    it("debe devolver un error 404 cuando el idDiary no existe", async () => {
      mockDiariesModel.getById.mockResolvedValue(null); // Simula que no se encontró la Diario

      const response = await request(app).get(
        "/diaries/4d3c22bf-d51e-4f55-ae4d-ee81477aab4e"
      );

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Diario no encontrado" });
    });

    it("debe devolver un error 500 si ocurre un fallo en la base de datos", async () => {
      mockDiariesModel.getById.mockRejectedValue(new Error("Database error")); // Simula un error en la base de datos

      const response = await request(app).get(
        "/diaries/4d3c22bf-d51e-4f55-ae4d-ee81477aab4e"
      );

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error interno del servidor" });
    });

    it("debe manejar correctamente un idDiary inválido (NaN)", async () => {
      const response = await request(app).get("/diaries/invalid-id");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "El ID del user debe ser válido",
      });
    });
  });

  describe("POST /diaries", () => {
    const futureDateDiary = Temporal.Now.plainDateTimeISO()
      .add({ days: 1 })
      .toString();
    const mockDiaryData: DiaryCreate = {
      title: "Diario de ejemplo",
      description: "Descripción de prueba",
      activityDate: futureDateDiary,
      idUser: "bb89888b-2921-453f-b8c2-49dc2668595f",
    };

    const mockNewDiary: DiaryReturn = {
      idDiary: "4d3c22bf-d51e-4f55-ae4d-ee81477aab4e",
      title: mockDiaryData.title,
      description: mockDiaryData.description,
      activityDate: Temporal.PlainDateTime.from(mockDiaryData.activityDate),
      idUser: "bb89888b-2921-453f-b8c2-49dc2668595f",
    };
    it("debe devolver un diary cuando los datos son correctos", async () => {
      mockDiariesModel.create.mockResolvedValue(mockNewDiary); // Simula la creación de una Diario

      const response = await request(app).post("/diaries").send(mockDiaryData);

      expect(response.status).toBe(200);
      expect(response.body.activityDate).toEqual(
        mockNewDiary.activityDate.toString()
      ); // Compara las fechas como strings
    });

    it("debe devolver un error 500 si ocurre un fallo en el controlador", async () => {
      mockDiariesModel.create.mockRejectedValue(new Error("Database error")); // Simula un error en la creación

      const response = await request(app).post("/diaries").send(mockDiaryData);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error interno del servidor" });
    });

    it("debe devolver un error 400 si los datos de entrada no son válidos", async () => {
      const invalidDiary = {
        title: "Diario de ejemplo",
        // Falta descripción
        activityDate: futureDateDiary,
        idUser: "bb89888b-2921-453f-b8c2-49dc2668595f",
      };

      const response = await request(app).post("/diaries").send(invalidDiary);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        details: [{ field: "description", message: "Required" }],
        error: "Error de validación",
      }); // Asegúrate de que el mensaje coincida con lo que se espera
    });
  });

  describe("PUT /diaries/:idDiary", () => {
    const idDiary = "4d3c22bf-d51e-4f55-ae4d-ee81477aab4e";
    const futureDateDiary = Temporal.Now.plainDateTimeISO()
      .add({ days: 1 })
      .toString();
    it("debe actualizar un diary cuando los datos son válidos", async () => {
      const mockDiaryData: DiaryUpdate = {
        title: "Diario actualizada",
        description: "Descripción actualizada",
        idUser: "bb89888b-2921-453f-b8c2-49dc2668595f",
      };

      const mockUpdateddiary = {
        idDiary: idDiary,
        ...mockDiaryData,
      };
      const mockUpdateddiaryReturn: DiaryReturn = {
        idDiary: mockUpdateddiary.idDiary,
        title: mockUpdateddiary.title ?? "",
        description: mockUpdateddiary.description ?? "",
        activityDate: Temporal.PlainDateTime.from(futureDateDiary),
        idUser: mockDiaryData.idUser ?? "",
      };

      // Simula que el diario se actualiza correctamente
      mockDiariesModel.update.mockResolvedValue(mockUpdateddiaryReturn);

      const response = await request(app)
        .put(`/diaries/${idDiary}`)
        .send(mockDiaryData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUpdateddiary);
    });

    it("debe devolver 400 si la validación falla", async () => {
      const invalidDiaryData = {
        // Falta descripción
        title: 1,
        activityDate: futureDateDiary,
        idUser: "bb89888b-2921-453f-b8c2-49dc2668595f",
      };

      const response = await request(app)
        .put(`/diaries/${idDiary}`)
        .send(invalidDiaryData);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        details: [
          { field: "title", message: "Expected string, received number" },
        ],
        error: "Error de validación",
      });
    });

    it("debe devolver 404 si el diary no existe", async () => {
      const mockDiaryData = {
        title: "Diario de ejemplo",
        description: "Descripción de prueba",
        activityDate: futureDateDiary,
        idUser: "bb89888b-2921-453f-b8c2-49dc2668595f",
      };

      // Simula que no se encuentra el diario para la actualización
      mockDiariesModel.update.mockResolvedValue(null);

      const response = await request(app)
        .put(`/diaries/${idDiary}`)
        .send(mockDiaryData);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Diario no encontrada");
    });

    it("debe devolver 500 si ocurre un error en el servidor", async () => {
      const mockDiaryData = {
        title: "Diario de ejemplo",
        description: "Descripción de prueba",
        activityDate: futureDateDiary,
        idUser: "bb89888b-2921-453f-b8c2-49dc2668595f",
      };

      // Simula un error interno en el servidor
      mockDiariesModel.update.mockRejectedValue(new Error("Error interno"));

      const response = await request(app)
        .put(`/diaries/${idDiary}`)
        .send(mockDiaryData);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Error interno del servidor");
    });
  });

  describe("DELETE /diaries/:idDiary", () => {
    const idDiary = "550e8400-e29b-41d4-a716-446655440000";
    it("debería eliminar un diary existente y devolver un estado 200", async () => {
      // Simula que el diario fue eliminada correctamente
      mockDiariesModel.delete.mockResolvedValue(true);

      const response = await request(app).delete(`/diaries/${idDiary}`).send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual(true);
    });

    it("debería devolver un estado 404 si el diary no existe", async () => {
      // Simula que no se encuentra el diario para eliminar
      mockDiariesModel.delete.mockResolvedValue(false);

      const response = await request(app).delete(`/diaries/${idDiary}`).send();

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Diario no encontrada");
    });

    it("debería devolver un estado 500 si ocurre un error interno", async () => {
      // Simula un error interno en el servidor
      mockDiariesModel.delete.mockRejectedValue(new Error("Error interno"));

      const response = await request(app).delete(`/diaries/${idDiary}`).send();

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Error interno del servidor");
    });

    it("debería devolver un estado 400 si el id no es un UUID válido", async () => {
      const invalidId = "invalid-id";

      const response = await request(app)
        .delete(`/diaries/${invalidId}`)
        .send();

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("El ID del diario debe ser válido");
    });
  });
});
