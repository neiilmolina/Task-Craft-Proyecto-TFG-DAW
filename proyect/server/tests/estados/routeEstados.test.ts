import createEstadosRoute from "@/src/estados/routesEstados";
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
  let mockEstadosModel: any;

  beforeEach(() => {
    mockEstadosModel = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    app = express();
    app.use(express.json());
    app.use("/estados", createEstadosRoute(mockEstadosModel));
  });

  describe("GET /estados", () => {
    it("debería devolver todos los estados", async () => {
      const mockEstados = [
        { idEstado: 1, estado: "Activo" },
        { idEstado: 2, estado: "Inactivo" },
      ];
      mockEstadosModel.getAll.mockResolvedValue(mockEstados);

      const response = await request(app).get("/estados");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEstados);
      expect(mockEstadosModel.getAll).toHaveBeenCalled();
    });

    it("debería manejar errores al obtener estados", async () => {
      mockEstadosModel.getAll.mockRejectedValue(
        new Error("Error al obtener estados")
      );

      const response = await request(app).get("/estados");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("GET /estados/:idEstado", () => {
    it("debería devolver un estado por ID", async () => {
      const mockEstado = { idEstado: 1, estado: "Activo" };
      mockEstadosModel.getById.mockResolvedValue(mockEstado);

      const response = await request(app).get("/estados/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEstado);
      expect(mockEstadosModel.getById).toHaveBeenCalledWith(1); // Now expects a number
    });

    it("debería devolver 404 si el estado no existe", async () => {
      mockEstadosModel.getById.mockResolvedValue(null);

      const response = await request(app).get("/estados/999");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Estado no encontrado");
    });

    it("debería manejar errores al obtener un estado por ID", async () => {
      mockEstadosModel.getById.mockRejectedValue(
        new Error("Error al obtener estado")
      );

      const response = await request(app).get("/estados/1");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("POST /estados", () => {
    it("debería crear un nuevo estado correctamente", async () => {
      const nuevoEstado = { estado: "En proceso" };
      const estadoCreado = { idEstado: 3, estado: "En proceso" };
      mockEstadosModel.create.mockResolvedValue(estadoCreado);

      const response = await request(app)
        .post("/estados")
        .send(nuevoEstado)
        .set("Content-Type", "application/json");

      expect(response.status).toBe(201);
      expect(response.body).toEqual(estadoCreado);
      expect(mockEstadosModel.create).toHaveBeenCalledWith(nuevoEstado);
    });

    it("debería manejar errores al crear un estado", async () => {
      const nuevoEstado = { estado: "En proceso" };
      mockEstadosModel.create.mockRejectedValue(
        new Error("Error al crear estado")
      );

      const response = await request(app)
        .post("/estados")
        .send(nuevoEstado)
        .set("Content-Type", "application/json");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
    });

    it("debería validar datos de entrada", async () => {
      const estadoInvalido = {}; // Sin estado

      // Mock the validation function
      jest.mock("@/src/estados/schemasEstados", () => ({
        validateEstadoNoId: jest
          .fn()
          .mockReturnValue({ success: false, error: "Estado es requerido" }),
      }));

      const response = await request(app)
        .post("/estados")
        .send(estadoInvalido)
        .set("Content-Type", "application/json");

      expect(response.status).toBe(400);
      expect(mockEstadosModel.create).not.toHaveBeenCalled();
    });
  });

  describe("PUT /estados/:idEstado", () => {
    it("debería actualizar un estado correctamente", async () => {
      const estadoActualizado = { estado: "Completado" };
      const resultadoActualizado = { idEstado: 1, estado: "Completado" };
      mockEstadosModel.update.mockResolvedValue(resultadoActualizado);

      const response = await request(app)
        .put("/estados/1")
        .send(estadoActualizado)
        .set("Content-Type", "application/json");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(resultadoActualizado);
      expect(mockEstadosModel.update).toHaveBeenCalledWith(
        1,
        estadoActualizado
      );
    });

    it("debería devolver 404 si el estado a actualizar no existe", async () => {
      const estadoActualizado = { estado: "Completado" };
      mockEstadosModel.update.mockResolvedValue(null);

      const response = await request(app)
        .put("/estados/999")
        .send(estadoActualizado)
        .set("Content-Type", "application/json");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Estado no encontrado");
    });

    it("debería manejar errores al actualizar un estado", async () => {
      const estadoActualizado = { estado: "Completado" };
      mockEstadosModel.update.mockRejectedValue(
        new Error("Error al actualizar estado")
      );

      const response = await request(app)
        .put("/estados/1")
        .send(estadoActualizado)
        .set("Content-Type", "application/json");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("DELETE /estados/:idEstado", () => {
    it("debería eliminar un estado correctamente", async () => {
      mockEstadosModel.delete.mockResolvedValue(true);

      const response = await request(app).delete("/estados/1");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Estado eliminado correctamente"
      );
      expect(mockEstadosModel.delete).toHaveBeenCalledWith(1);
    });

    it("debería devolver 404 si el estado a eliminar no existe", async () => {
      mockEstadosModel.delete.mockResolvedValue(false);

      const response = await request(app).delete("/estados/999");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Estado no encontrado");
    });

    it("debería manejar errores al eliminar un estado", async () => {
      mockEstadosModel.delete.mockRejectedValue(
        new Error("Error al eliminar estado")
      );

      const response = await request(app).delete("/estados/1");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
    });
  });
});
