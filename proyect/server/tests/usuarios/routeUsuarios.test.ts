// tests/routes/usuariosRoutes.test.ts
import { createUsuariosRoute } from "@/src/usuarios/routesUsuarios";
import express from "express";
import request from "supertest";
import UsuariosModel from "@/src/usuarios/UsuariosModel";
import { Usuario, PaginatedUsers } from "@/src/usuarios/interfacesUsuarios";

// Mock console.error
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
});

describe("Usuarios Routes", () => {
  let app: express.Application;
  let mockUsuariosModel: jest.Mocked<UsuariosModel>;

  beforeEach(() => {
    mockUsuariosModel = {
      getAll: jest.fn(),
      getById: jest.fn(),
      signUp: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
      resetPassword: jest.fn(),
      changePassword: jest.fn(),
      resetEmail: jest.fn(),
    } as unknown as jest.Mocked<UsuariosModel>;

    app = express();
    app.use(express.json());
    app.use("/api/usuarios", createUsuariosRoute(mockUsuariosModel));
  });

  // Utility function to create mock user
  const createMockUser = (id: string): Usuario => ({
    id,
    email: `user${id}@test.com`,
    firstName: `User${id}`,
    lastName: "Test",
    role: "user",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    app_metadata: {},
    user_metadata: {},
    aud: "authenticated",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  describe("GET /api/usuarios", () => {
    it("should return paginated users", async () => {
      const mockUsers: PaginatedUsers = {
        users: [createMockUser("1"), createMockUser("2")],
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      };
      mockUsuariosModel.getAll.mockResolvedValue(mockUsers);

      const response = await request(app).get("/api/usuarios");
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
      expect(mockUsuariosModel.getAll).toHaveBeenCalled();
    });

    it("should handle errors", async () => {
      mockUsuariosModel.getAll.mockRejectedValue(new Error("Database error"));

      const response = await request(app).get("/api/usuarios");
      
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("GET /api/usuarios/:id", () => {
    it("should return a user by ID", async () => {
      const mockUser = createMockUser("1");
      mockUsuariosModel.getById.mockResolvedValue(mockUser);

      const response = await request(app).get("/api/usuarios/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
      expect(mockUsuariosModel.getById).toHaveBeenCalledWith("1");
    });

    it("should return 404 if user not found", async () => {
      mockUsuariosModel.getById.mockResolvedValue(null);

      const response = await request(app).get("/api/usuarios/999");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Usuario no encontrado" });
    });
  });

  describe("POST /api/usuarios/sign-up", () => {
    it("should create a new user", async () => {
      const newUser = {
        email: "new@test.com",
        password: "password123",
        firstName: "New",
        lastName: "User",
        role: "user"
      };
      const createdUser = createMockUser("3");
      mockUsuariosModel.signUp.mockResolvedValue({ user: createdUser, session: {} });

      const response = await request(app)
        .post("/api/usuarios/sign-up")
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdUser);
    });

    it("should handle validation errors", async () => {
      const invalidUser = { email: "invalid" };
      const response = await request(app)
        .post("/api/usuarios/sign-up")
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("PUT /api/usuarios/:id", () => {
    it("should update a user", async () => {
      const updatedData = { firstName: "Updated" };
      const updatedUser = createMockUser("1");
      updatedUser.firstName = "Updated";
      mockUsuariosModel.update.mockResolvedValue(updatedUser);

      const response = await request(app)
        .put("/api/usuarios/1")
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedUser);
    });

    it("should return 404 if user not found", async () => {
      mockUsuariosModel.update.mockResolvedValue(null);

      const response = await request(app)
        .put("/api/usuarios/999")
        .send({ firstName: "Updated" });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Usuario no encontrado" });
    });
  });

  describe("POST /api/usuarios/sign-in", () => {
    it("should authenticate user", async () => {
      const credentials = { email: "test@test.com", password: "password123" };
      const mockUser = createMockUser("1");
      mockUsuariosModel.signIn.mockResolvedValue({ user: mockUser, session: {} });

      const response = await request(app)
        .post("/api/usuarios/sign-in")
        .send(credentials);

      expect(response.status).toBe(200);
      expect(response.body.user).toEqual(mockUser);
    });

    it("should handle invalid credentials", async () => {
      mockUsuariosModel.signIn.mockResolvedValue({ user: null, session: null });

      const response = await request(app)
        .post("/api/usuarios/sign-in")
        .send({ email: "invalid", password: "wrong" });

      expect(response.status).toBe(400);
    });
  });

  describe("PUT /api/usuarios/:id/password", () => {
    it("should change password", async () => {
      mockUsuariosModel.changePassword.mockResolvedValue(true);

      const response = await request(app)
        .put("/api/usuarios/1/password")
        .send({ newPassword: "newPassword123" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Contraseña cambiada correctamente" });
    });
  });

  describe("DELETE /api/usuarios/:id", () => {
    it("should delete a user", async () => {
      mockUsuariosModel.delete.mockResolvedValue(true);

      const response = await request(app).delete("/api/usuarios/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Usuario eliminado correctamente" });
    });

    it("should return 404 if user not found", async () => {
      mockUsuariosModel.delete.mockResolvedValue(false);

      const response = await request(app).delete("/api/usuarios/999");

      expect(response.status).toBe(404);
    });
  });

  // Add tests for other endpoints (sign-out, reset-password, reset-email) following the same pattern
});