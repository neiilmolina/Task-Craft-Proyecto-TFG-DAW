import createRouteUsers from "@/src/users/controller/routesUsers";
import express from "express";
import request from "supertest";
import {
  User,
  UserCreate,
  UserReturn,
  UserUpdate,
} from "task-craft-models";
import IUsersDAO from "@/src/users/model/dao/IUsersDAO";

const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
});

describe("Users Routes", () => {
  let app: express.Application;
  let mockUsersModel: jest.Mocked<IUsersDAO>;

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

    app = express();
    app.use(express.json());
    app.use("/users", createRouteUsers(mockUsersModel));
  });

  describe("GET /users", () => {
    it("debe devolver un array de users cuando la base de datos tiene datos", async () => {
      const mockUsers: User[] = [
        {
          idUser: "1",
          userName: "user1",
          email: "user1@example.com",
          urlImg: "https://imagen.com/user1.png",
          role: { idRole: 2, role: "Admin" },
        },
        {
          idUser: "2",
          userName: "user2",
          email: "user2@example.com",
          urlImg: null,
          role: { idRole: 3, role: "Editor" },
        },
      ];

      mockUsersModel.getAll.mockResolvedValue(mockUsers);

      const response = await request(app).get("/users");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
      expect(mockUsersModel.getAll).toHaveBeenCalled();
    });

    it("debe devolver un array vacío cuando la base de datos no tiene datos", async () => {
      mockUsersModel.getAll.mockResolvedValue([]);

      const response = await request(app).get("/users");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
      expect(mockUsersModel.getAll).toHaveBeenCalled();
    });

    it("debe devolver un error 500 si falla la obtención de datos", async () => {
      mockUsersModel.getAll.mockRejectedValue(
        new Error("Error en la base de datos")
      );

      const response = await request(app).get("/users");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error interno del servidor" });
      expect(mockUsersModel.getAll).toHaveBeenCalled();
    });

    it("debe filtrar users por idRol cuando se proporciona un id válido", async () => {
      const idRol = 2;
      const mockUsers: User[] = [
        {
          idUser: "1",
          userName: "user1",
          email: "user1@example.com",
          urlImg: "https://imagen.com/user1.png",
          role: { idRole: 2, role: "Admin" },
        },
      ];

      mockUsersModel.getAll.mockResolvedValue(mockUsers);

      const response = await request(app).get(`/users`).query({ idRol });
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
      expect(mockUsersModel.getAll).toHaveBeenCalledWith(idRol);
    });
  });

  describe("GET /users/:idUser", () => {
    it("debe devolver un user cuando el idUser existe", async () => {
      const mockUser: User = {
        idUser: "e86ec149-0f13-4d77-aefa-849ab3992b6e",
        userName: "user1",
        email: "user1@example.com",
        urlImg: "https://imagen.com/user1.png",
        role: { idRole: 2, role: "Admin" },
      };

      mockUsersModel.getById.mockResolvedValue(mockUser);

      const response = await request(app).get(
        `/users/e86ec149-0f13-4d77-aefa-849ab3992b6e`
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
      expect(mockUsersModel.getById).toHaveBeenCalledWith(
        "e86ec149-0f13-4d77-aefa-849ab3992b6e"
      );
    });

    it("debe devolver un error 404 cuando el idUser no existe", async () => {
      const uid = "e86ec149-0f13-4d77-aefa-849ab3992b6e";
      mockUsersModel.getById.mockResolvedValue(null);

      const response = await request(app).get(`/users/${uid}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "User no encontrado" });
      expect(mockUsersModel.getById).toHaveBeenCalledWith(uid);
    });

    it("debe devolver un error 500 si ocurre un fallo en la base de datos", async () => {
      mockUsersModel.getById.mockRejectedValue(new Error("DB error"));
      const uid = "e86ec149-0f13-4d77-aefa-849ab3992b6e";

      const response = await request(app).get(`/users/${uid}`);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error interno del servidor" });
      expect(mockUsersModel.getById).toHaveBeenCalledWith(uid);
    });

    it("debe manejar correctamente un idUser inválido (NaN)", async () => {
      const response = await request(app).get(`/users/abc`);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "El ID del user debe ser válido",
      });
    });
  });

  describe("POST /validateUser", () => {
    it("debe devolver un user cuando las credenciales son correctas", async () => {
      // Mock de las credenciales correctas
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

      // Simula la respuesta del controlador `getByCredentials`
      mockUsersModel.getByCredentials.mockResolvedValue(mockUser);

      // Realiza la petición al endpoint
      const response = await request(app)
        .post("/users/validateUser")
        .send(mockCredentials);

      // Verificaciones
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
      expect(mockUsersModel.getByCredentials).toHaveBeenCalledWith(
        mockCredentials.email,
        mockCredentials.password
      );
    });

    it("debe devolver un error 404 si el user no existe", async () => {
      const mockCredentials = {
        email: "nonexistent@example.com",
        password: "password123",
      };

      // Simula la respuesta del controlador `getByCredentials`
      mockUsersModel.getByCredentials.mockResolvedValue(null);

      const response = await request(app)
        .post("/users/validateUser")
        .send(mockCredentials);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "User no encontrado" });
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
        .post("/users/validateUser")
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
        .post("/users/validateUser")
        .send({ email: "", password: "" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "El email y la contraseña son obligatorios",
      });
    });
  });

  describe("POST /users/create", () => {
    it("debe crear un user cuando los datos son válidos", async () => {
      const nuevoUser: UserCreate = {
        userName: "nuevoUser",
        email: "nuevo@example.com",
        urlImg: "https://imagen.com/nuevo.png",
        idRole: 1,
        password: "password123",
      };

      const userReturn: UserReturn = {
        idUser: "550e8400-e29b-41d4-a716-446655440000",
        userName: nuevoUser.userName,
        email: nuevoUser.email,
        urlImg: nuevoUser.urlImg,
        idRole: nuevoUser.idRole || 1,
      };

      mockUsersModel.create.mockResolvedValue(userReturn);

      const response = await request(app).post("/users/create").send(nuevoUser);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(userReturn);
      expect(mockUsersModel.create).toHaveBeenCalledWith(
        expect.any(String), // El idUser se genera dinámicamente
        expect.objectContaining({
          userName: nuevoUser.userName,
          email: nuevoUser.email,
          urlImg: nuevoUser.urlImg,
          idRole: nuevoUser.idRole,
          password: expect.any(String), // La contraseña es encriptada
        })
      );
    });

    it("debe devolver 400 si los datos son inválidos", async () => {
      const datosInvalidos = {}; // Faltan campos requeridos

      const response = await request(app)
        .post("/users/create")
        .send(datosInvalidos);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "error",
        "Todos los campos son obligatorios"
      );

      // Asegurar que `create` no se llama
      expect(mockUsersModel.create).not.toHaveBeenCalled();
    });

    it("debe devolver 500 si hay un error interno", async () => {
      mockUsersModel.create.mockRejectedValue(new Error("Error en la BD"));

      const userValido: UserCreate = {
        userName: "userError",
        email: "error@example.com",
        urlImg: "https://imagen.com/error.png",
        idRole: 2,
        password: "password123",
      };

      const response = await request(app)
        .post("/users/create")
        .send(userValido);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty(
        "error",
        "Error interno del servidor"
      );
    });
  });

  describe("PUT /users/update/:idUser", () => {
    const idUserValido = "550e8400-e29b-41d4-a716-446655440000";

    it("debe actualizar un user cuando los datos son válidos", async () => {
      const datosActualizados: UserUpdate = {
        userName: "userActualizado",
        email: "actualizado@example.com",
        urlImg: "https://imagen.com/actualizado.png",
        idRole: 2,
      };

      const userActualizado: UserReturn = {
        idUser: idUserValido,
        userName: datosActualizados.userName,
        email: datosActualizados.email || "default@example.com",
        urlImg: datosActualizados.urlImg,
        idRole: datosActualizados.idRole ?? 1,
      };

      mockUsersModel.update.mockResolvedValue(userActualizado);

      const response = await request(app)
        .put(`/users/update/${idUserValido}`)
        .send(datosActualizados);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(userActualizado);
      expect(mockUsersModel.update).toHaveBeenCalledWith(
        idUserValido,
        datosActualizados
      );
    });

    it("debe devolver 400 si la validación falla", async () => {
      const datosInvalidos = { email: "correo-invalido" };

      const response = await request(app)
        .put(`/users/update/${idUserValido}`)
        .send(datosInvalidos);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(mockUsersModel.update).not.toHaveBeenCalled();
    });

    it("debe devolver 404 si el user no existe", async () => {
      const response = await request(app)
        .put(`/users/update/550e8400-e29b-41d4-a716-446655440000`)
        .send({ userName: "NuevoNombre" }); // Aquí no se está enviando `idUser`, solo `userName`

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        "error",
        "El user no se ha encontrado"
      );
    });

    it("debe devolver 500 si ocurre un error en el servidor", async () => {
      mockUsersModel.update.mockRejectedValue(new Error("Error en la BD"));

      const response = await request(app)
        .put(`/users/update/${idUserValido}`)
        .send({ userName: "UserError" });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty(
        "error",
        "Error interno del servidor"
      );
    });

    it("debería devolver un estado 400 si el id no es un UUID válido", async () => {
      const idUser = "invalid-id";

      const response = await request(app).put(`/users/update/${idUser}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "error",
        "El ID del user debe ser válido"
      );
    });
  });

  describe("PUT /users/updatePassword/:idUser", () => {
    const idUserValido = "550e8400-e29b-41d4-a716-446655440000";
    const contraseñaValida = "Contraseña123";

    it("debe actualizar la contraseña del user cuando los datos son válidos", async () => {
      // Simulamos que la actualización de la contraseña es exitosa
      mockUsersModel.updatePassword.mockResolvedValue(true);

      const response = await request(app)
        .put(`/users/updatePassword/${idUserValido}`)
        .send({ password: contraseñaValida });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(true); // Verifica que la respuesta sea `true`
      expect(mockUsersModel.updatePassword).toHaveBeenCalledWith(
        idUserValido,
        expect.any(String) // Asegurándose que la contraseña es hasheada internamente
      );
    });

    it("debe devolver 400 si la contraseña no es válida", async () => {
      const contraseñaInvalida = "123";

      const response = await request(app)
        .put(`/users/updatePassword/${idUserValido}`)
        .send({ password: contraseñaInvalida });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(mockUsersModel.updatePassword).not.toHaveBeenCalled();
    });

    it("debe devolver 404 si el user no existe", async () => {
      mockUsersModel.updatePassword.mockRejectedValue(
        new Error("User not found")
      );

      const response = await request(app)
        .put(`/users/updatePassword/${idUserValido}`)
        .send({ password: contraseñaValida });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        "error",
        "El user no se ha encontrado"
      );
    });

    it("debe devolver 500 si ocurre un error en el servidor", async () => {
      mockUsersModel.updatePassword.mockRejectedValue(
        new Error("Error en la BD")
      );

      const response = await request(app)
        .put(`/users/updatePassword/${idUserValido}`)
        .send({ password: contraseñaValida });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty(
        "error",
        "Error interno del servidor"
      );
    });

    it("debería devolver un estado 400 si el id no es un UUID válido", async () => {
      const idInvalido = "id-no-valido";

      const response = await request(app)
        .put(`/users/updatePassword/${idInvalido}`)
        .send({ password: contraseñaValida });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "error",
        "El ID del user debe ser válido"
      );
    });
  });

  describe("DELETE /users/:idUser", () => {
    const idUser = "550e8400-e29b-41d4-a716-446655440000";
    it("debería eliminar un user existente y devolver un estado 200", async () => {
      // Simula una respuesta exitosa del modelo
      mockUsersModel.delete = jest.fn().mockResolvedValue({ idUser });

      const response = await request(app).delete(`/users/${idUser}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ idUser });
    });

    it("debería devolver un estado 404 si el user no existe", async () => {
      // Simula que no se encuentra el user
      mockUsersModel.delete = jest.fn().mockResolvedValue(null);

      const response = await request(app).delete(`/users/${idUser}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error", "User no encontrado");
    });

    it("debería devolver un estado 500 si ocurre un error interno", async () => {
      // Simula un error en la base de datos
      mockUsersModel.delete = jest
        .fn()
        .mockRejectedValue(new Error("Error interno"));

      const response = await request(app).delete(`/users/${idUser}`);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty(
        "error",
        "Error interno del servidor"
      );
    });

    it("debería devolver un estado 400 si el id no es un UUID válido", async () => {
      const idUser = "invalid-id";

      const response = await request(app).delete(`/users/${idUser}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "error",
        "El ID del user debe ser válido"
      );
    });
  });
});
