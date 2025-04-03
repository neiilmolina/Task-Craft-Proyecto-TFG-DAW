import createRouteUsuarios from "@/src/usuarios/routesUsuarios";
import UsuariosModel from "@/src/usuarios/UsuariosModel";
import express from "express";
import request from "supertest";
import {
  Usuario,
  UsuarioCreate,
  UsuarioReturn,
  UsuarioUpdate,
} from "@/src/usuarios/interfacesUsuarios";
import IUsuariosDAO from "@/src/usuarios/dao/IUsuariosDAO";
import { get } from "http";

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

  describe("POST /usuarios/create", () => {
    it("debe crear un usuario cuando los datos son válidos", async () => {
      const nuevoUsuario: UsuarioCreate = {
        idUsuario: "550e8400-e29b-41d4-a716-446655440000",
        nombreUsuario: "nuevoUsuario",
        email: "nuevo@example.com",
        urlImg: "https://imagen.com/nuevo.png",
        idRol: 1,
        password: "password123",
      };

      const usuarioReturn: UsuarioReturn = {
        idUsuario: nuevoUsuario.idUsuario,
        nombreUsuario: nuevoUsuario.nombreUsuario,
        email: nuevoUsuario.email,
        urlImg: nuevoUsuario.urlImg,
        idRol: nuevoUsuario.idRol || 1,
      };

      mockUsuariosModel.create.mockResolvedValue(usuarioReturn);

      const response = await request(app).post("/usuarios/create").send(nuevoUsuario);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(usuarioReturn);
      expect(mockUsuariosModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          nombreUsuario: nuevoUsuario.nombreUsuario,
          email: nuevoUsuario.email,
          urlImg: nuevoUsuario.urlImg,
          idRol: nuevoUsuario.idRol,
          password: expect.any(String), // Verificamos que la contraseña ha sido encriptada
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
        idUsuario: "550e8400-e29b-41d4-a716-446655440000",
        nombreUsuario: "usuarioError",
        email: "error@example.com",
        urlImg: "https://imagen.com/error.png",
        idRol: 2,
        password: "password123",
      };

      const response = await request(app).post("/usuarios/create").send(usuarioValido);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty(
        "error",
        "Error interno del servidor"
      );
    });
  });

  describe("PUT /usuarios/:idUsuario", () => {
    const idUsuarioValido = "550e8400-e29b-41d4-a716-446655440000";

    it("debe actualizar un usuario cuando los datos son válidos", async () => {
      const datosActualizados: UsuarioUpdate = {
        idUsuario: idUsuarioValido,
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
        .put(`/usuarios/${idUsuarioValido}`)
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
        .put(`/usuarios/${idUsuarioValido}`)
        .send(datosInvalidos);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(mockUsuariosModel.update).not.toHaveBeenCalled();
    });

    it("debe devolver 404 si el usuario no existe", async () => {
      const response = await request(app)
        .put(`/usuarios/550e8400-e29b-41d4-a716-446655440000`)
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
        .put(`/usuarios/${idUsuarioValido}`)
        .send({ nombreUsuario: "UsuarioError" });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty(
        "error",
        "Error interno del servidor"
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
