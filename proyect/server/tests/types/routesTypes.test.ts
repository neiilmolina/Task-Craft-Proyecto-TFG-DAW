import createTiposRoute from "@/src/types/controller/routesTypes";
import express from "express";
import request from "supertest";
import { Type, TypeUpdate } from "task-craft-models";
import ITypesDAO from "@/src/types/model/dao/ITypesDAO";

const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
});

describe("Tipos Routes", () => {
  let app: express.Application;
  let mockTypesDAO: jest.Mocked<ITypesDAO>;

  beforeEach(() => {
    mockTypesDAO = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<ITypesDAO>;

    app = express();
    app.use(express.json());
    app.use("/types", createTiposRoute(mockTypesDAO));
  });

  describe("GET /types", () => {
    it("debe devolver un array de tipos cuando la base de datos tiene datos", async () => {
      // Arrange
      const mockTipos: Type[] = [
        { idType: 1, type: "Personal", color: "#FF5733", idUser: "user1" },
      ];
      mockTypesDAO.getAll.mockResolvedValue(mockTipos);

      // Act
      const response = await request(app).get("/types");

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTipos);
    });

    it("debe devolver un array vacío cuando la base de datos no tiene datos", async () => {
      // Arrange
      mockTypesDAO.getAll.mockResolvedValue([]);

      // Act
      const response = await request(app).get("/types");

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it("debe devolver un error 500 si falla la obtención de datos", async () => {
      // Arrange
      mockTypesDAO.getAll.mockRejectedValue(
        new Error("Error de base de datos")
      );

      // Act
      const response = await request(app).get("/types");

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error interno del servidor" });
    });

    it("debe devolver los tipos asociados al idUser proporcionado", async () => {
      // Arrange
      const idUser = "e7d69568-d521-48fb-9505-eb822cb1c79a";
      const mockTipos: Type[] = [
        { idType: 1, type: "Personal", color: "#FF5733", idUser },
        { idType: 2, type: "Trabajo", color: "#3377FF", idUser },
      ];
      mockTypesDAO.getAll.mockResolvedValue(mockTipos);

      // Act
      const response = await request(app).get(`/types?idUser=${idUser}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTipos);
      expect(mockTypesDAO.getAll).toHaveBeenCalledWith(idUser);
    });

    it("debe devolver error 400 si el idUser es inválido", async () => {
      // Arrange
      const invalidIdUser = "invalid-id";

      // Act
      const response = await request(app).get(`/types?idUser=${invalidIdUser}`);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "El ID del user debe ser válido",
      });
    });

    it("debe devolver error 500 en caso de error interno del servidor", async () => {
      // Arrange
      const idUser = "e7d69568-d521-48fb-9505-eb822cb1c79a";
      mockTypesDAO.getAll.mockRejectedValue(new Error("Error interno"));

      // Act
      const response = await request(app).get(`/types?idUser=${idUser}`);

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error interno del servidor" });
    });
  });

  describe("GET /types/:idTipo", () => {
    it("debe devolver un tipo cuando el idTipo existe", async () => {
      // Arrange
      const mockType: Type = {
        idType: 1,
        type: "Personal",
        color: "#FF5733",
        idUser: "user1",
      };
      mockTypesDAO.getById.mockResolvedValue(mockType);

      // Act
      const response = await request(app).get("/types/1");

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockType);
    });

    it("debe devolver un tipo con detalles de usuario cuando userDetails es true", async () => {
      // Arrange
      const mockType: Type = {
        idType: 1,
        type: "Personal",
        color: "#FF5733",
        idUser: "user1",
      };
      mockTypesDAO.getById.mockResolvedValue(mockType);

      // Act
      const response = await request(app).get("/types/1?userDetails=true");

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockType);
    });

    it("debe devolver un error 404 cuando el idTipo no existe", async () => {
      // Arrange
      mockTypesDAO.getById.mockResolvedValue(null);

      // Act
      const response = await request(app).get("/types/999");

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "tipo no encontrado" });
    });

    it("debe devolver un error 500 si ocurre un fallo en la base de datos", async () => {
      // Arrange
      mockTypesDAO.getById.mockRejectedValue(
        new Error("Error de base de datos")
      );

      // Act
      const response = await request(app).get("/types/1");

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error interno del servidor" });
    });

    it("debe manejar correctamente un idTipo inválido (NaN)", async () => {
      // Act
      const response = await request(app).get("/types/abc");

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "idType debe ser un número válido",
      });
    });
  });

  describe("POST /types", () => {
    it("debe crear un tipo cuando los datos son válidos", async () => {
      // Arrange
      const newTipo = {
        type: "Trabajo",
        color: "#FF0000",
        idUser: "user123",
      };
      mockTypesDAO.create.mockResolvedValue({ idType: 1, ...newTipo });

      // Act
      const response = await request(app).post("/types").send(newTipo);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toEqual({ idType: 1, ...newTipo });
    });

    it("debe devolver 400 si los datos son inválidos", async () => {
      // Arrange
      const invalidType = { type: "", color: "#GGGGGG", idUser: "" }; // Datos inválidos
      mockTypesDAO.create.mockResolvedValue(null);

      // Act
      const response = await request(app).post("/types").send(invalidType);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    it("debe devolver 400 si el tipo ya existe", async () => {
      // Arrange
      const existingType = {
        type: "Personal",
        color: "#FF5733",
        idUser: "user1",
      };
      mockTypesDAO.create.mockRejectedValue(new Error("already exists"));

      // Act
      const response = await request(app).post("/types").send(existingType);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "El Tipo ya existe" });
    });

    it("debe devolver 500 si hay un error interno", async () => {
      // Arrange
      const newTipo = { type: "Deporte", color: "#00FF00", idUser: "user2" };
      mockTypesDAO.create.mockRejectedValue(new Error("Error inesperado"));

      // Act
      const response = await request(app).post("/types").send(newTipo);

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error interno del servidor" });
    });
  });

  describe("PUT /types/:idTipo", () => {
    it("debe actualizar un tipo cuando los datos son válidos", async () => {
      // Arrange
      const idType = 1; // Ensure idTipo is a number
      const updatedData: TypeUpdate = {
        type: "Actualizado",
        color: "#FFFFFF",
        idUser: "user1",
      };
      mockTypesDAO.update.mockResolvedValue({
        idType,
        type: updatedData.type,
        color: updatedData.color,
        idUser: updatedData.idUser ?? "",
      });

      // Act
      const response = await request(app)
        .put(`/types/${idType}`)
        .send(updatedData);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ idType, ...updatedData });
      expect(mockTypesDAO.update).toHaveBeenCalledWith(idType, updatedData);
    });

    it("debe devolver 400 si la validación falla", async () => {
      // Arrange
      const idType = 1;
      const invalidData = {
        type: "",
        color: "invalidColor", // Invalid color
        idUser: "user1",
      };
      mockTypesDAO.update.mockResolvedValue(null);

      // Act
      const response = await request(app)
        .put(`/types/${idType}`)
        .send(invalidData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(mockTypesDAO.update).not.toHaveBeenCalled();
    });

    it("debe devolver 404 si el tipo no existe", async () => {
      // Arrange
      const idType = 999;
      const updatedData = {
        type: "Actualizado",
        color: "#FFFFFF",
        idUser: "user1",
      };
      mockTypesDAO.update.mockResolvedValue(null);

      // Act
      const response = await request(app)
        .put(`/types/${idType}`)
        .send(updatedData);

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Tipo no encontrado" });
      expect(mockTypesDAO.update).toHaveBeenCalledWith(idType, updatedData);
    });

    it("debe devolver 500 si ocurre un error en el servidor", async () => {
      // Arrange
      const idType = 1;
      const updatedData = {
        type: "Actualizado",
        color: "#FFFFFF",
        idUser: "user1",
      };
      mockTypesDAO.update.mockRejectedValue(
        new Error("Error de base de datos")
      );

      // Act
      const response = await request(app)
        .put(`/types/${idType}`)
        .send(updatedData);

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error interno del servidor" });
      expect(mockTypesDAO.update).toHaveBeenCalledWith(idType, updatedData);
    });

    it("debe devolver 400 si el idTipo es inválido", async () => {
      // Act
      const response = await request(app)
        .put("/types/abc") // Invalid idTipo
        .send({ type: "Nuevo" });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(mockTypesDAO.update).not.toHaveBeenCalled();
    });
  });

  describe("DELETE /types/:idTipo", () => {
    it("debería eliminar un tipo existente y devolver un estado 200", async () => {
      mockTypesDAO.delete.mockResolvedValue(true); // Mock de eliminación exitosa

      const response = await request(app).delete("/types/1");

      expect(mockTypesDAO.delete).toHaveBeenCalledWith(1); // Se llama con ID correcto
      expect(response.status).toBe(200); // Código de estado correcto
      expect(response.body).toEqual({
        message: "Tipo eliminado correctamente",
      });
    });

    it("debería devolver un estado 404 si el tipo no existe", async () => {
      mockTypesDAO.delete.mockResolvedValue(false); // Mock de "no encontrado"

      const response = await request(app).delete("/types/999");

      expect(mockTypesDAO.delete).toHaveBeenCalledWith(999);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Tipo no encontrado" });
    });

    it("debería devolver un estado 500 si ocurre un error interno", async () => {
      mockTypesDAO.delete.mockRejectedValue(
        new Error("Error de base de datos")
      ); // Simular error

      const response = await request(app).delete("/types/2");

      expect(mockTypesDAO.delete).toHaveBeenCalledWith(2);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error interno del servidor" });
      expect(console.error).toHaveBeenCalledWith(
        "Error al eliminar el type:",
        expect.any(Error)
      );
    });

    it("debería devolver un estado 400 si el id no es un número válido", async () => {
      const response = await request(app).delete("/types/abc");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "ID inválido" });
    });

    it("debería manejar correctamente una solicitud sin parámetro de id", async () => {
      // Aquí la prueba debería manejar correctamente la falta de ID
      const response = await request(app).delete("/types"); // Sin ID

      expect(response.status).toBe(404); // Probablemente Express devuelva 404, no 400
    });
  });
});
