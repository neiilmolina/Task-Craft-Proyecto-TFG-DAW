import createRouteUsuarios from "@/src/usuarios/routesUsuarios";
import UsuariosModel from "@/src/usuarios/UsuariosModel";
import express from "express";
import request from "supertest";
import {
  Usuario,
  UsuarioCreate,
  UsuarioReturn,
} from "@/src/usuarios/interfacesUsuarios";

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
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<UsuariosModel>;

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

  describe.only("POST /usuarios", () => {
    it("debe crear un usuario cuando los datos son válidos", async () => {
      const nuevoUsuario: UsuarioCreate = {
        nombreUsuario: "nuevoUsuario",
        email: "nuevo@example.com",
        urlImg: "https://imagen.com/nuevo.png",
        idRol: 1,
        password: "password123",
      };

      const usuarioCreado = {
        idUsuario: "550e8400-e29b-41d4-a716-446655440000",
        ...nuevoUsuario,
      };

      const usuarioReturn: UsuarioReturn = {
        idUsuario: usuarioCreado.idUsuario,
        nombreUsuario: usuarioCreado.nombreUsuario,
        email: usuarioCreado.email,
        urlImg: usuarioCreado.urlImg,
        idRol: usuarioCreado.idRol || 1,
      };

      mockUsuariosModel.create.mockResolvedValue(usuarioReturn);

      const response = await request(app).post("/usuarios").send(nuevoUsuario);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(usuarioReturn);
      expect(mockUsuariosModel.create).toHaveBeenCalledWith(
        expect.objectContaining(nuevoUsuario)
      );
    });

    it("debe devolver 400 si los datos son inválidos", async () => {
      const datosInvalidos = {}; // Faltan campos requeridos

      const response = await request(app)
        .post("/usuarios")
        .send(datosInvalidos);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(mockUsuariosModel.create).not.toHaveBeenCalled();
    });

    it("debe devolver 400 si el ID generado no es válido", async () => {
      const nuevoUsuario = {
        nombreUsuario: "usuarioErroneo",
        email: "error@example.com",
        urlImg: "https://imagen.com/error.png",
        idRol: 1,
        password: "password123",
      };

      // Mock de la función randomUUID para simular un ID no válido
      jest
        .spyOn(global.crypto, "randomUUID")
        .mockReturnValue("invalid-uuid-1234-5678-9101-1121"); // Simula un UUID no válido

      const response = await request(app).post("/usuarios").send(nuevoUsuario);

      // Verificamos que se devuelve un error 400 cuando el ID no es válido
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "error",
        "El ID del usuario debe ser válido"
      );

      // Verificamos que no se haya llamado al método de creación
      expect(mockUsuariosModel.create).not.toHaveBeenCalled();
    });

    it("debe devolver 500 si hay un error interno", async () => {
      mockUsuariosModel.create.mockRejectedValue(new Error("Error en la BD"));

      const usuarioValido: UsuarioCreate = {
        nombreUsuario: "usuarioError",
        email: "error@example.com",
        urlImg: "https://imagen.com/error.png",
        idRol: 2, // Cambiado para que sea consistente con la estructura del test
        password: "password123",
      };

      const response = await request(app).post("/usuarios").send(usuarioValido);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty(
        "error",
        "Error interno del servidor"
      );
    });
  });
});
