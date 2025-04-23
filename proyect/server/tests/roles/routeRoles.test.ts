import createRolesRoute from "@/src/roles/controller/routesRoles";
import express from "express";
import request from "supertest";
import IRolesDAO from "@/src/roles/model/dao/IRolesDAO";
import { Role } from "task-craft-models";
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
});

describe("Roles Routes", () => {
  let app: express.Application;
  let mockRolesDAO: jest.Mocked<IRolesDAO>;

  beforeEach(() => {
    mockRolesDAO = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<IRolesDAO>;

    app = express();
    app.use(express.json());
    app.use("/roles", createRolesRoute(mockRolesDAO));
  });

  describe("GET /roles", () => {
    it("debe devolver un array de roles cuando la base de datos tiene datos", async () => {
      // Arrange
      const mockRoles: Role[] = [
        { idRole: 1, role: "Admin" },
        { idRole: 2, role: "Usuario" },
      ];
      mockRolesDAO.getAll.mockResolvedValue(mockRoles);

      // Act
      const response = await request(app).get("/roles");

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockRoles);
    });

    it("debe devolver un array vacío cuando la base de datos no tiene datos", async () => {
      // Arrange
      mockRolesDAO.getAll.mockResolvedValue([]);

      // Act
      const response = await request(app).get("/roles");

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it("debe devolver un error 500 si falla la obtención de datos", async () => {
      // Arrange
      mockRolesDAO.getAll.mockRejectedValue(
        new Error("Error de base de datos")
      );

      // Act
      const response = await request(app).get("/roles");

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error interno del servidor" });
    });
  });

  describe("GET /roles/:idRole", () => {
    it("debe devolver un rol cuando el idRole existe", async () => {
      // Arrange
      const mockRole: Role = {
        idRole: 1,
        role: "Admin",
      };
      mockRolesDAO.getById.mockResolvedValue(mockRole);

      // Act
      const response = await request(app).get("/roles/1");

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockRole);
    });

    it("debe devolver un error 404 cuando el idRole no existe", async () => {
      // Arrange
      mockRolesDAO.getById.mockResolvedValue(null);

      // Act
      const response = await request(app).get("/roles/999");

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Rol no encontrado" });
    });

    it("debe devolver un error 500 si ocurre un fallo en la base de datos", async () => {
      // Arrange
      mockRolesDAO.getById.mockRejectedValue(
        new Error("Error de base de datos")
      );

      // Act
      const response = await request(app).get("/roles/1");

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error interno del servidor" });
    });

    it("debe manejar correctamente un idRole inválido (NaN)", async () => {
      // Act
      const response = await request(app).get("/roles/abc");

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "El ID del rol debe ser un número válido",
      });
    });
  });

  describe("POST /roles", () => {
    it("debe crear un rol cuando los datos son válidos", async () => {
      // Arrange
      const newRol = {
        role: "Moderador",
      };
      mockRolesDAO.create.mockResolvedValue({ idRole: 1, ...newRol });

      // Act
      const response = await request(app).post("/roles").send(newRol);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toEqual({ idRole: 1, ...newRol });
    });

    it("debe devolver 400 si los datos son inválidos", async () => {
      // Arrange
      const invalidRole = { role: "" }; // Nombre vacío
      mockRolesDAO.create.mockResolvedValue(null);

      // Act
      const response = await request(app).post("/roles").send(invalidRole);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    it("debe devolver 400 si el rol ya existe", async () => {
      // Arrange
      const existingRol = {
        role: "Admin",
      };
      mockRolesDAO.create.mockRejectedValue(new Error("already exists"));

      // Act
      const response = await request(app).post("/roles").send(existingRol);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "El rol ya existe" });
    });

    it("debe devolver 500 si hay un error interno", async () => {
      // Arrange
      const newRol = { role: "Usuario" };
      mockRolesDAO.create.mockRejectedValue(new Error("Error inesperado"));

      // Act
      const response = await request(app).post("/roles").send(newRol);

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error interno del servidor" });
    });
  });

  describe("PUT /roles/:idRole", () => {
    it("debe actualizar un rol cuando los datos son válidos", async () => {
      // Arrange
      const idRole = 1;
      const updatedData = { role: "SuperAdmin" };
      mockRolesDAO.update.mockResolvedValue({ idRole, ...updatedData });

      // Act
      const response = await request(app)
        .put(`/roles/${idRole}`)
        .send(updatedData);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ idRole, ...updatedData });
      expect(mockRolesDAO.update).toHaveBeenCalledWith(idRole, updatedData);
    });

    it("should return 400 if validation fails", async () => {
      // Arrange
      const idRole = 1;
      const invalidData = { role: "" }; // Empty role name
      mockRolesDAO.update.mockResolvedValue(null);

      // Act
      const response = await request(app)
        .put(`/roles/${idRole}`)
        .send(invalidData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(mockRolesDAO.update).not.toHaveBeenCalled();
    });

    it("debe devolver 404 si el rol no existe", async () => {
      // Arrange
      const idRole = 999;
      const updatedData = { role: "SuperAdmin" };
      mockRolesDAO.update.mockResolvedValue(null);

      // Act
      const response = await request(app)
        .put(`/roles/${idRole}`)
        .send(updatedData);

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Rol no encontrado" });
      expect(mockRolesDAO.update).toHaveBeenCalledWith(idRole, updatedData);
    });

    it("debe devolver 500 si ocurre un error en el servidor", async () => {
      // Arrange
      const idRole = 1;
      const updatedData = { role: "SuperAdmin" };
      mockRolesDAO.update.mockRejectedValue(
        new Error("Error de base de datos")
      );

      // Act
      const response = await request(app)
        .put(`/roles/${idRole}`)
        .send(updatedData);

      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error interno del servidor" });
      expect(mockRolesDAO.update).toHaveBeenCalledWith(idRole, updatedData);
    });

    it("debe devolver 400 si el idRole es inválido", async () => {
      // Act
      const response = await request(app)
        .put("/roles/abc") // idRole inválido
        .send({ role: "NuevoRol" });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(mockRolesDAO.update).not.toHaveBeenCalled();
    });
  });

  describe("DELETE /roles/:idRole", () => {
    it("debería eliminar un rol existente y devolver un estado 200", async () => {
      // Simulamos una eliminación exitosa
      mockRolesDAO.delete.mockResolvedValue(true);

      const response = await request(app).delete("/roles/1");

      expect(mockRolesDAO.delete).toHaveBeenCalledWith(1); // Se llama con el ID correcto
      expect(response.status).toBe(200); // Código de estado correcto
      expect(response.body).toEqual({
        message: "Rol eliminado correctamente",
      });
    });

    it("debería devolver un estado 404 si el rol no existe", async () => {
      // Simulamos que el rol no fue encontrado
      mockRolesDAO.delete.mockResolvedValue(false);

      const response = await request(app).delete("/roles/999");

      expect(mockRolesDAO.delete).toHaveBeenCalledWith(999); // Se llama con el ID incorrecto
      expect(response.status).toBe(404); // Código de estado para no encontrado
      expect(response.body).toEqual({ error: "Rol no encontrado" });
    });

    it("debería devolver un estado 500 si ocurre un error interno", async () => {
      // Simulamos un error interno en la eliminación
      mockRolesDAO.delete.mockRejectedValue(
        new Error("Error de base de datos")
      );

      const response = await request(app).delete("/roles/2");

      expect(mockRolesDAO.delete).toHaveBeenCalledWith(2); // Se llama con el ID correcto
      expect(response.status).toBe(500); // Código de estado para error interno
      expect(response.body).toEqual({ error: "Error interno del servidor" });
      expect(console.error).toHaveBeenCalledWith(
        "Error al eliminar el role:",
        expect.any(Error)
      );
    });

    it("debería devolver un estado 400 si el id no es un número válido", async () => {
      // Intentamos eliminar un rol con un ID no numérico
      const response = await request(app).delete("/roles/abc");

      expect(response.status).toBe(400); // Código de estado para ID inválido
      expect(response.body).toEqual({ error: "ID inválido" });
    });

    it("debería manejar correctamente una solicitud sin parámetro de id", async () => {
      // Se realiza una solicitud DELETE sin un ID proporcionado
      const response = await request(app).delete("/roles"); // Sin ID

      expect(response.status).toBe(404);
    });
  });
});
