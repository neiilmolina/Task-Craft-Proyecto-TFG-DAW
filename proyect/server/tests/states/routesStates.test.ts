import createEstadosRoute from "@/src/states/controller/routesStates";
import express from "express";
import request from "supertest";

// At the top of your test file
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
});

describe("Estados Routes", () => {
  let app: express.Application;
  let mockStatesModel: any;

  beforeEach(() => {
    mockStatesModel = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    app = express();
    app.use(express.json());
    app.use("/states", createEstadosRoute(mockStatesModel));
  });

  describe("GET /states", () => {
    it("debería devolver todos los estados", async () => {
      const mockStates = [
        { idState: 1, state: "Activo" },
        { idState: 2, state: "Inactivo" },
      ];
      mockStatesModel.getAll.mockResolvedValue(mockStates);

      const response = await request(app).get("/states");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockStates);
      expect(mockStatesModel.getAll).toHaveBeenCalled();
    });

    it("debería manejar errores al obtener estados", async () => {
      mockStatesModel.getAll.mockRejectedValue(
        new Error("Error al obtener estados")
      );

      const response = await request(app).get("/states");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("GET /states/:idState", () => {
    it("debería devolver un estado por ID", async () => {
      const mockState = { idState: 1, state: "Activo" };
      mockStatesModel.getById.mockResolvedValue(mockState);

      const response = await request(app).get("/states/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockState);
      expect(mockStatesModel.getById).toHaveBeenCalledWith(1); // Now expects a number
    });

    it("debería devolver 404 si el estado no existe", async () => {
      mockStatesModel.getById.mockResolvedValue(null);

      const response = await request(app).get("/states/999");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Estado no encontrado");
    });

    it("debería manejar errores al obtener un estado por ID", async () => {
      mockStatesModel.getById.mockRejectedValue(
        new Error("Error al obtener estado")
      );

      const response = await request(app).get("/states/1");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("POST /states", () => {
    it("debería crear un nuevo estado correctamente", async () => {
      const nuevoEstado = { state: "En proceso" };
      const estadoCreado = { idState: 3, state: "En proceso" };
      mockStatesModel.create.mockResolvedValue(estadoCreado);

      const response = await request(app)
        .post("/states")
        .send(nuevoEstado)
        .set("Content-Type", "application/json");

      expect(response.status).toBe(201);
      expect(response.body).toEqual(estadoCreado);
      expect(mockStatesModel.create).toHaveBeenCalledWith(nuevoEstado);
    });

    it("debería manejar errores al crear un estado", async () => {
      const nuevoEstado = { state: "En proceso" };
      mockStatesModel.create.mockRejectedValue(
        new Error("Error al crear estado")
      );

      const response = await request(app)
        .post("/states")
        .send(nuevoEstado)
        .set("Content-Type", "application/json");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
    });

    it("debería validar datos de entrada", async () => {
      const estadoInvalido = {}; // Sin estado

      // Mock the validation function
      jest.mock("task-craft-models.ts", () => ({
        validateEstadoNoId: jest
          .fn()
          .mockReturnValue({ success: false, error: "Estado es requerido" }),
      }));

      const response = await request(app)
        .post("/states")
        .send(estadoInvalido)
        .set("Content-Type", "application/json");

      expect(response.status).toBe(400);
      expect(mockStatesModel.create).not.toHaveBeenCalled();
    });
  });

  describe("PUT /states/:idState", () => {
    it("debería actualizar un estado correctamente", async () => {
      const estadoActualizado = { state: "Completado" };
      const resultadoActualizado = { idState: 1, state: "Completado" };
      mockStatesModel.update.mockResolvedValue(resultadoActualizado);

      const response = await request(app)
        .put("/states/1")
        .send(estadoActualizado)
        .set("Content-Type", "application/json");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(resultadoActualizado);
      expect(mockStatesModel.update).toHaveBeenCalledWith(1, estadoActualizado);
    });

    it("debería devolver 404 si el estado a actualizar no existe", async () => {
      const estadoActualizado = { state: "Completado" };
      mockStatesModel.update.mockResolvedValue(null);

      const response = await request(app)
        .put("/states/999")
        .send(estadoActualizado)
        .set("Content-Type", "application/json");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Estado no encontrado");
    });

    it("debería manejar errores al actualizar un estado", async () => {
      const estadoActualizado = { state: "Completado" };
      mockStatesModel.update.mockRejectedValue(
        new Error("Error al actualizar estado")
      );

      const response = await request(app)
        .put("/states/1")
        .send(estadoActualizado)
        .set("Content-Type", "application/json");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("DELETE /states/:idState", () => {
    it("debería eliminar un estado correctamente", async () => {
      mockStatesModel.delete.mockResolvedValue(true);

      const response = await request(app).delete("/states/1");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Estado eliminado correctamente"
      );
      expect(mockStatesModel.delete).toHaveBeenCalledWith(1);
    });

    it("debería devolver 404 si el estado a eliminar no existe", async () => {
      mockStatesModel.delete.mockResolvedValue(false);

      const response = await request(app).delete("/states/999");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Estado no encontrado");
    });

    it("debería manejar errores al eliminar un estado", async () => {
      mockStatesModel.delete.mockRejectedValue(
        new Error("Error al eliminar estado")
      );

      const response = await request(app).delete("/states/1");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
    });
  });
});
