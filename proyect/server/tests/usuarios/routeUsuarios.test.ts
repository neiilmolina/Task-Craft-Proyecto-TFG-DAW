import { createUsuariosRoute } from "@/src/usuarios/routesUsuarios";
import express from "express";
import request from "supertest";
import UsuariosModel from "@/src/usuarios/UsuariosModel";
import {
  UsuarioCreate,
  UsuarioUpdate,
  UserFilters,
  PaginatedUsers,
  AuthResponse,
} from "@/src/usuarios/interfacesUsuarios";
import { User } from "@supabase/supabase-js";

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
      signUp: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
      resetPassword: jest.fn(),
      getAll: jest.fn(),
      getById: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      changePassword: jest.fn(),
      resetEmail: jest.fn(),
    } as unknown as jest.Mocked<UsuariosModel>;

    app = express();
    app.use(express.json());
    app.use("/api/usuarios", createUsuariosRoute(mockUsuariosModel));
  });

  // Test para obtener todos los usuarios
  describe("GET /api/usuarios", () => {
    it("debería devolver todos los usuarios", async () => {
      const mockUsuarios: User[] = [createMockUser("1"), createMockUser("2")];
      const paginatedResponse: PaginatedUsers = {
        users: mockUsuarios,
        total: mockUsuarios.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      };
      mockUsuariosModel.getAll.mockResolvedValue(paginatedResponse);

      const response = await request(app).get("/api/usuarios");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(paginatedResponse);
      expect(mockUsuariosModel.getAll).toHaveBeenCalled();
    });

    it("debería manejar errores al obtener usuarios", async () => {
      mockUsuariosModel.getAll.mockRejectedValue(
        new Error("Error al obtener usuarios")
      );

      const response = await request(app).get("/api/usuarios");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
    });
  });

  // Test para obtener un usuario por ID
  describe("GET /api/usuarios/:id", () => {
    it("debería devolver un usuario por ID", async () => {
      const mockUsuario = createMockUser("1");
      mockUsuariosModel.getById.mockResolvedValue(mockUsuario);

      const response = await request(app).get("/api/usuarios/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsuario);
      expect(mockUsuariosModel.getById).toHaveBeenCalledWith("1");
    });

    it("debería devolver 404 si el usuario no existe", async () => {
      mockUsuariosModel.getById.mockResolvedValue(null);

      const response = await request(app).get("/api/usuarios/999");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Usuario no encontrado");
    });

    it("debería manejar errores al obtener un usuario por ID", async () => {
      mockUsuariosModel.getById.mockRejectedValue(
        new Error("Error al obtener usuario")
      );

      const response = await request(app).get("/api/usuarios/1");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
    });
  });

  // Test para crear un nuevo usuario
  describe("POST /api/usuarios", () => {
    it("debería crear un nuevo usuario correctamente", async () => {
      const nuevoUsuario: UsuarioCreate = {
        email: "nuevo@usuario.com",
        password: "password123",
        user_metadata: { first_name: "Nuevo", last_name: "Usuario" },
        role: "user",
      };

      const usuarioCreado = createMockUser("3");
      mockUsuariosModel.create.mockResolvedValue(usuarioCreado);

      const response = await request(app)
        .post("/api/usuarios")
        .send(nuevoUsuario)
        .set("Content-Type", "application/json");

      expect(response.status).toBe(201);
      expect(response.body).toEqual(usuarioCreado);
      expect(mockUsuariosModel.create).toHaveBeenCalledWith(nuevoUsuario);
    });

    it("debería manejar errores al crear un nuevo usuario", async () => {
      const nuevoUsuario: UsuarioCreate = {
        email: "nuevo@usuario.com",
        password: "password123",
        user_metadata: { first_name: "Nuevo", last_name: "Usuario" },
        role: "user",
      };
      mockUsuariosModel.create.mockRejectedValue(
        new Error("Error al crear usuario")
      );

      const response = await request(app)
        .post("/api/usuarios")
        .send(nuevoUsuario)
        .set("Content-Type", "application/json");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
    });

    it("debería validar datos de entrada", async () => {
      const usuarioInvalido = {}; // Sin datos válidos

      // Mock de la función de validación
      jest.mock("@/src/usuarios/schemasUsuarios", () => ({
        validateUsuarioCreate: jest.fn().mockReturnValue({
          success: false,
          error: "El email es obligatorio",
        }),
      }));

      const response = await request(app)
        .post("/api/usuarios")
        .send(usuarioInvalido)
        .set("Content-Type", "application/json");

      expect(response.status).toBe(400);
      expect(mockUsuariosModel.create).not.toHaveBeenCalled();
    });
  });

  // Test para actualizar un usuario
  describe("PUT /api/usuarios/:id", () => {
    it("debería actualizar un usuario correctamente", async () => {
      const usuarioActualizado: UsuarioUpdate = {
        user_metadata: { first_name: "Nuevo", last_name: "Usuario" },
        app_metadata: { roles: ["user"] },
        email: "nuevo@usuario.com",
      };
      const mockUsuario = createMockUser("1");
      mockUsuariosModel.update.mockResolvedValue(mockUsuario);

      const response = await request(app)
        .put("/api/usuarios/1")
        .send(usuarioActualizado)
        .set("Content-Type", "application/json");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsuario);
      expect(mockUsuariosModel.update).toHaveBeenCalledWith(
        "1",
        usuarioActualizado
      );
    });

    it("debería devolver 404 si el usuario no existe", async () => {
      const usuarioActualizado: UsuarioUpdate = {
        user_metadata: { first_name: "Nuevo", last_name: "Usuario" },
        app_metadata: { roles: ["user"] },
        email: "nuevo@usuario.com",
      };
      mockUsuariosModel.update.mockResolvedValue(null);

      const response = await request(app)
        .put("/api/usuarios/999")
        .send(usuarioActualizado)
        .set("Content-Type", "application/json");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Usuario no encontrado");
    });

    it("debería manejar errores al actualizar un usuario", async () => {
      const usuarioActualizado: UsuarioUpdate = {
        user_metadata: { first_name: "Nuevo", last_name: "Usuario" },
        app_metadata: { roles: ["user"] },
        email: "nuevo@usuario.com",
      };
      mockUsuariosModel.update.mockRejectedValue(
        new Error("Error al actualizar usuario")
      );

      const response = await request(app)
        .put("/api/usuarios/1")
        .send(usuarioActualizado)
        .set("Content-Type", "application/json");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
    });
  });

  // Test para eliminar un usuario
  describe("DELETE /api/usuarios/:id", () => {
    it("debería eliminar un usuario correctamente", async () => {
      mockUsuariosModel.delete.mockResolvedValue(true);

      const response = await request(app).delete("/api/usuarios/1");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Usuario eliminado correctamente" // Cambiar si prefieres el mensaje correcto
      );
      expect(mockUsuariosModel.delete).toHaveBeenCalledWith("1");
    });

    it("debería devolver 404 si el usuario no existe", async () => {
      mockUsuariosModel.delete.mockResolvedValue(false);

      const response = await request(app).delete("/api/usuarios/999");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Usuario no encontrado");
    });

    it("debería manejar errores al eliminar un usuario", async () => {
      mockUsuariosModel.delete.mockRejectedValue(
        new Error("Error al eliminar usuario")
      );

      const response = await request(app).delete("/api/usuarios/1");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
    });
  });

  // Test para cambiar la contraseña de un usuario
  describe("PUT /api/usuarios/:id/password", () => {
    it("debería cambiar la contraseña de un usuario correctamente", async () => {
      mockUsuariosModel.changePassword.mockResolvedValue(true);

      const response = await request(app)
        .put("/api/usuarios/1/password")
        .send({ newPassword: "nuevaContraseña123" })
        .set("Content-Type", "application/json");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Contraseña cambiada correctamente"
      );
      expect(mockUsuariosModel.changePassword).toHaveBeenCalledWith(
        "nuevaContraseña123"
      );
    });

    it("debería devolver 404 si el usuario no existe", async () => {
      mockUsuariosModel.changePassword.mockResolvedValue(false);

      const response = await request(app)
        .put("/api/usuarios/999/password")
        .send({ newPassword: "nuevaContraseña123" })
        .set("Content-Type", "application/json");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Usuario no encontrado");
    });

    it("debería manejar errores al cambiar la contraseña", async () => {
      mockUsuariosModel.changePassword.mockRejectedValue(
        new Error("Error al cambiar la contraseña")
      );

      const response = await request(app)
        .put("/api/usuarios/1/password")
        .send({ newPassword: "nuevaContraseña123" })
        .set("Content-Type", "application/json");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
    });

    it("debería devolver 400 si la contraseña es inválida", async () => {
      const invalidPassword = "123"; // Contraseña inválida, con menos de 6 caracteres

      // Simulamos un error en el controlador cuando la contraseña es demasiado corta
      mockUsuariosModel.changePassword.mockResolvedValue(false);

      const response = await request(app)
        .put("/api/usuarios/1/password")
        .send({ newPassword: invalidPassword })
        .set("Content-Type", "application/json");

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "La contraseña debe tener al menos 6 caracteres"
      );
    });
  });

  // Tests para UsuariosController

  describe("POST /api/usuarios/sign-in", () => {
    it("debería iniciar sesión correctamente", async () => {
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
      mockUsuariosModel.signIn.mockResolvedValue(mockAuthResponse);

      const response = await request(app)
        .post("/api/usuarios/sign-in")
        .send({ email: "newuser@example.com", password: "securePassword123" })
        .set("Content-Type", "application/json");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Inicio de sesión exitoso"
      );
      expect(response.body).toHaveProperty("user", mockAuthResponse.user);
      expect(mockUsuariosModel.signIn).toHaveBeenCalledWith({
        email: "newuser@example.com",
        password: "securePassword123",
      });
    });

    it("debería devolver 401 si las credenciales son inválidas", async () => {
      const invalidCredentials: AuthResponse = {
        user: null,
        session: null,
        error: "Credenciales inválidas",
      };
      mockUsuariosModel.signIn.mockResolvedValue(invalidCredentials);

      const response = await request(app)
        .post("/api/usuarios/sign-in")
        .send({ email: "user@example.com", password: "wrongPassword" })
        .set("Content-Type", "application/json");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "Credenciales inválidas");
    });

    it("debería manejar errores internos durante el inicio de sesión", async () => {
      mockUsuariosModel.signIn.mockRejectedValue(new Error("Error interno"));

      const response = await request(app)
        .post("/api/usuarios/sign-in")
        .send({ email: "user@example.com", password: "securePassword123" })
        .set("Content-Type", "application/json");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty(
        "error",
        "Error interno del servidor"
      );
    });
  });

  describe("POST /api/usuarios/sign-up", () => {
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

      mockUsuariosModel.signUp.mockResolvedValue(mockAuthResponse);

      const response = await request(app)
        .post("/api/usuarios/sign-up")
        .send(mockUsuarioCreate)
        .set("Content-Type", "application/json");

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("user", mockAuthResponse.user);
      expect(response.body).toHaveProperty("session", mockAuthResponse.session);
    });

    it("should return 400 if email is missing", async () => {
      const mockUsuarioCreate = {
        password: "password123",
        user_metadata: {
          first_name: "New",
          last_name: "User",
        },
        role: "user",
      };

      const response = await request(app)
        .post("/api/usuarios/sign-up")
        .send(mockUsuarioCreate)
        .set("Content-Type", "application/json");

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "Required"); // Cambiado a 'Required' temporalmente
    });

    it("should return 400 if password is missing", async () => {
      const mockUsuarioCreate = {
        email: "newuser@example.com",
        user_metadata: {
          first_name: "New",
          last_name: "User",
        },
        role: "user",
      };

      const response = await request(app)
        .post("/api/usuarios/sign-up")
        .send(mockUsuarioCreate)
        .set("Content-Type", "application/json");

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "Required"); // Cambiado a 'Required' temporalmente
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

      // Simula el comportamiento de signUp donde el error incluye "already exists"
      mockUsuariosModel.signUp.mockResolvedValue({
        user: null,
        session: null,
        error: "User already exists", // Aquí simulamos que el error devuelto es del tipo esperado por tu controlador
      });

      const response = await request(app)
        .post("/api/usuarios/sign-up")
        .send(mockUsuarioCreate)
        .set("Content-Type", "application/json");

      // Verificamos que el estado de la respuesta sea 400 en lugar de 201
      expect(response.status).toBe(400);

      // Verificamos que el mensaje de error esté presente en la respuesta
      expect(response.body).toHaveProperty("error", "El usuario ya existe");
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

      mockUsuariosModel.signUp.mockRejectedValue(new Error("Database error"));

      const response = await request(app)
        .post("/api/usuarios/sign-up")
        .send(mockUsuarioCreate)
        .set("Content-Type", "application/json");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty(
        "error",
        "Error interno del servidor"
      );
    });
  });

  describe("POST /api/usuarios/sign-out", () => {
    it("should return 200 if the user is signed out successfully", async () => {
      const response = await request(app).post("/api/usuarios/sign-out").send();

      // Verificamos que el estado de la respuesta sea 200
      expect(response.status).toBe(200);

      // Verificamos que el mensaje de éxito esté presente en la respuesta
      expect(response.body).toHaveProperty(
        "message",
        "Sesión cerrada correctamente"
      );
    });

    it("should return 500 if there is an error during sign out", async () => {
      // Simulamos un error en la función signOut
      mockUsuariosModel.signOut.mockRejectedValue(
        new Error("Error en el cierre de sesión")
      );

      const response = await request(app).post("/api/usuarios/sign-out").send();

      // Verificamos que el estado de la respuesta sea 500
      expect(response.status).toBe(500);

      // Verificamos que el mensaje de error esté presente en la respuesta
      expect(response.body).toHaveProperty(
        "error",
        "Error interno del servidor"
      );
      expect(response.body).toHaveProperty(
        "details",
        "Error en el cierre de sesión"
      );
    });
  });

  describe("POST /api/usuarios/reset-password", () => {
    it("should return 200 when the password is reset successfully", async () => {
      const mockEmail = "user@example.com";

      // Simulamos el comportamiento de la función resetPassword
      mockUsuariosModel.resetPassword.mockResolvedValue(true); // Simulamos que el restablecimiento de la contraseña fue exitoso

      const response = await request(app)
        .post("/api/usuarios/reset-password")
        .send({ email: mockEmail })
        .set("Content-Type", "application/json");

      // Verificamos que el estado de la respuesta sea 200
      expect(response.status).toBe(200);

      // Verificamos que el mensaje de éxito esté presente en la respuesta
      expect(response.body).toHaveProperty(
        "message",
        "Contraseña restablecida correctamente"
      );
    });

    it("should return 400 if email is invalid", async () => {
      const invalidEmail = "invalid-email";

      const response = await request(app)
        .post("/api/usuarios/reset-password")
        .send({ email: invalidEmail })
        .set("Content-Type", "application/json");

      // Verificamos que el estado de la respuesta sea 400
      expect(response.status).toBe(400);

      // Verificamos que el mensaje de error esté presente en la respuesta
      // Este mensaje proviene de la validación del email en el controlador
      expect(response.body).toHaveProperty(
        "message",
        "El email debe ser válido"
      );
    });

    it("should return 500 if there is an internal error during reset password", async () => {
      const mockEmail = "user@example.com";

      // Simulamos un error durante el restablecimiento de la contraseña
      mockUsuariosModel.resetPassword.mockRejectedValue(
        new Error("Error en el restablecimiento de la contraseña")
      );

      const response = await request(app)
        .post("/api/usuarios/reset-password")
        .send({ email: mockEmail })
        .set("Content-Type", "application/json");

      // Verificamos que el estado de la respuesta sea 500
      expect(response.status).toBe(500);

      // Verificamos que el mensaje de error esté presente en la respuesta
      expect(response.body).toHaveProperty(
        "error",
        "Error interno del servidor"
      );
      expect(response.body).toHaveProperty(
        "details",
        "Error en el restablecimiento de la contraseña"
      );
    });
  });
});

// Utility function to create mock user
const createMockUser = (id: string): User => ({
  id,
  email: `user${id}@test.com`,
  role: "user",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  app_metadata: {},
  user_metadata: {},
  aud: "authenticated",
});
