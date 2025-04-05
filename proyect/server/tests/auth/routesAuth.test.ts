import express from "express";
import jwt from "jsonwebtoken";
import request from "supertest";
import IUsuariosDAO from "@/src/usuarios/dao/IUsuariosDAO";
import {
  Usuario,
  UsuarioCreate,
  UsuarioReturn,
  UsuarioUpdate,
} from "@/src/usuarios/interfacesUsuarios";
import createAuthRoute from "@/src/auth/routesAuth";

const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
});

// Mockear jwt.sign para que devuelva un token predecible
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("mockToken123"),
}));

describe("Auth Routes", () => {
  let app: express.Application;
  let mockUsuariosModel: jest.Mocked<IUsuariosDAO>;
  let secretKey: string;

  beforeEach(() => {
    mockUsuariosModel = {
      getAll: jest.fn(),
      getByCredentials: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updatePassword: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<IUsuariosDAO>;

    secretKey = process.env.JWT_SECRET as string;

    app = express();
    app.use(express.json());
    app.use("/auth", createAuthRoute(mockUsuariosModel)); // Ajusta la ruta si es necesario
  });

  describe("POST /login", () => {
    it.only("debe devolver un token cuando las credenciales son correctas", async () => {
      // Mock de las credenciales correctas
      const mockCredentials = {
        email: "john@example.com",
        password: "correct_password",
      };

      const mockUsuario = {
        idUsuario: "1",
        nombreUsuario: "john_doe",
        email: "john@example.com",
        urlImg: null,
        rol: {
          idRol: 1,
          rol: "admin",
        },
      };

      // Simula la respuesta del controlador `getByCredentials`
      mockUsuariosModel.getByCredentials.mockResolvedValue(mockUsuario);

      // Simula la función `jwt.sign`
      const mockToken = "mockToken123";
      jwt.sign = jest.fn().mockReturnValue(mockToken);

      // Realiza la petición al endpoint
      const response = await request(app)
        .post("/auth/login")
        .send(mockCredentials);

      // Verificaciones
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Login exitoso");
      expect(response.body.token).toBe(mockToken);
      expect(mockUsuariosModel.getByCredentials).toHaveBeenCalledWith(
        mockCredentials.email,
        mockCredentials.password
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        { idUsuario: mockUsuario.idUsuario, email: mockUsuario.email },
        secretKey,
        { expiresIn: "1h" }
      );
    });

    it("debe devolver un error 404 si el usuario no existe o las credenciales son incorrectas", async () => {
      const mockCredentials = {
        email: "nonexistent@example.com",
        password: "password123",
      };

      // Simula la respuesta del controlador `getByCredentials`
      mockUsuariosModel.getByCredentials.mockResolvedValue(null);

      const response = await request(app)
        .post("/auth/login")
        .send(mockCredentials);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: "Usuario no encontrado o credenciales incorrectas",
      });
      expect(mockUsuariosModel.getByCredentials).toHaveBeenCalledWith(
        mockCredentials.email,
        mockCredentials.password
      );
    });

    it("debe devolver un error 500 si ocurre un fallo en el controlador", async () => {
      const mockCredentials = {
        email: "john@example.com",
        password: "any_password",
      };

      // Simula un error en el controlador
      mockUsuariosModel.getByCredentials.mockRejectedValue(
        new Error("Error interno")
      );

      const response = await request(app)
        .post("/auth/login")
        .send(mockCredentials);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error interno del servidor" });
      expect(mockUsuariosModel.getByCredentials).toHaveBeenCalledWith(
        mockCredentials.email,
        mockCredentials.password
      );
    });

    it("debe devolver un error 400 si los datos de entrada no son válidos", async () => {
      // Datos de entrada no válidos
      const response = await request(app)
        .post("/auth/login")
        .send({ email: "", password: "" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "El email y la contraseña son obligatorios",
      });
    });
  });
});
