import express from "express";
import jwt from "jsonwebtoken";
import request from "supertest";
import IUsersDAO from "../../src/users/model/dao/IUsersDAO";
import createAuthRoute from "../../src/auth/routesAuth";
import cookieParser from "cookie-parser";
const KEY_ACCESS_COOKIE = "access_token";

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
  verify: jest.fn(),
}));

describe("Auth Routes", () => {
  let app: express.Application;
  let mockUsersModel: jest.Mocked<IUsersDAO>;
  let secretKey: string;
  beforeEach(() => {
    mockUsersModel = {
      getAll: jest.fn(),
      getByCredentials: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updatePassword: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<IUsersDAO>;

    secretKey = process.env.JWT_SECRET as string;

    app = express();
    app.use(cookieParser());
    app.use(express.json());
    app.use("/auth", createAuthRoute(mockUsersModel)); // Ajusta la ruta si es necesario
  });

  describe("POST /login", () => {
    it("debe devolver un mensaje de éxito y guardar el token en una cookie cuando las credenciales son correctas", async () => {
      const mockCredentials = {
        email: "john@example.com",
        password: "correct_password",
      };

      const mockUser = {
        idUser: "1",
        userName: "john_doe",
        email: "john@example.com",
        urlImg: null,
        role: {
          idRole: 1,
          role: "admin",
        },
      };

      const mockToken = "mockToken123";
      mockUsersModel.getByCredentials.mockResolvedValue(mockUser);
      jwt.sign = jest.fn().mockReturnValue(mockToken);

      const response = await request(app)
        .post("/auth/login")
        .send(mockCredentials);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Login exitoso");

      // Verifica que la cookie esté presente y tenga el nombre correcto
      const cookies = response.header["set-cookie"];
      const cookieArray = Array.isArray(cookies) ? cookies : [cookies];

      const cookieExiste = cookieArray.some((cookie) =>
        cookie.startsWith(`${KEY_ACCESS_COOKIE}=`)
      );

      expect(cookieExiste).toBe(true);

      expect(mockUsersModel.getByCredentials).toHaveBeenCalledWith(
        mockCredentials.email,
        mockCredentials.password
      );

      expect(jwt.sign).toHaveBeenCalledWith(mockUser, secretKey, {
        expiresIn: "1h",
      });
    });
    it("debe devolver un error 404 si el usuario no existe o las credenciales son incorrectas", async () => {
      const mockCredentials = {
        email: "nonexistent@example.com",
        password: "password123",
      };

      // Simula la respuesta del controlador `getByCredentials`
      mockUsersModel.getByCredentials.mockResolvedValue(null);

      const response = await request(app)
        .post("/auth/login")
        .send(mockCredentials);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: "Usuario no encontrado o credenciales incorrectas",
      });
      expect(mockUsersModel.getByCredentials).toHaveBeenCalledWith(
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
      mockUsersModel.getByCredentials.mockRejectedValue(
        new Error("Error interno")
      );

      const response = await request(app)
        .post("/auth/login")
        .send(mockCredentials);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error interno del servidor" });
      expect(mockUsersModel.getByCredentials).toHaveBeenCalledWith(
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

  describe("POST /logout", () => {
    it("debe borrar la cookie y devolver un mensaje de éxito", async () => {
      // Simula una cookie de token en la solicitud
      const response = await request(app)
        .post("/auth/logout")
        .set("Cookie", "token=dummy_token");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Logout exitoso");

      // Verifica que la cookie 'token' haya sido eliminada
      expect(response.headers["set-cookie"][0]).toContain(
        "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
      );
    });
  });

  describe.only("POST /refreshToken", () => {
    it("should return 401 if no token is provided", async () => {
      const response = await request(app)
        .post("/auth/refresh")
        .set("Cookie", [])
        .send();

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("No se ha proporcionado un token");
    });

    it("should return 401 if the token is invalid", async () => {
      const response = await request(app)
        .post("/auth/refresh")
        .set("Cookie", ["dasdasdas"])
        .send();

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("No se ha proporcionado un token");
    });

    it("should return a new token and set it in the cookie if token is valid", async () => {
      const response = await request(app)
        .post("/auth/refresh")
        .set("Cookie", [`${KEY_ACCESS_COOKIE}=mockToken123`])
        .send();

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Token actualizado con éxito");

      // Verificar si el token se establece correctamente en la cookie
      const setCookieHeader = response.header["set-cookie"];
      const tokenInCookie = setCookieHeader && setCookieHeader[0].split(";")[0]; // Solo obtener el token

      expect(tokenInCookie).toContain(KEY_ACCESS_COOKIE); // Verificar que el token esté presente en la cookie
    });

    it("should return 500 if an error occurs during token refresh", async () => {
      jest.spyOn(jwt, "sign").mockImplementationOnce(() => {
        throw new Error("Error al firmar el token");
      });

      const response = await request(app)
        .post("/auth/refresh")
        .set("Cookie", [`${KEY_ACCESS_COOKIE}=mockToken123`])
        .send();

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Error al refrescar el token");
    });
  });
});
