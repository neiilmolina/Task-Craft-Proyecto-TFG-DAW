// tests/usuarios/UsuariosController.test.ts
import { Request, Response } from "express";
import UsuariosController from "@/src/usuarios/UsuariosController";
import UsuariosModel from "@/src/usuarios/UsuariosModel";
import {
  UsuarioCreate,
  UsuarioUpdate,
  LoginCredentials,
  AuthResponse,
} from "@/src/usuarios/interfacesUsuarios";
import {
  validateUsuarioUpdate,
  validateUsuarioCreate,
  validatePassword,
  validateEmail,
} from "@/src/usuarios/schemasUsuarios";
import { User } from "@supabase/supabase-js";

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
  validateUsuarioCreate: jest
    .fn()
    .mockReturnValue({ success: true, error: "" }),
  validateUsuarioUpdate: jest.fn().mockReturnValue({
    success: true, // Ahora simula una validación exitosa
    error: "", // No hay error
  }),
  validatePassword: jest.fn().mockReturnValue({
    success: true, // Ahora simula una validación exitosa
    error: "", // No hay error
  }),
  validateEmail: jest.fn().mockReturnValue({
    success: true, // Ahora simula una validación exitosa
    error: "", // No hay error
  }),
}));

describe("UsuariosController", () => {
  let usuariosController: UsuariosController;
  let mockUsuariosModel: jest.Mocked<UsuariosModel>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks(); // Limpia todos los mocks antes de cada prueba
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("UsuariosController - getUsuarios", () => {
    it("should return a list of users with status 200", async () => {
      const mockUsuarios = [
        {
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
        {
          id: "2",
          email: "user2@example.com",
          role: "user",
          created_at: "2025-03-08T00:00:00Z",
          updated_at: "2025-03-08T00:00:00Z",
          app_metadata: {
            provider: "email",
            providers: ["email"],
          },
          user_metadata: {
            first_name: "Regular User",
            last_name: "User Last Name",
            avatar_url: "https://example.com/user-avatar.jpg",
          },
          aud: "authenticated",
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
        created_at: "2025-03-08T00:00:00Z",
        updated_at: "2025-03-08T00:00:00Z",
        app_metadata: {
          provider: "email",
          providers: ["email"],
        },
        user_metadata: {
          first_name: "Admin User", // Nombre del usuario en user_metadata
          last_name: "Admin Last Name", // Apellido del usuario
          avatar_url: "https://example.com/admin-avatar.jpg", // URL del avatar
        },
        aud: "authenticated", // Audiencia para el usuario autenticado
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
        user_metadata: {
          first_name: "New",
          last_name: "User",
        },
        role: "user",
      };

      const mockAuthResponse: AuthResponse = {
        user: {
          id: "1",
          email: "newuser@example.com",
          role: "user",
          created_at: "2025-03-08T00:00:00Z",
          updated_at: "2025-03-08T00:00:00Z",
          app_metadata: {
            provider: "email",
            providers: ["email"],
          },
          user_metadata: {
            first_name: "New",
            last_name: "User",
          },
          aud: "authenticated",
        },
        session: null,
        error: undefined,
      };

      // Mock de la validación para que sea exitosa
      (validateUsuarioCreate as jest.Mock).mockReturnValue({
        success: true,
        data: mockUsuarioCreate,
      });

      // Mock del modelo
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

    it("should return 400 if email is missing", async () => {
      const mockUsuarioCreate: UsuarioCreate = {
        email: "",
        password: "password123",
        user_metadata: {
          first_name: "New",
          last_name: "User",
        },
        role: "user",
      };

      (validateUsuarioCreate as jest.Mock).mockReturnValue({
        success: false,
        error: "Email es obligatorio",
      });

      mockRequest = { body: mockUsuarioCreate };

      await usuariosController.signUp(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      // Esperamos 'error' en lugar de 'message'
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Email es obligatorio",
      });
    });

    it("should return 400 if password is missing", async () => {
      const mockUsuarioCreate: UsuarioCreate = {
        email: "newuser@example.com",
        password: "",
        user_metadata: {
          first_name: "New",
          last_name: "User",
        },
        role: "user",
      };

      (validateUsuarioCreate as jest.Mock).mockReturnValue({
        success: false,
        error: "Contraseña es obligatoria",
      });

      mockRequest = { body: mockUsuarioCreate };

      await usuariosController.signUp(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      // Esperamos 'error' en lugar de 'message'
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Contraseña es obligatoria",
      });
    });

    it("should return 400 if user already exists", async () => {
      const mockUsuarioCreate: UsuarioCreate = {
        email: "existinguser@example.com",
        password: "password123",
        user_metadata: {
          first_name: "Existing",
          last_name: "User",
        },
        role: "user",
      };

      // Simula una validación exitosa
      (validateUsuarioCreate as jest.Mock).mockReturnValue({
        success: true,
        data: mockUsuarioCreate, // Asegúrate de que los datos pasen la validación
      });

      // Simulando que el usuario ya existe y se devuelve un error con el mensaje adecuado
      mockUsuariosModel.signUp.mockResolvedValue({
        user: null, // El usuario no se crea porque ya existe
        session: null,
        error: "user already exists", // Este es el error que debería aparecer en tu controlador
      });

      mockRequest = { body: mockUsuarioCreate };

      await usuariosController.signUp(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Verificar que se devuelvan el error adecuado con status 400
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "El usuario ya existe", // Este es el mensaje que esperas en tu controlador
      });
    });

    it("should return 400 if validation fails", async () => {
      const mockUsuarioCreate: UsuarioCreate = {
        email: "newuser@example.com",
        password: "password123",
        user_metadata: {},
      };

      // Mock de la validación para que falle
      (validateUsuarioCreate as jest.Mock).mockReturnValue({
        success: false,
        error: "Invalid data",
      });

      mockRequest = { body: mockUsuarioCreate };

      await usuariosController.signUp(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      // Esperamos 'error' en lugar de 'message'
      expect(mockResponse.json).toHaveBeenCalledWith({ error: "Invalid data" });
    });

    it("should return 500 if an error occurs", async () => {
      const mockUsuarioCreate: UsuarioCreate = {
        email: "newuser@example.com",
        password: "password123",
        user_metadata: {
          first_name: "New",
          last_name: "User",
        },
        role: "user",
      };

      // Simulando un error en el modelo signUp (error de base de datos, por ejemplo)
      mockUsuariosModel.signUp.mockRejectedValue(new Error("Database error"));

      // Simula que la validación pasa correctamente (success: true)
      (validateUsuarioCreate as jest.Mock).mockReturnValue({
        success: true,
        data: mockUsuarioCreate, // Asegúrate de que se pase el objeto correctamente
      });

      mockRequest = { body: mockUsuarioCreate };

      await usuariosController.signUp(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Verificar que el error se maneja con un estado 500
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Error interno del servidor",
      });
    });
  });

  describe("UsuariosController - createUsuario", () => {
    it("should create a new user and return status 201", async () => {
      const usuarioData: UsuarioCreate = {
        email: "user@example.com",
        role: "admin",
        password: "password123",
        user_metadata: {
          first_name: "User",
          last_name: "Example",
        },
      };
      const newUsuario = {
        id: "1",
        email: "user@example.com",
        role: "admin",
        created_at: "2025-03-08T00:00:00Z",
        updated_at: "2025-03-08T00:00:00Z",
        app_metadata: {
          provider: "email",
          providers: ["email"],
        },
        user_metadata: {
          first_name: "User",
          last_name: "Example",
        },
        aud: "authenticated",
      };

      // Asegúrate de que el mock esté configurado correctamente
      mockUsuariosModel.create.mockResolvedValue(newUsuario);

      const mockRequest: Request = {
        body: usuarioData,
        get: jest.fn(),
        header: jest.fn(),
        accepts: jest.fn(),
        acceptsCharsets: jest.fn(),
      } as unknown as Request;

      // Llamada al controlador
      await usuariosController.createUsuario(
        mockRequest,
        mockResponse as Response,
        mockNext
      );

      // Verifica que el método 'create' haya sido llamado con el cuerpo correcto
      expect(mockUsuariosModel.create).toHaveBeenCalledWith(usuarioData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(newUsuario);
    });

    it("should return 400 if validation fails", async () => {
      const invalidUsuarioData: UsuarioCreate = {
        email: "user@example.com",
        role: "admin",
        password: "password123",
        user_metadata: {},
      };

      // Mock de la función de validación para simular que falla la validación
      (validateUsuarioCreate as jest.Mock).mockReturnValue({
        success: false,
        error: "Invalid data", // Mensaje de error que esperamos
      });

      const mockRequest = {
        body: invalidUsuarioData,
      };

      // Llamada al controlador con los mocks
      await usuariosController.createUsuario(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Verifica que se ha llamado con el código de estado 400
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: "Invalid data" });
    });

    it("should return 500 if an error occurs", async () => {
      const usuarioData: UsuarioCreate = {
        email: "user@example.com",
        role: "admin",
        password: "password123",
        user_metadata: { first_name: "User", last_name: "Example" },
      };

      // Simula que se produce un error al crear el usuario
      mockUsuariosModel.create.mockRejectedValue(new Error("Database error"));

      // Simula que la validación pasa (para que no retorne 400)
      (validateUsuarioCreate as jest.Mock).mockReturnValue({ success: true });

      const mockRequest: Request = {
        body: usuarioData,
        get: jest.fn(),
        header: jest.fn(),
        accepts: jest.fn(),
        acceptsCharsets: jest.fn(),
      } as unknown as Request;

      // Llamada al controlador
      await usuariosController.createUsuario(
        mockRequest,
        mockResponse as Response,
        mockNext
      );

      // Verifica que el error se maneja con un estado 500
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Error interno del servidor",
      });
    });
  });

  describe("UsuariosController - updateUsuario", () => {
    it("should update a user and return status 200 when validation succeeds", async () => {
      const id = "1";
      const usuarioData: UsuarioUpdate = {
        email: "updated@example.com",
        role: "user",
        user_metadata: { first_name: "Updated", last_name: "Example" },
        app_metadata: {
          provider: "email",
          providers: ["email"],
        },
      };

      const updatedUser: User = {
        id,
        ...usuarioData,
        created_at: "2025-03-08T00:00:00Z",
        updated_at: "2025-03-08T00:00:00Z",
        aud: "authenticated",
      };

      mockUsuariosModel.update = jest.fn().mockResolvedValue(updatedUser);

      const mockRequest = {
        params: { id },
        body: usuarioData,
      } as unknown as Request;

      await usuariosController.updateUsuario(
        mockRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockUsuariosModel.update).toHaveBeenCalledWith(id, usuarioData);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedUser);
    });

    it("should return 400 if validation fails", async () => {
      const usuarioData = {
        email: "invalid-email",
        role: "user",
      };

      // Mock de la validación para simular un fallo
      (validateUsuarioUpdate as jest.Mock).mockReturnValue({
        success: false,
        error: {
          issues: [{ message: "El email debe ser válido" }],
        },
      });

      const mockRequest = {
        params: { id: "1" },
        body: usuarioData,
      } as unknown as Request;

      await usuariosController.updateUsuario(
        mockRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          issues: [{ message: "El email debe ser válido" }],
        },
      });
    });

    it("should return 404 if the user is not found", async () => {
      const id = "999";
      const usuarioData = {
        email: "nonexistent@example.com",
        role: "user",
      };

      // Validación pasa correctamente
      (validateUsuarioUpdate as jest.Mock).mockReturnValue({ success: true });

      // Simula que el usuario no existe
      mockUsuariosModel.update.mockResolvedValue(null);

      const mockRequest = {
        params: { id },
        body: usuarioData,
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
      const usuarioData = {
        email: "updated@example.com",
        role: "user",
      };

      // Validación pasa correctamente
      (validateUsuarioUpdate as jest.Mock).mockReturnValue({ success: true });

      // Simula un error en la base de datos
      mockUsuariosModel.update.mockRejectedValue(new Error("Database error"));

      const mockRequest = {
        params: { id },
        body: usuarioData,
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

      // Simulamos una validación exitosa
      (validatePassword as jest.Mock).mockReturnValue({
        success: true,
        error: "",
      });

      mockUsuariosModel.changePassword.mockResolvedValue(true);

      await usuariosController.changePassword(
        mockRequest,
        mockResponse as Response,
        mockNext
      );

      expect(validatePassword).toHaveBeenCalledWith(newPassword);
      expect(mockUsuariosModel.changePassword).toHaveBeenCalledWith(
        newPassword
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Contraseña cambiada correctamente",
      });
    });

    it("should return 400 if the password is invalid", async () => {
      const newPassword = "short"; // Contraseña inválida según las reglas
      const mockRequest: Request = {
        body: { newPassword },
        get: jest.fn(),
        header: jest.fn(),
        accepts: jest.fn(),
        acceptsCharsets: jest.fn(),
      } as unknown as Request;

      // Simulamos una validación fallida
      (validatePassword as jest.Mock).mockReturnValue({
        success: false,
        error: "La contraseña debe tener al menos 6 caracteres",
      });

      await usuariosController.changePassword(
        mockRequest,
        mockResponse as Response,
        mockNext
      );

      expect(validatePassword).toHaveBeenCalledWith(newPassword);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "La contraseña debe tener al menos 6 caracteres",
      });
    });

    it("should return 404 if the user is not found", async () => {
      const newPassword = "newPassword123";
      const mockRequest: Request = {
        body: { newPassword },
        get: jest.fn(),
        header: jest.fn(),
        accepts: jest.fn(),
        acceptsCharsets: jest.fn(),
      } as unknown as Request;

      // Simulamos una validación exitosa
      (validatePassword as jest.Mock).mockReturnValue({
        success: true,
        error: "",
      });

      mockUsuariosModel.changePassword.mockResolvedValue(false);

      await usuariosController.changePassword(
        mockRequest,
        mockResponse as Response,
        mockNext
      );

      expect(validatePassword).toHaveBeenCalledWith(newPassword);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Usuario no encontrado",
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

      // Simulamos una validación exitosa
      (validatePassword as jest.Mock).mockReturnValue({
        success: true,
        error: "",
      });

      mockUsuariosModel.changePassword.mockRejectedValue(
        new Error("Database error")
      );

      await usuariosController.changePassword(
        mockRequest,
        mockResponse as Response,
        mockNext
      );

      expect(validatePassword).toHaveBeenCalledWith(newPassword);
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

      // Mock de la función resetEmail
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

      // Simular que resetEmail falla
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

      // Simular un error en la base de datos
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

    it("should return 400 if the email validation fails", async () => {
      const email = "invalid-email";
      const mockRequest: Request = {
        body: { email },
        get: jest.fn(),
        header: jest.fn(),
        accepts: jest.fn(),
        acceptsCharsets: jest.fn(),
      } as unknown as Request;

      // Mock para simular que la validación falla
      (validateEmail as jest.Mock).mockReturnValue({
        success: false,
        error: "Error al restablecer el correo",
      });

      await usuariosController.resetEmail(
        mockRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Error al restablecer el correo", // Mensaje de error de validación
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
        message: "Inicio de sesión exitoso",
        session: "fake-token",
        user: {
          id: "1",
          email: "user@example.com",
          role: "admin",
          created_at: "2025-03-08T00:00:00Z",
          updated_at: "2025-03-08T00:00:00Z",
          app_metadata: {
            provider: "email",
            providers: ["email"],
          },
          user_metadata: {
            first_name: "User",
            last_name: "Example",
          },
          aud: "authenticated",
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

    it("should return 401 if credentials are invalid", async () => {
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

      // Verificamos que la respuesta tenga el código de estado 401
      expect(mockResponse.status).toHaveBeenCalledWith(401);

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

  describe("resetPassword", () => {
    it("should return 200 if password is successfully reset", async () => {
      const email = "user@example.com";

      (validateEmail as jest.Mock).mockReturnValue({
        success: true,
      });

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

      (validateEmail as jest.Mock).mockReturnValue({
        success: true,
      });

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

      (validateEmail as jest.Mock).mockReturnValue({
        success: true,
      });

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

    it("should return 400 if the email is invalid", async () => {
      const invalidEmail = "invalid-email";

      (validateEmail as jest.Mock).mockReturnValue({
        success: false,
        error: "Invalid email format",
      });

      mockRequest.body = { email: invalidEmail };

      await usuariosController.resetPassword(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Invalid email format",
      });
    });
  });
});
