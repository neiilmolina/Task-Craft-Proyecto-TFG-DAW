import createRouteUsuarios from "@/src/usuarios/routesUsuarios";
import express from "express";
import request from "supertest";
import {
  Usuario,
  UsuarioCreate,
  UsuarioReturn,
  UsuarioUpdate,
} from "@/src/usuarios/interfacesUsuarios";
import IUsuariosDAO from "@/src/usuarios/dao/IUsuariosDAO";

const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
});

describe("Usuarios Routes", () => {
  let app: express.Application;
  let mockUsuariosModel: jest.Mocked<IUsuariosDAO>;

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

    app = express();
    app.use(express.json());
    app.use("/usuarios", createRouteUsuarios(mockUsuariosModel));
  });

  describe("GET /usuarios", () => {
    it("debe devolver un array de usuarios cuando la base de datos tiene datos", async () => {
      const mockUsuarios: Usuario[] = [
        {
          idUsuario: "1",
          nombreUsuario: "usuario1",
          email: "usuario1@example.com",
          urlImg: "https://imagen.com/usuario1.png",
          rol: { idRol: 2, rol: "Admin" },
        },
        {
          idUsuario: "2",
          nombreUsuario: "usuario2",
          email: "usuario2@example.com",
          urlImg: null,
          rol: { idRol: 3, rol: "Editor" },
        },
      ];

      mockUsuariosModel.getAll.mockResolvedValue(mockUsuarios);

      const response = await request(app).get("/usuarios");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsuarios);
      expect(mockUsuariosModel.getAll).toHaveBeenCalled();
    });

    it("debe devolver un array vacío cuando la base de datos no tiene datos", async () => {
      mockUsuariosModel.getAll.mockResolvedValue([]);

      const response = await request(app).get("/usuarios");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
      expect(mockUsuariosModel.getAll).toHaveBeenCalled();
    });

    it("debe devolver un error 500 si falla la obtención de datos", async () => {
      mockUsuariosModel.getAll.mockRejectedValue(
        new Error("Error en la base de datos")
      );

      const response = await request(app).get("/usuarios");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error interno del servidor" });
      expect(mockUsuariosModel.getAll).toHaveBeenCalled();
    });

    it("debe filtrar usuarios por idRol cuando se proporciona un id válido", async () => {
      const idRol = 2;
      const mockUsuarios: Usuario[] = [
        {
          idUsuario: "1",
          nombreUsuario: "usuario1",
          email: "usuario1@example.com",
          urlImg: "https://imagen.com/usuario1.png",
          rol: { idRol: 2, rol: "Admin" },
        },
      ];

      mockUsuariosModel.getAll.mockResolvedValue(mockUsuarios);

      const response = await request(app).get(`/usuarios`).query({ idRol });
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsuarios);
      expect(mockUsuariosModel.getAll).toHaveBeenCalledWith(idRol);
    });
  });

  describe("GET /usuarios/:idUsuario", () => {
    it("debe devolver un usuario cuando el idUsuario existe", async () => {
      const mockUsuario: Usuario = {
        idUsuario: "e86ec149-0f13-4d77-aefa-849ab3992b6e",
        nombreUsuario: "usuario1",
        email: "usuario1@example.com",
        urlImg: "https://imagen.com/usuario1.png",
        rol: { idRol: 2, rol: "Admin" },
      };

      mockUsuariosModel.getById.mockResolvedValue(mockUsuario);

      const response = await request(app).get(
        `/usuarios/e86ec149-0f13-4d77-aefa-849ab3992b6e`
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsuario);
      expect(mockUsuariosModel.getById).toHaveBeenCalledWith(
        "e86ec149-0f13-4d77-aefa-849ab3992b6e"
      );
    });

    it("debe devolver un error 404 cuando el idUsuario no existe", async () => {
      const uid = "e86ec149-0f13-4d77-aefa-849ab3992b6e";
      mockUsuariosModel.getById.mockResolvedValue(null);

      const response = await request(app).get(`/usuarios/${uid}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Usuario no encontrado" });
      expect(mockUsuariosModel.getById).toHaveBeenCalledWith(uid);
    });

    it("debe devolver un error 500 si ocurre un fallo en la base de datos", async () => {
      mockUsuariosModel.getById.mockRejectedValue(new Error("DB error"));
      const uid = "e86ec149-0f13-4d77-aefa-849ab3992b6e";

      const response = await request(app).get(`/usuarios/${uid}`);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Error interno del servidor" });
      expect(mockUsuariosModel.getById).toHaveBeenCalledWith(uid);
    });

    it("debe manejar correctamente un idUsuario inválido (NaN)", async () => {
      const response = await request(app).get(`/usuarios/abc`);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "El ID del usuario debe ser válido",
      });
    });
  });

  describe("POST /validateUser", () => {
    it("debe devolver un usuario cuando las credenciales son correctas", async () => {
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

      // Realiza la petición al endpoint
      const response = await request(app)
        .post("/usuarios/validateUser")
        .send(mockCredentials);

      // Verificaciones
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsuario);
      expect(mockUsuariosModel.getByCredentials).toHaveBeenCalledWith(
        mockCredentials.email,
        mockCredentials.password
      );
    });

    it("debe devolver un error 404 si el usuario no existe", async () => {
      const mockCredentials = {
        email: "nonexistent@example.com",
        password: "password123",
      };

      // Simula la respuesta del controlador `getByCredentials`
      mockUsuariosModel.getByCredentials.mockResolvedValue(null);

      const response = await request(app)
        .post("/usuarios/validateUser")
        .send(mockCredentials);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Usuario no encontrado" });
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
        .post("/usuarios/validateUser")
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
        .post("/usuarios/validateUser")
        .send({ email: "", password: "" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "El email y la contraseña son obligatorios",
      });
    });
  });

  describe("POST /usuarios/create", () => {
    it("debe crear un usuario cuando los datos son válidos", async () => {
      const nuevoUsuario: UsuarioCreate = {
        nombreUsuario: "nuevoUsuario",
        email: "nuevo@example.com",
        urlImg: "https://imagen.com/nuevo.png",
        idRol: 1,
        password: "password123",
      };

      const usuarioReturn: UsuarioReturn = {
        idUsuario: "550e8400-e29b-41d4-a716-446655440000",
        nombreUsuario: nuevoUsuario.nombreUsuario,
        email: nuevoUsuario.email,
        urlImg: nuevoUsuario.urlImg,
        idRol: nuevoUsuario.idRol || 1,
      };

      mockUsuariosModel.create.mockResolvedValue(usuarioReturn);

      const response = await request(app)
        .post("/usuarios/create")
        .send(nuevoUsuario);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(usuarioReturn);
      expect(mockUsuariosModel.create).toHaveBeenCalledWith(
        expect.any(String), // El idUsuario se genera dinámicamente
        expect.objectContaining({
          nombreUsuario: nuevoUsuario.nombreUsuario,
          email: nuevoUsuario.email,
          urlImg: nuevoUsuario.urlImg,
          idRol: nuevoUsuario.idRol,
          password: expect.any(String), // La contraseña es encriptada
        })
      );
    });

    it("debe devolver 400 si los datos son inválidos", async () => {
      const datosInvalidos = {}; // Faltan campos requeridos

      const response = await request(app)
        .post("/usuarios/create")
        .send(datosInvalidos);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "error",
        "Todos los campos son obligatorios"
      );

      // Asegurar que `create` no se llama
      expect(mockUsuariosModel.create).not.toHaveBeenCalled();
    });

    it("debe devolver 500 si hay un error interno", async () => {
      mockUsuariosModel.create.mockRejectedValue(new Error("Error en la BD"));

      const usuarioValido: UsuarioCreate = {
        nombreUsuario: "usuarioError",
        email: "error@example.com",
        urlImg: "https://imagen.com/error.png",
        idRol: 2,
        password: "password123",
      };

      const response = await request(app)
        .post("/usuarios/create")
        .send(usuarioValido);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty(
        "error",
        "Error interno del servidor"
      );
    });
  });

  describe("PUT /usuarios/update/:idUsuario", () => {
    const idUsuarioValido = "550e8400-e29b-41d4-a716-446655440000";

    it("debe actualizar un usuario cuando los datos son válidos", async () => {
      const datosActualizados: UsuarioUpdate = {
        nombreUsuario: "usuarioActualizado",
        email: "actualizado@example.com",
        urlImg: "https://imagen.com/actualizado.png",
        idRol: 2,
      };

      const usuarioActualizado: UsuarioReturn = {
        idUsuario: idUsuarioValido,
        nombreUsuario: datosActualizados.nombreUsuario,
        email: datosActualizados.email || "default@example.com",
        urlImg: datosActualizados.urlImg,
        idRol: datosActualizados.idRol ?? 1,
      };

      mockUsuariosModel.update.mockResolvedValue(usuarioActualizado);

      const response = await request(app)
        .put(`/usuarios/update/${idUsuarioValido}`)
        .send(datosActualizados);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(usuarioActualizado);
      expect(mockUsuariosModel.update).toHaveBeenCalledWith(
        idUsuarioValido,
        datosActualizados
      );
    });

    it("debe devolver 400 si la validación falla", async () => {
      const datosInvalidos = { email: "correo-invalido" };

      const response = await request(app)
        .put(`/usuarios/update/${idUsuarioValido}`)
        .send(datosInvalidos);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(mockUsuariosModel.update).not.toHaveBeenCalled();
    });

    it("debe devolver 404 si el usuario no existe", async () => {
      const response = await request(app)
        .put(`/usuarios/update/550e8400-e29b-41d4-a716-446655440000`)
        .send({ nombreUsuario: "NuevoNombre" }); // Aquí no se está enviando `idUsuario`, solo `nombreUsuario`

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        "error",
        "El usuario no se ha encontrado"
      );
    });

    it("debe devolver 500 si ocurre un error en el servidor", async () => {
      mockUsuariosModel.update.mockRejectedValue(new Error("Error en la BD"));

      const response = await request(app)
        .put(`/usuarios/update/${idUsuarioValido}`)
        .send({ nombreUsuario: "UsuarioError" });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty(
        "error",
        "Error interno del servidor"
      );
    });

    it("debería devolver un estado 400 si el id no es un UUID válido", async () => {
      const idUsuario = "invalid-id";

      const response = await request(app).put(`/usuarios/update/${idUsuario}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "error",
        "El ID del usuario debe ser válido"
      );
    });
  });

  describe("PUT /usuarios/updatePassword/:idUsuario", () => {
    const idUsuarioValido = "550e8400-e29b-41d4-a716-446655440000";
    const contraseñaValida = "Contraseña123";

    it("debe actualizar la contraseña del usuario cuando los datos son válidos", async () => {
      // Simulamos que la actualización de la contraseña es exitosa
      mockUsuariosModel.updatePassword.mockResolvedValue(true);

      const response = await request(app)
        .put(`/usuarios/updatePassword/${idUsuarioValido}`)
        .send({ password: contraseñaValida });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(true); // Verifica que la respuesta sea `true`
      expect(mockUsuariosModel.updatePassword).toHaveBeenCalledWith(
        idUsuarioValido,
        expect.any(String) // Asegurándose que la contraseña es hasheada internamente
      );
    });

    it("debe devolver 400 si la contraseña no es válida", async () => {
      const contraseñaInvalida = "123";

      const response = await request(app)
        .put(`/usuarios/updatePassword/${idUsuarioValido}`)
        .send({ password: contraseñaInvalida });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(mockUsuariosModel.updatePassword).not.toHaveBeenCalled();
    });

    it("debe devolver 404 si el usuario no existe", async () => {
      mockUsuariosModel.updatePassword.mockRejectedValue(
        new Error("User not found")
      );

      const response = await request(app)
        .put(`/usuarios/updatePassword/${idUsuarioValido}`)
        .send({ password: contraseñaValida });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        "error",
        "El usuario no se ha encontrado"
      );
    });

    it("debe devolver 500 si ocurre un error en el servidor", async () => {
      mockUsuariosModel.updatePassword.mockRejectedValue(
        new Error("Error en la BD")
      );

      const response = await request(app)
        .put(`/usuarios/updatePassword/${idUsuarioValido}`)
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
        .put(`/usuarios/updatePassword/${idInvalido}`)
        .send({ password: contraseñaValida });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "error",
        "El ID del usuario debe ser válido"
      );
    });
  });

  describe("DELETE /usuarios/:idUsuario", () => {
    const idUsuario = "550e8400-e29b-41d4-a716-446655440000";
    it("debería eliminar un usuario existente y devolver un estado 200", async () => {
      // Simula una respuesta exitosa del modelo
      mockUsuariosModel.delete = jest.fn().mockResolvedValue({ idUsuario });

      const response = await request(app).delete(`/usuarios/${idUsuario}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ idUsuario });
    });

    it("debería devolver un estado 404 si el usuario no existe", async () => {
      // Simula que no se encuentra el usuario
      mockUsuariosModel.delete = jest.fn().mockResolvedValue(null);

      const response = await request(app).delete(`/usuarios/${idUsuario}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error", "Usuario no encontrado");
    });

    it("debería devolver un estado 500 si ocurre un error interno", async () => {
      // Simula un error en la base de datos
      mockUsuariosModel.delete = jest
        .fn()
        .mockRejectedValue(new Error("Error interno"));

      const response = await request(app).delete(`/usuarios/${idUsuario}`);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty(
        "error",
        "Error interno del servidor"
      );
    });

    it("debería devolver un estado 400 si el id no es un UUID válido", async () => {
      const idUsuario = "invalid-id";

      const response = await request(app).delete(`/usuarios/${idUsuario}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "error",
        "El ID del usuario debe ser válido"
      );
    });
  });
});
