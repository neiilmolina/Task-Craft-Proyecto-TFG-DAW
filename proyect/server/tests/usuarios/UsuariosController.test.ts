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

  describe("UsuariosController - getUsuarios", () => {
    it("should return a list of users with status 200", async () => {
      const mockUsuarios = [
        {
          id: "1",
          email: "user1@example.com",
          role: "admin",
          createdAt: "2025-03-08T00:00:00Z",
          updatedAt: "2025-03-08T00:00:00Z",
        },
        {
          id: "2",
          email: "user2@example.com",
          role: "user",
          createdAt: "2025-03-08T00:00:00Z",
          updatedAt: "2025-03-08T00:00:00Z",
        },
      ];
      mockUsuariosModel.getAll.mockResolvedValue({
        users: mockUsuarios,
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      });

      await usuariosController.getUsuarios(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockUsuariosModel.getAll).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        users: mockUsuarios,
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it("should return 500 if an error occurs", async () => {
      mockUsuariosModel.getAll.mockRejectedValue(new Error("Database error"));

      await usuariosController.getUsuarios(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockUsuariosModel.getAll).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Error interno del servidor",
      });
    });
  });

  describe("UsuariosController - getUsuarioById", () => {
    it("should return a user by ID with status 200", async () => {
      const mockUsuario = {
        id: "1",
        email: "user1@example.com",
        role: "admin",
        createdAt: "2025-03-08T00:00:00Z",
        updatedAt: "2025-03-08T00:00:00Z",
      };
      mockUsuariosModel.getById.mockResolvedValue(mockUsuario);

      const mockRequestWithId: Request = {
        params: { id: "1" },
        query: {},
        body: {},
        get: jest.fn(),
        header: jest.fn(),
        accepts: jest.fn(),
        acceptsCharsets: jest.fn(),
      } as unknown as Request;

      await usuariosController.getUsuarioById(
        mockRequestWithId,
        mockResponse as Response,
        mockNext
      );

      expect(mockUsuariosModel.getById).toHaveBeenCalledWith("1");
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUsuario);
    });

    it("should return 404 if the user is not found", async () => {
      mockUsuariosModel.getById.mockResolvedValue(null);

      const mockRequestWithId: Request = {
        params: { id: "1" },
        query: {},
        body: {},
        get: jest.fn(),
        header: jest.fn(),
        accepts: jest.fn(),
        acceptsCharsets: jest.fn(),
      } as unknown as Request;

      await usuariosController.getUsuarioById(
        mockRequestWithId,
        mockResponse as Response,
        mockNext
      );

      expect(mockUsuariosModel.getById).toHaveBeenCalledWith("1");
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Usuario no encontrado",
      });
    });

    it("should return 500 if an error occurs", async () => {
      mockUsuariosModel.getById.mockRejectedValue(new Error("Database error"));

      const mockRequestWithId: Request = {
        params: { id: "1" },
        query: {},
        body: {},
        get: jest.fn(),
        header: jest.fn(),
        accepts: jest.fn(),
        acceptsCharsets: jest.fn(),
      } as unknown as Request;

      await usuariosController.getUsuarioById(
        mockRequestWithId,
        mockResponse as Response,
        mockNext
      );

      expect(mockUsuariosModel.getById).toHaveBeenCalledWith("1");
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Error interno del servidor",
      });
    });
  });

  describe("UsuariosController - signUp", () => {
    it("should create a new user and return status 201", async () => {
      const mockUsuarioCreate: UsuarioCreate = {
        email: "newuser@example.com",
        password: "password123",
        firstName: "New",
        lastName: "User",
        role: "user",
      };

      const mockAuthResponse: AuthResponse = {
        user: {
          id: "1",
          email: "newuser@example.com",
          firstName: "New",
          lastName: "User",
          role: "user",
          createdAt: "2025-03-08T00:00:00Z",
          updatedAt: "2025-03-08T00:00:00Z",
        },
        session: null,
        error: undefined,
      };

      mockUsuariosModel.signUp.mockResolvedValue(mockAuthResponse);

      mockRequest = { body: mockUsuarioCreate };
      await usuariosController.signUp(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockUsuariosModel.signUp).toHaveBeenCalledWith(mockUsuarioCreate);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockAuthResponse);
    });

    it("should return 400 if validation fails", async () => {
      const mockUsuarioCreate: UsuarioCreate = {
        email: "newuser@example.com",
        password: "password123",
      };

      jest.mock("@/src/usuarios/schemasUsuarios", () => ({
        validateUsuarioCreate: jest
          .fn()
          .mockReturnValue({ success: false, error: "Invalid data" }),
      }));

      mockRequest = { body: mockUsuarioCreate };
      await usuariosController.signUp(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: "Invalid data" });
    });

    it("should return 500 if an error occurs", async () => {
      const mockUsuarioCreate: UsuarioCreate = {
        email: "newuser@example.com",
        password: "password123",
        firstName: "New",
        lastName: "User",
        role: "user",
      };

      mockUsuariosModel.signUp.mockRejectedValue(new Error("Database error"));

      mockRequest = { body: mockUsuarioCreate };
      await usuariosController.signUp(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Error interno del servidor",
      });
    });
  });

  describe("UsuariosController - createUsuario", () => {
    const usuarioData: UsuarioCreate = {
      email: "user@example.com",
      role: "admin",
      password: "password123", // Add the password property here
    };

    it("should create a new user and return status 201", async () => {
      const newUsuario = {
        id: "1",
        email: "user@example.com",
        role: "admin",
        createdAt: "2025-03-08T00:00:00Z",
        updatedAt: "2025-03-08T00:00:00Z",
      };

      mockUsuariosModel.create.mockResolvedValue(newUsuario);

      const mockRequest: Request = {
        body: usuarioData,
        get: jest.fn(),
        header: jest.fn(),
        accepts: jest.fn(),
        acceptsCharsets: jest.fn(),
      } as unknown as Request;

      await usuariosController.createUsuario(
        mockRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockUsuariosModel.create).toHaveBeenCalledWith(usuarioData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(newUsuario);
    });

    it("should return 400 if validation fails", async () => {
      const validationResult = {
        success: false,
        error: "Invalid email format",
      };

      jest.mock("@/src/usuarios/schemasUsuarios", () => ({
        validateUsuarioCreate: jest.fn().mockReturnValue(validationResult),
      }));

      const mockRequest: Request = {
        body: usuarioData,
        get: jest.fn(),
        header: jest.fn(),
        accepts: jest.fn(),
        acceptsCharsets: jest.fn(),
      } as unknown as Request;

      await usuariosController.createUsuario(
        mockRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: validationResult.error,
      });
    });

    it("should return 500 if an error occurs", async () => {
      mockUsuariosModel.create.mockRejectedValue(new Error("Database error"));

      const mockRequest: Request = {
        body: usuarioData,
        get: jest.fn(),
        header: jest.fn(),
        accepts: jest.fn(),
        acceptsCharsets: jest.fn(),
      } as unknown as Request;

      await usuariosController.createUsuario(
        mockRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Error interno del servidor",
      });
    });
  });

  describe("UsuariosController - updateUsuario", () => {
    it("should update a user and return status 200", async () => {
      const id = "1";
      const usuarioData: UsuarioUpdate = {
        email: "updated@example.com",
        role: "user",
      };

      const user = {
        id: "1",
        email: "updated@example.com",
        role: "user",
        createdAt: "2025-03-08T00:00:00Z",
        updatedAt: "2025-03-08T00:00:00Z",
      };

      mockUsuariosModel.update.mockResolvedValue(user);

      const mockRequest: Request = {
        params: { id },
        body: usuarioData,
        get: jest.fn(),
        header: jest.fn(),
        accepts: jest.fn(),
        acceptsCharsets: jest.fn(),
      } as unknown as Request;

      await usuariosController.updateUsuario(
        mockRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockUsuariosModel.update).toHaveBeenCalledWith(id, usuarioData);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(user); // Updated to send the full user object
    });
  });

  it("should return 400 if validation fails", async () => {
    const usuarioData: UsuarioUpdate = {
      email: "updated@example.com",
      role: "user",
    };
    const validationResult = {
      success: false,
      error: "Invalid email format",
    };

    jest.mock("@/src/usuarios/schemasUsuarios", () => ({
      validateUsuarioUpdate: jest.fn().mockReturnValue(validationResult),
    }));

    const mockRequest: Request = {
      body: usuarioData,
      params: { id: "1" },
      get: jest.fn(),
      header: jest.fn(),
      accepts: jest.fn(),
      acceptsCharsets: jest.fn(),
    } as unknown as Request;

    await usuariosController.updateUsuario(
      mockRequest,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: validationResult.error,
    });
  });

  it("should return 404 if the user is not found", async () => {
    const id = "1";
    const usuarioData: UsuarioUpdate = {
      email: "updated@example.com",
      role: "user",
    };
    mockUsuariosModel.update.mockResolvedValue(null);

    const mockRequest: Request = {
      params: { id },
      body: usuarioData,
      get: jest.fn(),
      header: jest.fn(),
      accepts: jest.fn(),
      acceptsCharsets: jest.fn(),
    } as unknown as Request;

    await usuariosController.updateUsuario(
      mockRequest,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Usuario no encontrado",
    });
  });

  it("should return 500 if an error occurs", async () => {
    const id = "1";
    const usuarioData: UsuarioUpdate = {
      email: "updated@example.com",
      role: "user",
    };
    mockUsuariosModel.update.mockRejectedValue(new Error("Database error"));

    const mockRequest: Request = {
      params: { id },
      body: usuarioData,
      get: jest.fn(),
      header: jest.fn(),
      accepts: jest.fn(),
      acceptsCharsets: jest.fn(),
    } as unknown as Request;

    await usuariosController.updateUsuario(
      mockRequest,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Error interno del servidor",
    });
  });

  describe("UsuariosController - deleteUsuario", () => {
    it("should delete a user and return status 200", async () => {
      const id = "1";
      mockUsuariosModel.delete.mockResolvedValue(true);

      const mockRequest: Request = {
        params: { id },
        get: jest.fn(),
        header: jest.fn(),
        accepts: jest.fn(),
        acceptsCharsets: jest.fn(),
      } as unknown as Request;

      await usuariosController.deleteUsuario(
        mockRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockUsuariosModel.delete).toHaveBeenCalledWith(id);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Usuario eliminado correctamente",
      });
    });

    it("should return 404 if the user is not found", async () => {
      const id = "1";
      mockUsuariosModel.delete.mockResolvedValue(false);

      const mockRequest: Request = {
        params: { id },
        get: jest.fn(),
        header: jest.fn(),
        accepts: jest.fn(),
        acceptsCharsets: jest.fn(),
      } as unknown as Request;

      await usuariosController.deleteUsuario(
        mockRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Usuario no encontrado",
      });
    });

    it("should return 500 if an error occurs", async () => {
      const id = "1";
      mockUsuariosModel.delete.mockRejectedValue(new Error("Database error"));

      const mockRequest: Request = {
        params: { id },
        get: jest.fn(),
        header: jest.fn(),
        accepts: jest.fn(),
        acceptsCharsets: jest.fn(),
      } as unknown as Request;

      await usuariosController.deleteUsuario(
        mockRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Error interno del servidor",
      });
    });
  });

  describe("UsuariosController - changePassword", () => {
    it("should change the password and return status 200", async () => {
      const newPassword = "newPassword123";
      const mockRequest: Request = {
        body: { newPassword },
        get: jest.fn(),
        header: jest.fn(),
        accepts: jest.fn(),
        acceptsCharsets: jest.fn(),
      } as unknown as Request;

      mockUsuariosModel.changePassword.mockResolvedValue(true);

      await usuariosController.changePassword(
        mockRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockUsuariosModel.changePassword).toHaveBeenCalledWith(
        newPassword
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Contraseña cambiada correctamente",
      });
    });

    it("should return 400 if the password change fails", async () => {
      const newPassword = "newPassword123";
      const mockRequest: Request = {
        body: { newPassword },
        get: jest.fn(),
        header: jest.fn(),
        accepts: jest.fn(),
        acceptsCharsets: jest.fn(),
      } as unknown as Request;

      mockUsuariosModel.changePassword.mockResolvedValue(false);

      await usuariosController.changePassword(
        mockRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Error al cambiar la contraseña",
      });
    });

    it("should return 500 if an error occurs", async () => {
      const newPassword = "newPassword123";
      const mockRequest: Request = {
        body: { newPassword },
        get: jest.fn(),
        header: jest.fn(),
        accepts: jest.fn(),
        acceptsCharsets: jest.fn(),
      } as unknown as Request;

      mockUsuariosModel.changePassword.mockRejectedValue(
        new Error("Database error")
      );

      await usuariosController.changePassword(
        mockRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Error interno del servidor",
      });
    });
  });

  describe("UsuariosController - resetEmail", () => {
    it("should reset the email and return status 200", async () => {
      const email = "user@example.com";
      const mockRequest: Request = {
        body: { email },
        get: jest.fn(),
        header: jest.fn(),
        accepts: jest.fn(),
        acceptsCharsets: jest.fn(),
      } as unknown as Request;

      mockUsuariosModel.resetEmail.mockResolvedValue(true);

      await usuariosController.resetEmail(
        mockRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockUsuariosModel.resetEmail).toHaveBeenCalledWith(email);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Correo restablecido correctamente",
      });
    });

    it("should return 400 if the email reset fails", async () => {
      const email = "user@example.com";
      const mockRequest: Request = {
        body: { email },
        get: jest.fn(),
        header: jest.fn(),
        accepts: jest.fn(),
        acceptsCharsets: jest.fn(),
      } as unknown as Request;

      mockUsuariosModel.resetEmail.mockResolvedValue(false);

      await usuariosController.resetEmail(
        mockRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Error al restablecer el correo",
      });
    });

    it("should return 500 if an error occurs", async () => {
      const email = "user@example.com";
      const mockRequest: Request = {
        body: { email },
        get: jest.fn(),
        header: jest.fn(),
        accepts: jest.fn(),
        acceptsCharsets: jest.fn(),
      } as unknown as Request;

      mockUsuariosModel.resetEmail.mockRejectedValue(
        new Error("Database error")
      );

      await usuariosController.resetEmail(
        mockRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Error interno del servidor",
      });
    });
  });

  describe("UsuariosController - signIn", () => {
    it("should sign in a user and return status 200", async () => {
      const credentials: LoginCredentials = {
        email: "user@example.com",
        password: "password123",
      };

      const authResponse: AuthResponse = {
        session: "fake-token",
        user: {
          id: "1",
          email: "user@example.com",
          role: "admin",
          createdAt: "2025-03-08T00:00:00Z",
          updatedAt: "2025-03-08T00:00:00Z",
        },
      };

      const mockRequest: Request = {
        body: credentials,
        get: jest.fn(),
        header: jest.fn(),
        accepts: jest.fn(),
        acceptsCharsets: jest.fn(),
      } as unknown as Request;

      mockUsuariosModel.signIn.mockResolvedValue(authResponse);

      await usuariosController.signIn(
        mockRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockUsuariosModel.signIn).toHaveBeenCalledWith(credentials);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(authResponse);
    });

    it.only("should return 400 if credentials are invalid", async () => {
      const credentials: LoginCredentials = {
        email: "user@example.com",
        password: "wrongpassword", // Contraseña incorrecta
      };

      // Creamos el mock de la solicitud
      const mockRequest: Request = {
        body: credentials,
        get: jest.fn(),
        header: jest.fn(),
        accepts: jest.fn(),
        acceptsCharsets: jest.fn(),
      } as unknown as Request;

      // Simulamos la respuesta de Supabase cuando las credenciales son incorrectas
      mockUsuariosModel.signIn.mockResolvedValue({
        user: null,
        session: null,
        error: "Invalid credentials", // Error de autenticación
      });

      // Llamamos al método signIn de tu controlador
      await usuariosController.signIn(
        mockRequest,
        mockResponse as Response,
        mockNext
      );

      // Verificamos que la respuesta tenga el código de estado 400
      expect(mockResponse.status).toHaveBeenCalledWith(400);

      // Verificamos que el mensaje de error sea el adecuado
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Credenciales inválidas", // Respuesta que espera tu API
      });
    });

    it("should return 500 if an error occurs", async () => {
      const credentials: LoginCredentials = {
        email: "user@example.com",
        password: "password123",
      };

      const mockRequest: Request = {
        body: credentials,
        get: jest.fn(),
        header: jest.fn(),
        accepts: jest.fn(),
        acceptsCharsets: jest.fn(),
      } as unknown as Request;

      mockUsuariosModel.signIn.mockRejectedValue(new Error("Database error"));

      await usuariosController.signIn(
        mockRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Error interno del servidor",
      });
    });
  });

  // Test for signOut
  describe("signOut", () => {
    it("should return 200 if the session is successfully closed", async () => {
      mockUsuariosModel.signOut.mockResolvedValue(undefined); // Mock successful sign out

      await usuariosController.signOut(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Sesión cerrada correctamente",
      });
    });

    it("should return 500 if there is an error while signing out", async () => {
      mockUsuariosModel.signOut.mockRejectedValue(
        new Error("Error al cerrar sesión")
      ); // Mock failure

      await usuariosController.signOut(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Error interno del servidor",
        details: "Error al cerrar sesión",
      });
    });
  });

  // Test for resetPassword
  describe("resetPassword", () => {
    it("should return 200 if password is successfully reset", async () => {
      const email = "user@example.com";
      mockUsuariosModel.resetPassword.mockResolvedValue(true); // Mock successful reset

      mockRequest.body = { email };

      await usuariosController.resetPassword(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Contraseña restablecida correctamente",
      });
    });

    it("should return 400 if there is an error resetting the password", async () => {
      const email = "user@example.com";
      mockUsuariosModel.resetPassword.mockResolvedValue(false); // Mock failed reset

      mockRequest.body = { email };

      await usuariosController.resetPassword(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Error al restablecer la contraseña",
      });
    });

    it("should return 500 if there is an internal server error", async () => {
      const email = "user@example.com";
      mockUsuariosModel.resetPassword.mockRejectedValue(
        new Error("Error al restablecer la contraseña")
      ); // Mock failure

      mockRequest.body = { email };

      await usuariosController.resetPassword(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Error interno del servidor",
        details: "Error al restablecer la contraseña",
      });
    });
  });
});
