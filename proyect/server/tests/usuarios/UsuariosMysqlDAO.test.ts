import { ResultSetHeader } from "mysql2";
import mysql from "@/tests/__mocks__/mysql";
import UsuariosMysqlDAO from "@/src/users/model/dao/UsuariosMysqlDAO";
import {
  Usuario,
  UsuarioBD,
  UsuarioUpdate,
} from "@/src/users/model/interfaces/interfacesUsers";
import bcrypt from "bcryptjs";

jest.mock("mysql2", () => ({
  createConnection: mysql.createConnection,
}));

describe("UsuariosMysqlDAO", () => {
  let usuariosDAO: UsuariosMysqlDAO;

  beforeEach(() => {
    usuariosDAO = new UsuariosMysqlDAO();

    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("getAll", () => {
    const mockResultsList: UsuarioBD[] = [
      {
        idUsuario: "1",
        nombreUsuario: "John Doe",
        email: "john@example.com",
        password: "hashedpassword",
        urlImagen: null,
        idRol: 1,
        rol: "admin",
      },
      {
        idUsuario: "2",
        nombreUsuario: "Jane Doe",
        email: "jane@example.com",
        password: "hashedpassword",
        urlImagen: "url.img",
        idRol: 2,
        rol: "user",
      },
      {
        idUsuario: "3",
        nombreUsuario: "Manolo Gonzalez",
        email: "manolo@example.com",
        password: "hashedpassword",
        urlImagen: null,
        idRol: 2,
        rol: "user",
      },
    ];

    it("should return an array of users when query is successful", async () => {
      const mockConnection = mysql.createConnection();

      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[] | ((err: Error | null, results?: any[]) => void),
          callback?: (err: Error | null, results?: any[]) => void
        ) => {
          if (typeof params === "function") {
            params(null, mockResultsList);
          } else if (callback) {
            callback(null, mockResultsList);
          }
          return {} as any;
        }
      );

      const usuarios = await usuariosDAO.getAll();

      const expectedResults: Usuario[] = [
        {
          idUsuario: "1",
          nombreUsuario: "John Doe",
          email: "john@example.com",
          urlImg: null,
          rol: {
            idRol: 1,
            rol: "admin",
          },
        },
        {
          idUsuario: "2",
          nombreUsuario: "Jane Doe",
          email: "jane@example.com",
          urlImg: "url.img",
          rol: {
            idRol: 2,
            rol: "user",
          },
        },
        {
          idUsuario: "3",
          nombreUsuario: "Manolo Gonzalez",
          email: "manolo@example.com",
          urlImg: null,
          rol: {
            idRol: 2,
            rol: "user",
          },
        },
      ];

      expect(usuarios).toEqual(expectedResults);
      expect(mockConnection.query).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if query fails", async () => {
      const mockError = new Error("Database connection error");
      const mockConnection = mysql.createConnection();

      // Simulamos el comportamiento de query con un error
      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[],
          callback: (err: Error | null, results?: any[]) => void
        ) => {
          // En este caso, llamamos al callback con un error para simular la falla en la consulta
          callback(mockError);
        }
      );

      // Verificamos que se lance el error esperado
      await expect(usuariosDAO.getAll()).rejects.toThrow(mockError);
    });

    it("should throw an error if results are not an array", async () => {
      const mockInvalidResults = { message: "Not an array" };
      const mockConnection = mysql.createConnection();

      // Mockeamos query para que devuelva un resultado no array
      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any,
          callback: (err: Error | null, results?: any) => void
        ) => {
          // Llamamos al callback con un error nulo y el resultado no esperado
          callback(null, mockInvalidResults);
        }
      );

      // Verificamos que se lanza el error esperado
      await expect(usuariosDAO.getAll()).rejects.toThrow(
        "Expected array of results but got something else."
      );
    });

    it("should return an empty array if no users are found", async () => {
      const mockResults: Usuario[] = [];
      const mockConnection = mysql.createConnection();

      // Mockeamos query para devolver un array vacío
      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[],
          callback: (err: Error | null, results?: any) => void
        ) => {
          callback(null, mockResults); // Simulamos la respuesta con un array vacío
        }
      );

      // Llamada a la función getAll y comprobación del resultado
      const usuarios = await usuariosDAO.getAll();

      // Comprobamos que el resultado es un array vacío
      expect(usuarios).toEqual(mockResults);
    });

    it("should handle filtering users by idRol", async () => {
      const mockConnection = mysql.createConnection();

      // Mockeamos query para devolver los usuarios filtrados por idRol
      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[],
          callback: (err: Error | null, results?: any) => void
        ) => {
          // Filtrar los usuarios según el idRol
          const filteredResults = mockResultsList.filter(
            (user) => user.idRol === 2
          );
          callback(null, filteredResults); // Simulamos la respuesta con los resultados filtrados
        }
      );

      const expectedResults: Usuario[] = [
        {
          idUsuario: "2",
          nombreUsuario: "Jane Doe",
          email: "jane@example.com",
          urlImg: "url.img", // Este es el valor correcto de urlImg para este usuario
          rol: {
            idRol: 2,
            rol: "user",
          },
        },
        {
          idUsuario: "3",
          nombreUsuario: "Manolo Gonzalez",
          email: "manolo@example.com",
          urlImg: null, // Este es el valor correcto de urlImg para este usuario
          rol: {
            idRol: 2,
            rol: "user",
          },
        },
      ];

      const usuarios = await usuariosDAO.getAll(2); // Filtrado por idRol
      expect(usuarios).toEqual(expectedResults);
    });
  });

  describe("getById", () => {
    it("should return a user when a valid ID is provided", async () => {
      // Preparar datos de prueba
      const mockUsuarioId = "1";
      const mockUsuario = {
        idUsuario: "1",
        nombreUsuario: "John Doe",
        email: "john@example.com",
        urlImg: null,
        rol: {
          idRol: 1,
          rol: "admin",
        },
      };

      // Configurar el mock de la conexión
      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;

      // Mockear la implementación del query
      mockQuery.mockImplementation((query, params, callback) => {
        // Simular un resultado de base de datos
        const mockResults = [
          {
            idUsuario: mockUsuario.idUsuario,
            nombreUsuario: mockUsuario.nombreUsuario,
            email: mockUsuario.email,
            urlImg: mockUsuario.urlImg,
            idRol: mockUsuario.rol.idRol,
            rol: mockUsuario.rol.rol,
          },
        ];

        callback(null, mockResults);
      });

      // Ejecutar el método y verificar
      const result = await usuariosDAO.getById(mockUsuarioId);

      // Verificaciones
      expect(result).toEqual(mockUsuario);
    });

    it("should return null when no user is found", async () => {
      // Preparar datos de prueba
      const mockUsuarioId = "999"; // ID que no existe

      // Configurar el mock de la conexión
      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;

      // Mockear la implementación del query
      mockQuery.mockImplementation((query, params, callback) => {
        // Simular un resultado vacío
        callback(null, []);
      });

      // Ejecutar el método y verificar
      const result = await usuariosDAO.getById(mockUsuarioId);

      // Verificaciones
      expect(result).toBeNull();
    });

    it("should throw an error if database query fails", async () => {
      // Preparar datos de prueba
      const mockUsuarioId = "1";
      const mockError = new Error("Database connection error");

      // Configurar el mock de la conexión
      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;

      // Mockear la implementación del query
      mockQuery.mockImplementation((query, params, callback) => {
        // Simular un error de base de datos
        callback(mockError, null);
      });

      // Ejecutar el método y verificar
      await expect(usuariosDAO.getById(mockUsuarioId)).rejects.toThrow(
        mockError
      );
    });
  });

  describe("getByCredentials", () => {
    it("should return a user when valid credentials are provided", async () => {
      // Datos de prueba
      const mockNombreUsuario = "JohnDoe";
      const mockPassword = "password123";
      const hashedPassword = await bcrypt.hash(mockPassword, 10);

      const mockUsuario = {
        idUsuario: "1",
        nombreUsuario: mockNombreUsuario,
        email: "john@example.com",
        urlImg: null,
        password: hashedPassword,
        rol: {
          idRol: 1,
          rol: "admin",
        },
      };

      // Mock de la conexión
      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;

      // Simulación del resultado de la base de datos
      mockQuery.mockImplementation((query, params, callback) => {
        callback(null, [
          {
            idUsuario: mockUsuario.idUsuario,
            nombreUsuario: mockUsuario.nombreUsuario,
            email: mockUsuario.email,
            urlImg: mockUsuario.urlImg,
            password: mockUsuario.password,
            idRol: mockUsuario.rol.idRol,
            rol: mockUsuario.rol.rol,
          },
        ]);
      });

      // Ejecutar método y verificar
      const result = await usuariosDAO.getByCredentials(
        mockNombreUsuario,
        mockPassword
      );

      expect(result).toEqual({
        idUsuario: mockUsuario.idUsuario,
        nombreUsuario: mockUsuario.nombreUsuario,
        email: mockUsuario.email,
        urlImg: mockUsuario.urlImg,
        rol: mockUsuario.rol,
      });
    });

    it("should return null when the user is not found", async () => {
      const mockNombreUsuario = "NonExistentUser";
      const mockPassword = "password123";

      // Mock de la conexión
      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;

      // Simular un resultado vacío
      mockQuery.mockImplementation((query, params, callback) => {
        callback(null, []);
      });

      // Ejecutar método y verificar
      const result = await usuariosDAO.getByCredentials(
        mockNombreUsuario,
        mockPassword
      );

      expect(result).toBeNull();
    });

    it("should return null when the password is incorrect", async () => {
      const mockNombreUsuario = "JohnDoe";
      const mockPassword = "wrongPassword";
      const hashedPassword = await bcrypt.hash("password123", 10); // Contraseña correcta

      const mockUsuario = {
        idUsuario: "1",
        nombreUsuario: mockNombreUsuario,
        email: "john@example.com",
        urlImg: null,
        password: hashedPassword,
        rol: {
          idRol: 1,
          rol: "admin",
        },
      };

      // Mock de la conexión
      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;

      // Simulación del resultado de la base de datos
      mockQuery.mockImplementation((query, params, callback) => {
        callback(null, [
          {
            idUsuario: mockUsuario.idUsuario,
            nombreUsuario: mockUsuario.nombreUsuario,
            email: mockUsuario.email,
            urlImg: mockUsuario.urlImg,
            password: mockUsuario.password,
            idRol: mockUsuario.rol.idRol,
            rol: mockUsuario.rol.rol,
          },
        ]);
      });

      // Ejecutar método y verificar
      const result = await usuariosDAO.getByCredentials(
        mockNombreUsuario,
        mockPassword
      );

      expect(result).toBeNull();
    });

    it("should throw an error if database query fails", async () => {
      const mockNombreUsuario = "JohnDoe";
      const mockPassword = "password123";
      const mockError = new Error("Database connection error");

      // Mock de la conexión
      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;

      // Simular un error de base de datos
      mockQuery.mockImplementation((query, params, callback) => {
        callback(mockError, null);
      });

      // Ejecutar método y verificar
      await expect(
        usuariosDAO.getByCredentials(mockNombreUsuario, mockPassword)
      ).rejects.toThrow(mockError);
    });
  });

  describe("getByCredentials", () => {
    it("should return a user when valid credentials are provided", async () => {
      // Datos de prueba
      const mockEmail = "john@example.com";
      const mockPassword = "password123";
      const hashedPassword = await bcrypt.hash(mockPassword, 10);

      const mockUsuario = {
        idUsuario: "1",
        nombreUsuario: "JohnDoe",
        email: mockEmail,
        urlImg: null,
        password: hashedPassword,
        rol: {
          idRol: 1,
          rol: "admin",
        },
      };

      // Mock de la conexión
      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;

      // Simulación del resultado de la base de datos
      mockQuery.mockImplementation((query, params, callback) => {
        callback(null, [
          {
            idUsuario: mockUsuario.idUsuario,
            nombreUsuario: mockUsuario.nombreUsuario,
            email: mockUsuario.email,
            urlImg: mockUsuario.urlImg,
            password: mockUsuario.password,
            idRol: mockUsuario.rol.idRol,
            rol: mockUsuario.rol.rol,
          },
        ]);
      });

      // Ejecutar método y verificar
      const result = await usuariosDAO.getByCredentials(
        mockEmail,
        mockPassword
      );

      expect(result).toEqual({
        idUsuario: mockUsuario.idUsuario,
        nombreUsuario: mockUsuario.nombreUsuario,
        email: mockUsuario.email,
        urlImg: mockUsuario.urlImg,
        rol: mockUsuario.rol,
      });
    });

    it("should return null when the user is not found", async () => {
      const mockEmail = "nonexistent@example.com";
      const mockPassword = "password123";

      // Mock de la conexión
      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;

      // Simular un resultado vacío
      mockQuery.mockImplementation((query, params, callback) => {
        callback(null, []);
      });

      // Ejecutar método y verificar
      const result = await usuariosDAO.getByCredentials(
        mockEmail,
        mockPassword
      );

      expect(result).toBeNull();
    });

    it("should return null when the password is incorrect", async () => {
      const mockEmail = "john@example.com";
      const mockPassword = "wrongPassword";
      const hashedPassword = await bcrypt.hash("password123", 10); // Contraseña correcta

      const mockUsuario = {
        idUsuario: "1",
        nombreUsuario: "JohnDoe",
        email: mockEmail,
        urlImg: null,
        password: hashedPassword,
        rol: {
          idRol: 1,
          rol: "admin",
        },
      };

      // Mock de la conexión
      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;

      // Simulación del resultado de la base de datos
      mockQuery.mockImplementation((query, params, callback) => {
        callback(null, [
          {
            idUsuario: mockUsuario.idUsuario,
            nombreUsuario: mockUsuario.nombreUsuario,
            email: mockUsuario.email,
            urlImg: mockUsuario.urlImg,
            password: mockUsuario.password,
            idRol: mockUsuario.rol.idRol,
            rol: mockUsuario.rol.rol,
          },
        ]);
      });

      // Ejecutar método y verificar
      const result = await usuariosDAO.getByCredentials(
        mockEmail,
        mockPassword
      );

      expect(result).toBeNull();
    });

    it("should throw an error if database query fails", async () => {
      const mockEmail = "john@example.com";
      const mockPassword = "password123";
      const mockError = new Error("Database connection error");

      // Mock de la conexión
      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;

      // Simular un error de base de datos
      mockQuery.mockImplementation((query, params, callback) => {
        callback(mockError, null);
      });

      // Ejecutar método y verificar
      await expect(
        usuariosDAO.getByCredentials(mockEmail, mockPassword)
      ).rejects.toThrow(mockError);
    });
  });

  describe("create", () => {
    it("should insert a user and return the inserted user", async () => {
      const mockUsuario = {
        nombreUsuario: "john_doe",
        email: "john@example.com",
        password: "hashed_password",
        urlImg: "https://example.com/image.jpg",
        idRol: 2,
      };
      const mockIdUsuario = "123";

      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;

      mockQuery.mockImplementation((query, params, callback) => {
        callback(null, { affectedRows: 1 });
      });

      const result = await usuariosDAO.create(mockIdUsuario, mockUsuario);

      expect(result).toEqual({
        idUsuario: mockIdUsuario,
        nombreUsuario: mockUsuario.nombreUsuario,
        email: mockUsuario.email,
        urlImg: mockUsuario.urlImg,
        idRol: mockUsuario.idRol,
      });
    });

    it("should insert a user with missing optional fields and return defaults", async () => {
      const mockUsuario = {
        email: "john@example.com",
        password: "hashed_password",
      };
      const mockIdUsuario = "456";

      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;

      mockQuery.mockImplementation((query, params, callback) => {
        callback(null, { affectedRows: 1 });
      });

      const result = await usuariosDAO.create(
        mockIdUsuario,
        mockUsuario as any
      );

      expect(result).toEqual({
        idUsuario: mockIdUsuario,
        nombreUsuario: "",
        email: mockUsuario.email,
        urlImg: "",
        idRol: 1,
      });
    });

    it("should throw an error if the database insertion fails", async () => {
      const mockUsuario = {
        nombreUsuario: "john_doe",
        email: "john@example.com",
        password: "hashed_password",
        urlImg: "https://example.com/image.jpg",
        idRol: 2,
      };
      const mockIdUsuario = "789";

      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;
      const mockError = new Error("Database insertion error");

      mockQuery.mockImplementation((query, params, callback) => {
        callback(mockError, null);
      });

      await expect(
        usuariosDAO.create(mockIdUsuario, mockUsuario)
      ).rejects.toThrow("Database insertion error");
    });
  });

  describe("UsuariosMysqlDAO - update", () => {
    it("should successfully update an existing user", async () => {
      // Preparar datos de prueba
      const userId = "1";
      const userToUpdate: UsuarioUpdate = {
        nombreUsuario: "usuario_actualizado",
        email: "usuario@actualizado.com",
        urlImg: "https://nueva-imagen.com",
        idRol: 2,
      };

      // Configurar el mock de la conexión
      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;

      // Mockear la implementación del query
      mockQuery.mockImplementation((query, params, callback) => {
        // Simular un ResultSetHeader con affectedRows
        const mockResults = {
          affectedRows: 1,
        } as ResultSetHeader;

        callback(null, mockResults);
      });

      // Ejecutar el método y verificar
      const result = await usuariosDAO.update(userId, userToUpdate);

      // Verificaciones
      expect(result).toEqual({
        idUsuario: userId,
        nombreUsuario: userToUpdate.nombreUsuario,
        email: userToUpdate.email,
        urlImg: userToUpdate.urlImg,
        idRol: userToUpdate.idRol,
      });

      // Verificar que la query fue llamada con los parámetros correctos
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE"),
        [
          userToUpdate.nombreUsuario,
          userToUpdate.email,
          userToUpdate.urlImg,
          userToUpdate.idRol,
          userId,
        ],
        expect.any(Function)
      );
    });

    it("should throw an error if user is not found", async () => {
      // Preparar datos de prueba
      const userId = "999"; // ID que no existe
      const userToUpdate: UsuarioUpdate = {
        nombreUsuario: "usuario_inexistente",
        email: "usuario@inexistente.com",
        urlImg: "https://inexistente.com",
        idRol: 1,
      };

      // Configurar el mock de la conexión
      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;

      // Mockear la implementación del query para simular 0 filas afectadas
      mockQuery.mockImplementation((query, params, callback) => {
        const mockResults = {
          affectedRows: 0,
        } as ResultSetHeader;

        callback(null, mockResults);
      });

      // Ejecutar el método y verificar que lanza un error
      await expect(usuariosDAO.update(userId, userToUpdate)).rejects.toThrow(
        "User not found"
      );
    });

    it("should throw an error if database query fails", async () => {
      // Preparar datos de prueba
      const userId = "1";
      const userToUpdate: UsuarioUpdate = {
        nombreUsuario: "usuario_actualizado",
        email: "usuario@actualizado.com",
        urlImg: "https://nueva-imagen.com",
        idRol: 2,
      };
      const mockError = new Error("Database update error");

      // Configurar el mock de la conexión
      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;

      // Mockear la implementación del query para simular un error
      mockQuery.mockImplementation((query, params, callback) => {
        callback(mockError, null);
      });

      // Ejecutar el método y verificar que lanza un error
      await expect(usuariosDAO.update(userId, userToUpdate)).rejects.toThrow(
        "Database update error: Database update error"
      );
    });
  });

  describe("usuariosDAO - updatePassword", () => {
    it("should successfully update an existing user", async () => {
      // Preparar datos de prueba
      const userId = "1";
      const newPassword: string = "nueva_contraseña";

      // Configurar el mock de la conexión
      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;

      // Mockear la implementación del query
      mockQuery.mockImplementation((query, params, callback) => {
        // Simular un ResultSetHeader con affectedRows
        const mockResults = {
          affectedRows: 1,
        } as ResultSetHeader;

        callback(null, mockResults);
      });

      // Ejecutar el método y verificar
      const result = await usuariosDAO.updatePassword(userId, newPassword);

      // Verificaciones
      expect(result).toEqual(true);

      // Verificar que la query fue llamada con los parámetros correctos
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE"),
        [newPassword, userId],
        expect.any(Function)
      );
    });

    it("should throw an error if user is not found", async () => {
      // Preparar datos de prueba
      const userId = "999";
      const newPassword: string = "nueva_contraseña";

      // Configurar el mock de la conexión
      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;

      // Mockear la implementación del query para simular 0 filas afectadas
      mockQuery.mockImplementation((query, params, callback) => {
        const mockResults = {
          affectedRows: 0,
        } as ResultSetHeader;

        callback(null, mockResults);
      });

      // Ejecutar el método y verificar que lanza un error
      await expect(
        usuariosDAO.updatePassword(userId, newPassword)
      ).rejects.toThrow("User not found");
    });

    it("should throw an error if database query fails", async () => {
      // Preparar datos de prueba
      const userId = "1";
      const newPassword: string = "nueva_contraseña";

      const mockError = new Error("Database update error");

      // Configurar el mock de la conexión
      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;

      // Mockear la implementación del query para simular un error
      mockQuery.mockImplementation((query, params, callback) => {
        callback(mockError, null);
      });

      // Ejecutar el método y verificar que lanza un error
      await expect(
        usuariosDAO.updatePassword(userId, newPassword)
      ).rejects.toThrow("Database update error: Database update error");
    });
  });

  describe("UsuariosMysqlDAO - delete", () => {
    it("should return true when the user is successfully deleted", () => {
      // Preparar datos de prueba
      const mockUserId = "1";
      const mockResults = { affectedRows: 1 } as ResultSetHeader;

      // Configurar el mock de la conexión
      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;

      // Mockear la implementación del query para simular una eliminación exitosa
      mockQuery.mockImplementation((query, params, callback) => {
        callback(null, mockResults);
      });

      // Ejecutar el método y verificar
      return expect(usuariosDAO.delete(mockUserId)).resolves.toBe(true);
    });

    it("should throw an error if user is not found", () => {
      // Preparar datos de prueba
      const mockUserId = "999"; // ID que no existe
      const mockResults = { affectedRows: 0 } as ResultSetHeader;

      // Configurar el mock de la conexión
      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;

      // Mockear la implementación del query para simular un caso donde no se eliminen filas
      mockQuery.mockImplementation((query, params, callback) => {
        callback(null, mockResults);
      });

      // Ejecutar el método y verificar que lanza un error
      return expect(usuariosDAO.delete(mockUserId)).rejects.toThrow(
        "Usuario no encontrado"
      );
    });

    it("should throw an error if database query fails", () => {
      // Preparar datos de prueba
      const mockUserId = "1";
      const mockError = new Error("Database deletion error");

      // Configurar el mock de la conexión
      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;

      // Mockear la implementación del query para simular un error de base de datos
      mockQuery.mockImplementation((query, params, callback) => {
        callback(mockError, null);
      });

      // Ejecutar el método y verificar que lanza un error
      return expect(usuariosDAO.delete(mockUserId)).rejects.toThrow(mockError);
    });
  });
});
