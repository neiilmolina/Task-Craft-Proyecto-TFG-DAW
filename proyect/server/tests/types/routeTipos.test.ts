import createTiposRoute from "@/src/types/controller/routesTipos";
import express from "express";
import request from "supertest";
import TiposModel from "@/src/tipos/TiposModel";
import { Tipo } from "@/src/tipos/interfacesTipos";

const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
});

describe("Tipos Routes", () => {
  let app: express.Application;
  let mockTiposModel: jest.Mocked<TiposModel>;

  beforeEach(() => {
    mockTiposModel = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<TiposModel>;

    app = express();
    app.use(express.json());
    app.use("/tipos", createTiposRoute(mockTiposModel));
  });

  describe("GET /tipos", () => {
    it("debe devolver un array de tipos cuando la base de datos tiene datos", async () => {
      // Arrange
      const mockTipos: Tipo[] = [
        { idTipo: 1, tipo: "Personal", color: "#FF5733", idUsuario: "user1" },
      ];
      mockTiposModel.getAll.mockResolvedValue(mockTipos);

      // Act
      const response = await request(app).get("/tipos");

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTipos);
    });

    it("debe devolver un array vacío cuando la base de datos no tiene datos", async () => {
      // Arrange
      mockTiposModel.getAll.mockResolvedValue([]);

      // Act
      const response = await request(app).get("/tipos");

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it("debe devolver un error 500 si falla la obtención de datos", async () => {
      // Arrange
      mockTiposModel.getAll.mockRejectedValue(
        new Error("Error de base de datos")
      );

      // Act
      const response = await request(app).get("/tipos");

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error interno del servidor" });
    });
  });

  describe("GET /tipos/:idTipo", () => {
    it("debe devolver un tipo cuando el idTipo existe", async () => {
      // Arrange
      const mockTipo: Tipo = {
        idTipo: 1,
        tipo: "Personal",
        color: "#FF5733",
        idUsuario: "user1",
      };
      mockTiposModel.getById.mockResolvedValue(mockTipo);

      // Act
      const response = await request(app).get("/tipos/1");

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTipo);
    });

    it("debe devolver un tipo con detalles de usuario cuando userDetails es true", async () => {
      // Arrange
      const mockTipo: Tipo = {
        idTipo: 1,
        tipo: "Personal",
        color: "#FF5733",
        idUsuario: "user1",
        userDetails: {
          id: "1",
          email: "user1@example.com",
          role: "admin",
          created_at: "2025-03-08T00:00:00Z",
          updated_at: "2025-03-08T00:00:00Z",
          app_metadata: {
            provider: "email",
            providers: ["email"],
          },
          user_metadata: {
            first_name: "Admin User",
            last_name: "Admin Last Name",
            avatar_url: "https://example.com/admin-avatar.jpg",
          },
          aud: "authenticated",
        },
      };
      mockTiposModel.getById.mockResolvedValue(mockTipo);

      // Act
      const response = await request(app).get("/tipos/1?userDetails=true");

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTipo);
    });

    it("debe devolver un error 404 cuando el idTipo no existe", async () => {
      // Arrange
      mockTiposModel.getById.mockResolvedValue(null);

      // Act
      const response = await request(app).get("/tipos/999");

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "tipo no encontrado" });
    });

    it("debe devolver un error 500 si ocurre un fallo en la base de datos", async () => {
      // Arrange
      mockTiposModel.getById.mockRejectedValue(
        new Error("Error de base de datos")
      );

      // Act
      const response = await request(app).get("/tipos/1");

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error interno del servidor" });
    });

    it("debe manejar correctamente un idTipo inválido (NaN)", async () => {
      // Act
      const response = await request(app).get("/tipos/abc");

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "tipo no encontrado" });
    });
  });

  describe("POST /tipos", () => {
    it("debe crear un tipo cuando los datos son válidos", async () => {
      // Arrange
      const newTipo = {
        tipo: "Trabajo",
        color: "#FF0000",
        idUsuario: "user123",
      };
      mockTiposModel.create.mockResolvedValue({ idTipo: 1, ...newTipo });

      // Act
      const response = await request(app).post("/tipos").send(newTipo);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toEqual({ idTipo: 1, ...newTipo });
    });

    it("debe devolver 400 si los datos son inválidos", async () => {
      // Arrange
      const invalidTipo = { tipo: "", color: "#GGGGGG", idUsuario: "" }; // Datos inválidos
      mockTiposModel.create.mockResolvedValue(null);

      // Act
      const response = await request(app).post("/tipos").send(invalidTipo);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    it("debe devolver 400 si el tipo ya existe", async () => {
      // Arrange
      const existingTipo = {
        tipo: "Personal",
        color: "#FF5733",
        idUsuario: "user1",
      };
      mockTiposModel.create.mockRejectedValue(new Error("already exists"));

      // Act
      const response = await request(app).post("/tipos").send(existingTipo);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "El Tipo ya existe" });
    });

    it("debe devolver 500 si hay un error interno", async () => {
      // Arrange
      const newTipo = { tipo: "Deporte", color: "#00FF00", idUsuario: "user2" };
      mockTiposModel.create.mockRejectedValue(new Error("Error inesperado"));

      // Act
      const response = await request(app).post("/tipos").send(newTipo);

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error interno del servidor" });
    });
  });

  describe("PUT /tipos/:idTipo", () => {
    it("debe actualizar un tipo cuando los datos son válidos", async () => {
      // Arrange
      const idTipo = 1; // Ensure idTipo is a number
      const updatedData = {
        tipo: "Actualizado",
        color: "#FFFFFF",
        idUsuario: "user1",
      };
      mockTiposModel.update.mockResolvedValue({ idTipo, ...updatedData });

      // Act
      const response = await request(app)
        .put(`/tipos/${idTipo}`)
        .send(updatedData);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ idTipo, ...updatedData });
      expect(mockTiposModel.update).toHaveBeenCalledWith(idTipo, updatedData);
    });

    it("debe devolver 400 si la validación falla", async () => {
      // Arrange
      const idTipo = 1;
      const invalidData = {
        tipo: "",
        color: "invalidColor", // Invalid color
        idUsuario: "user1",
      };
      mockTiposModel.update.mockResolvedValue(null);

      // Act
      const response = await request(app)
        .put(`/tipos/${idTipo}`)
        .send(invalidData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(mockTiposModel.update).not.toHaveBeenCalled();
    });

    it("debe devolver 404 si el tipo no existe", async () => {
      // Arrange
      const idTipo = 999;
      const updatedData = {
        tipo: "Actualizado",
        color: "#FFFFFF",
        idUsuario: "user1",
      };
      mockTiposModel.update.mockResolvedValue(null);

      // Act
      const response = await request(app)
        .put(`/tipos/${idTipo}`)
        .send(updatedData);

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Tipo no encontrado" });
      expect(mockTiposModel.update).toHaveBeenCalledWith(idTipo, updatedData);
    });

    it("debe devolver 500 si ocurre un error en el servidor", async () => {
      // Arrange
      const idTipo = 1;
      const updatedData = {
        tipo: "Actualizado",
        color: "#FFFFFF",
        idUsuario: "user1",
      };
      mockTiposModel.update.mockRejectedValue(
        new Error("Error de base de datos")
      );

      // Act
      const response = await request(app)
        .put(`/tipos/${idTipo}`)
        .send(updatedData);

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error interno del servidor" });
      expect(mockTiposModel.update).toHaveBeenCalledWith(idTipo, updatedData);
    });

    it("debe devolver 400 si el idTipo es inválido", async () => {
      // Act
      const response = await request(app)
        .put("/tipos/abc") // Invalid idTipo
        .send({ tipo: "Nuevo" });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(mockTiposModel.update).not.toHaveBeenCalled();
    });
  });

  describe("DELETE /tipos/:idTipo", () => {
    it("debería eliminar un tipo existente y devolver un estado 200", async () => {
      mockTiposModel.delete.mockResolvedValue(true); // Mock de eliminación exitosa

      const response = await request(app).delete("/tipos/1");

      expect(mockTiposModel.delete).toHaveBeenCalledWith(1); // Se llama con ID correcto
      expect(response.status).toBe(200); // Código de estado correcto
      expect(response.body).toEqual({
        message: "Tipo eliminado correctamente",
      });
    });

    it("debería devolver un estado 404 si el tipo no existe", async () => {
      mockTiposModel.delete.mockResolvedValue(false); // Mock de "no encontrado"

      const response = await request(app).delete("/tipos/999");

      expect(mockTiposModel.delete).toHaveBeenCalledWith(999);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Tipo no encontrado" });
    });

    it("debería devolver un estado 500 si ocurre un error interno", async () => {
      mockTiposModel.delete.mockRejectedValue(
        new Error("Error de base de datos")
      ); // Simular error

      const response = await request(app).delete("/tipos/2");

      expect(mockTiposModel.delete).toHaveBeenCalledWith(2);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error interno del servidor" });
      expect(console.error).toHaveBeenCalledWith(
        "Error al eliminar el tipo:",
        expect.any(Error)
      );
    });

    it("debería devolver un estado 400 si el id no es un número válido", async () => {
      const response = await request(app).delete("/tipos/abc");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "ID inválido" });
    });

    it("debería manejar correctamente una solicitud sin parámetro de id", async () => {
      // Aquí la prueba debería manejar correctamente la falta de ID
      const response = await request(app).delete("/tipos"); // Sin ID

      expect(response.status).toBe(404); // Probablemente Express devuelva 404, no 400
    });
  });
});
