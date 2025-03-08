// tests/usuarios/UsuariosController.test.ts
import { Request, Response } from "express";
import UsuariosController from "@/src/usuarios/UsuariosController";
import UsuariosModel from "@/src/usuarios/UsuariosModel";
import {
  Usuario,
  UsuarioCreate,
  UsuarioUpdate,
  LoginCredentials,
  PaginatedUsers,
  AuthResponse,
} from "@/src/usuarios/interfacesUsuarios";

// Mock console.error
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
});

// Mock validation schemas
jest.mock("@/src/usuarios/schemasUsuarios", () => ({
  validateUsuarioCreate: jest.fn().mockReturnValue({ success: true }),
  validateUsuarioUpdate: jest.fn().mockReturnValue({ success: true }),
}));

describe("UsuariosController", () => {
  let usuariosController: UsuariosController;
  let mockUsuariosModel: jest.Mocked<UsuariosModel>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

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

    usuariosController = new UsuariosController(mockUsuariosModel);
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe("getUsuarios", () => {
    const mockUsers: PaginatedUsers = {
      users: [
        {
          id: "1",
          email: "test@example.com",
          firstName: "Test",
          lastName: "User",
          role: "user",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          app_metadata: {},
          user_metadata: {},
          aud: "authenticated",
          created_at: new Date().toISOString(),
        },
        {
          id: "2",
          email: "user2@test.com",
          firstName: "Jane",
          lastName: "Doe",
          role: "user",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          app_metadata: {},
          user_metadata: {},
          aud: "authenticated",
          created_at: new Date().toISOString(),
        },
      ],
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
    };

    it("should return paginated users", async () => {
      mockRequest.query = { page: "1", limit: "10" };
      mockUsuariosModel.getAll.mockResolvedValue(mockUsers);

      await usuariosController.getUsuarios(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as jest.Mock
      );

      expect(mockUsuariosModel.getAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUsers);
    });

    it("should handle database errors", async () => {
      const error = new Error("Database error");
      mockUsuariosModel.getAll.mockRejectedValue(error);

      await usuariosController.getUsuarios(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as jest.Mock
      );

      expect(console.error).toHaveBeenCalledWith(
        "Error al cargar los usuarios:",
        error
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Error interno del servidor",
      });
    });
  });

  describe("getUsuarioById", () => {
    const mockUser: Usuario = {
      id: "1",
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      role: "user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {},
      aud: "authenticated",
      created_at: new Date().toISOString(),
    };

    it("should return a user by ID", async () => {
      mockRequest.params = { id: "1" };
      mockUsuariosModel.getById.mockResolvedValue(mockUser);

      await usuariosController.getUsuarioById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as jest.Mock
      );

      expect(mockUsuariosModel.getById).toHaveBeenCalledWith("1");
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
    });

    it("should return 404 if user not found", async () => {
      mockRequest.params = { id: "999" };
      mockUsuariosModel.getById.mockResolvedValue(null);

      await usuariosController.getUsuarioById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as jest.Mock
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Usuario no encontrado",
      });
    });
  });

  describe("signUp", () => {
    const newUser: UsuarioCreate = {
      email: "test@example.com",
      password: "password123",
      firstName: "Test",
      lastName: "User",
      role: "user",
    };

    const authResponse: AuthResponse = {
      user: {
        id: "1",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        role: "user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {},
        aud: "authenticated",
        created_at: new Date().toISOString(),
      },
      session: null,
      error: undefined,
    };

    it("should sign up a new user", async () => {
      mockRequest.body = newUser;
      mockUsuariosModel.signUp.mockResolvedValue(authResponse);

      await usuariosController.signUp(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as jest.Mock
      );

      expect(mockUsuariosModel.signUp).toHaveBeenCalledWith(newUser);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });

    it("should handle validation errors", async () => {
      const validateMock =
        require("@/src/usuarios/schemasUsuarios").validateUsuarioCreate;
      validateMock.mockReturnValueOnce({
        success: false,
        error: { message: "Invalid email" },
      });

      mockRequest.body = { email: "invalid" };

      await usuariosController.signUp(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as jest.Mock
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: { message: "Invalid email" },
      });
    });
  });

  describe("createUsuario", () => {
    const newUser: UsuarioCreate = {
      email: "test@example.com",
      password: "password123",
      firstName: "Test",
      lastName: "User",
      role: "user",
    };

    const userCreated: Usuario = {
      id: "1",
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      role: "user",
      app_metadata: {},
      user_metadata: {},
      aud: "authenticated",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      is_anonymous: false,
    };

    it("should create a new user", async () => {
      mockRequest.body = newUser;
      mockUsuariosModel.create.mockResolvedValue(userCreated);

      await usuariosController.createUsuario(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as jest.Mock
      );

      expect(mockUsuariosModel.create).toHaveBeenCalledWith(newUser);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });

    it("should handle database errors", async () => {
      const error = new Error("Database error");
      mockRequest.body = { email: "newuser@example.com" };
      mockUsuariosModel.create.mockRejectedValue(error);

      await usuariosController.createUsuario(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as jest.Mock
      );

      expect(console.error).toHaveBeenCalledWith(
        "Error al crear el usuario:",
        error
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Error interno del servidor",
      });
    });
  });

  describe("updateUsuario", () => {
    const updatedData: UsuarioUpdate = { firstName: "Updated" };

    it("should update a user", async () => {
      mockRequest.params = { id: "1" };
      mockRequest.body = updatedData;
      mockUsuariosModel.update.mockResolvedValue({
        ...updatedData,
        id: "1",
      } as Usuario);

      await usuariosController.updateUsuario(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as jest.Mock
      );

      expect(mockUsuariosModel.update).toHaveBeenCalledWith("1", updatedData);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it("should return 404 if user not found", async () => {
      mockRequest.params = { id: "999" };
      mockUsuariosModel.update.mockResolvedValue(null);

      await usuariosController.updateUsuario(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as jest.Mock
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Usuario no encontrado",
      });
    });
  });

  describe("deleteUsuario", () => {
    it("should delete a user", async () => {
      mockRequest.params = { id: "1" };
      mockUsuariosModel.delete.mockResolvedValue(true);

      await usuariosController.deleteUsuario(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as jest.Mock
      );

      expect(mockUsuariosModel.delete).toHaveBeenCalledWith("1");
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Usuario eliminado correctamente",
      });
    });

    it("should return 404 if user not found", async () => {
      mockRequest.params = { id: "999" };
      mockUsuariosModel.delete.mockResolvedValue(false);

      await usuariosController.deleteUsuario(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as jest.Mock
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Usuario no encontrado",
      });
    });
  });

  describe("signIn", () => {
    const credentials: LoginCredentials = {
      email: "test@example.com",
      password: "password123",
    };

    const authResponse: AuthResponse = {
      user: {
        id: "1",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        role: "user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {},
        aud: "authenticated",
        created_at: new Date().toISOString(),
      },
      session: null,
      error: undefined,
    };

    it("should sign in a user", async () => {
      mockRequest.body = credentials;
      mockUsuariosModel.signIn.mockResolvedValue(authResponse);

      await usuariosController.signIn(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as jest.Mock
      );

      expect(mockUsuariosModel.signIn).toHaveBeenCalledWith(credentials);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it("should handle authentication errors", async () => {
      const error = new Error("Invalid credentials");
      mockRequest.body = credentials;
      mockUsuariosModel.signIn.mockRejectedValue(error);

      await usuariosController.signIn(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as jest.Mock
      );

      expect(console.error).toHaveBeenCalledWith("Error en el inicio de sesión:", error);
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Credenciales inválidas",
      });
    });
  });

  describe("signOut", () => {
    it("should sign out a user", async () => {
      mockRequest.user = { id: "1" };

      await usuariosController.signOut(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as jest.Mock
      );

      expect(mockUsuariosModel.signOut).toHaveBeenCalledWith("1");
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Sesión cerrada correctamente",
      });
    });
  });
});
