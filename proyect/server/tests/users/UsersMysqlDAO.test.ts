import { ResultSetHeader } from "mysql2";
import mysql from "@/tests/__mocks__/mysql";
import UsersMysqlDAO from "@/src/users/model/dao/UsersMysqlDAO";
import {
  User,
  UserBD,
  UserUpdate,
} from "task-craft-models";
import bcrypt from "bcryptjs";

jest.mock("mysql2", () => ({
  createConnection: mysql.createConnection,
}));

describe("UsersMysqlDAO", () => {
  let usersDAO: UsersMysqlDAO;

  beforeEach(() => {
    usersDAO = new UsersMysqlDAO();

    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("getAll", () => {
    const mockResultsList: UserBD[] = [
      {
        idUser: "1",
        userName: "John Doe",
        email: "john@example.com",
        password: "hashedpassword",
        urlImg: null,
        idRol: 1,
        role: "admin",
      },
      {
        idUser: "2",
        userName: "Jane Doe",
        email: "jane@example.com",
        password: "hashedpassword",
        urlImg: "url.img",
        idRol: 2,
        role: "user",
      },
      {
        idUser: "3",
        userName: "Manolo Gonzalez",
        email: "manolo@example.com",
        password: "hashedpassword",
        urlImg: null,
        idRol: 2,
        role: "user",
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

      const usuarios = await usersDAO.getAll();

      const expectedResults: User[] = [
        {
          idUser: "1",
          userName: "John Doe",
          email: "john@example.com",
          urlImg: null,
          role: {
            idRole: 1,
            role: "admin",
          },
        },
        {
          idUser: "2",
          userName: "Jane Doe",
          email: "jane@example.com",
          urlImg: "url.img",
          role: {
            idRole: 2,
            role: "user",
          },
        },
        {
          idUser: "3",
          userName: "Manolo Gonzalez",
          email: "manolo@example.com",
          urlImg: null,
          role: {
            idRole: 2,
            role: "user",
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
      await expect(usersDAO.getAll()).rejects.toThrow(mockError);
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
      await expect(usersDAO.getAll()).rejects.toThrow(
        "Expected array of results but got something else."
      );
    });

    it("should return an empty array if no users are found", async () => {
      const mockResults: User[] = [];
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
      const users = await usersDAO.getAll();

      // Comprobamos que el resultado es un array vacío
      expect(users).toEqual(mockResults);
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

      const expectedResults: User[] = [
        {
          idUser: "2",
          userName: "Jane Doe",
          email: "jane@example.com",
          urlImg: "url.img", // Este es el valor correcto de urlImg para este usuario
          role: {
            idRole: 2,
            role: "user",
          },
        },
        {
          idUser: "3",
          userName: "Manolo Gonzalez",
          email: "manolo@example.com",
          urlImg: null, // Este es el valor correcto de urlImg para este usuario
          role: {
            idRole: 2,
            role: "user",
          },
        },
      ];

      const usuarios = await usersDAO.getAll(2); // Filtrado por idRol
      expect(usuarios).toEqual(expectedResults);
    });
  });

  describe("getById", () => {
    it("should return a user when a valid ID is provided", async () => {
      // Preparar datos de prueba
      const mockUserId = "1";
      const mockUser = {
        idUser: "1",
        userName: "John Doe",
        email: "john@example.com",
        urlImg: null,
        role: {
          idRol: 1,
          role: "admin",
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
            idUser: mockUser.idUser,
            userName: mockUser.userName,
            email: mockUser.email,
            urlImg: mockUser.urlImg,
            idRol: mockUser.role.idRol,
            role: mockUser.role.role,
          },
        ];

        callback(null, mockResults);
      });

      // Ejecutar el método y verificar
      const result = await usersDAO.getById(mockUserId);

      // Verificaciones
      expect(result).toEqual(mockUser);
    });

    it("should return null when no user is found", async () => {
      // Preparar datos de prueba
      const mockUserId = "999"; // ID que no existe

      // Configurar el mock de la conexión
      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;

      // Mockear la implementación del query
      mockQuery.mockImplementation((query, params, callback) => {
        // Simular un resultado vacío
        callback(null, []);
      });

      // Ejecutar el método y verificar
      const result = await usersDAO.getById(mockUserId);

      // Verificaciones
      expect(result).toBeNull();
    });

    it("should throw an error if database query fails", async () => {
      // Preparar datos de prueba
      const mockUserId = "1";
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
      await expect(usersDAO.getById(mockUserId)).rejects.toThrow(mockError);
    });
  });

  describe("getByCredentials", () => {
    it("should return a user when valid credentials are provided", async () => {
      // Datos de prueba
      const mockUserName = "JohnDoe";
      const mockPassword = "password123";
      const hashedPassword = await bcrypt.hash(mockPassword, 10);

      const mockUsuario = {
        idUser: "1",
        userName: mockUserName,
        email: "john@example.com",
        urlImg: null,
        password: hashedPassword,
        role: {
          idRol: 1,
          role: "admin",
        },
      };

      // Mock de la conexión
      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;

      // Simulación del resultado de la base de datos
      mockQuery.mockImplementation((query, params, callback) => {
        callback(null, [
          {
            idUser: mockUsuario.idUser,
            userName: mockUsuario.userName,
            email: mockUsuario.email,
            urlImg: mockUsuario.urlImg,
            password: mockUsuario.password,
            idRol: mockUsuario.role.idRol,
            role: mockUsuario.role.role,
          },
        ]);
      });

      // Ejecutar método y verificar
      const result = await usersDAO.getByCredentials(
        mockUserName,
        mockPassword
      );

      expect(result).toEqual({
        idUser: mockUsuario.idUser,
        userName: mockUsuario.userName,
        email: mockUsuario.email,
        urlImg: mockUsuario.urlImg,
        role: mockUsuario.role,
      });
    });

    it("should return null when the user is not found", async () => {
      const mockUserName = "NonExistentUser";
      const mockPassword = "password123";

      // Mock de la conexión
      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;

      // Simular un resultado vacío
      mockQuery.mockImplementation((query, params, callback) => {
        callback(null, []);
      });

      // Ejecutar método y verificar
      const result = await usersDAO.getByCredentials(
        mockUserName,
        mockPassword
      );

      expect(result).toBeNull();
    });

    it("should return null when the password is incorrect", async () => {
      const mockUserName = "JohnDoe";
      const mockPassword = "wrongPassword";
      const hashedPassword = await bcrypt.hash("password123", 10); // Contraseña correcta

      const mockUsuario = {
        idUser: "1",
        userName: mockUserName,
        email: "john@example.com",
        urlImg: null,
        password: hashedPassword,
        role: {
          idRol: 1,
          role: "admin",
        },
      };

      // Mock de la conexión
      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;

      // Simulación del resultado de la base de datos
      mockQuery.mockImplementation((query, params, callback) => {
        callback(null, [
          {
            idUser: mockUsuario.idUser,
            userName: mockUsuario.userName,
            email: mockUsuario.email,
            urlImg: mockUsuario.urlImg,
            password: mockUsuario.password,
            idRol: mockUsuario.role.idRol,
            role: mockUsuario.role.role,
          },
        ]);
      });

      // Ejecutar método y verificar
      const result = await usersDAO.getByCredentials(
        mockUserName,
        mockPassword
      );

      expect(result).toBeNull();
    });

    it("should throw an error if database query fails", async () => {
      const mockUserName = "JohnDoe";
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
        usersDAO.getByCredentials(mockUserName, mockPassword)
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
        idUser: "1",
        userName: "JohnDoe",
        email: mockEmail,
        urlImg: null,
        password: hashedPassword,
        role: {
          idRol: 1,
          role: "admin",
        },
      };

      // Mock de la conexión
      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;

      // Simulación del resultado de la base de datos
      mockQuery.mockImplementation((query, params, callback) => {
        callback(null, [
          {
            idUser: mockUsuario.idUser,
            userName: mockUsuario.userName,
            email: mockUsuario.email,
            urlImg: mockUsuario.urlImg,
            password: mockUsuario.password,
            idRol: mockUsuario.role.idRol,
            role: mockUsuario.role.role,
          },
        ]);
      });

      // Ejecutar método y verificar
      const result = await usersDAO.getByCredentials(mockEmail, mockPassword);

      expect(result).toEqual({
        idUser: mockUsuario.idUser,
        userName: mockUsuario.userName,
        email: mockUsuario.email,
        urlImg: mockUsuario.urlImg,
        role: mockUsuario.role,
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
      const result = await usersDAO.getByCredentials(mockEmail, mockPassword);

      expect(result).toBeNull();
    });

    it("should return null when the password is incorrect", async () => {
      const mockEmail = "john@example.com";
      const mockPassword = "wrongPassword";
      const hashedPassword = await bcrypt.hash("password123", 10); // Contraseña correcta

      const mockUsuario = {
        idUser: "1",
        userName: "JohnDoe",
        email: mockEmail,
        urlImg: null,
        password: hashedPassword,
        role: {
          idRol: 1,
          role: "admin",
        },
      };

      // Mock de la conexión
      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;

      // Simulación del resultado de la base de datos
      mockQuery.mockImplementation((query, params, callback) => {
        callback(null, [
          {
            idUser: mockUsuario.idUser,
            userName: mockUsuario.userName,
            email: mockUsuario.email,
            urlImg: mockUsuario.urlImg,
            password: mockUsuario.password,
            idRol: mockUsuario.role.idRol,
            role: mockUsuario.role.role,
          },
        ]);
      });

      // Ejecutar método y verificar
      const result = await usersDAO.getByCredentials(mockEmail, mockPassword);

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
        usersDAO.getByCredentials(mockEmail, mockPassword)
      ).rejects.toThrow(mockError);
    });
  });

  describe("create", () => {
    it("should insert a user and return the inserted user", async () => {
      const mockUsuario = {
        userName: "john_doe",
        email: "john@example.com",
        password: "hashed_password",
        urlImg: "https://example.com/image.jpg",
        idRol: 2,
      };
      const mockidUser = "123";

      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;

      mockQuery.mockImplementation((query, params, callback) => {
        callback(null, { affectedRows: 1 });
      });

      const result = await usersDAO.create(mockidUser, mockUsuario);

      expect(result).toEqual({
        idUser: mockidUser,
        userName: mockUsuario.userName,
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
      const mockidUser = "456";

      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;

      mockQuery.mockImplementation((query, params, callback) => {
        callback(null, { affectedRows: 1 });
      });

      const result = await usersDAO.create(mockidUser, mockUsuario as any);

      expect(result).toEqual({
        idUser: mockidUser,
        userName: "",
        email: mockUsuario.email,
        urlImg: "",
        idRol: 1,
      });
    });

    it("should throw an error if the database insertion fails", async () => {
      const mockUsuario = {
        userName: "john_doe",
        email: "john@example.com",
        password: "hashed_password",
        urlImg: "https://example.com/image.jpg",
        idRol: 2,
      };
      const mockidUser = "789";

      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;
      const mockError = new Error("Database insertion error");

      mockQuery.mockImplementation((query, params, callback) => {
        callback(mockError, null);
      });

      await expect(usersDAO.create(mockidUser, mockUsuario)).rejects.toThrow(
        "Database insertion error"
      );
    });
  });

  describe("UsersMysqlDAO - update", () => {
    it("should successfully update an existing user", async () => {
      // Preparar datos de prueba
      const userId = "1";
      const userToUpdate: UserUpdate = {
        userName: "usuario_actualizado",
        email: "usuario@actualizado.com",
        urlImg: "https://nueva-imagen.com",
        idRole: 2,
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
      const result = await usersDAO.update(userId, userToUpdate);

      // Verificaciones
      expect(result).toEqual({
        idUser: userId,
        userName: userToUpdate.userName,
        email: userToUpdate.email,
        urlImg: userToUpdate.urlImg,
        idRol: userToUpdate.idRole,
      });

      // Verificar que la query fue llamada con los parámetros correctos
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE"),
        [
          userToUpdate.userName,
          userToUpdate.email,
          userToUpdate.urlImg,
          userToUpdate.idRole,
          userId,
        ],
        expect.any(Function)
      );
    });

    it("should throw an error if user is not found", async () => {
      // Preparar datos de prueba
      const userId = "999"; // ID que no existe
      const userToUpdate: UserUpdate = {
        userName: "usuario_inexistente",
        email: "usuario@inexistente.com",
        urlImg: "https://inexistente.com",
        idRole: 1,
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
      await expect(usersDAO.update(userId, userToUpdate)).rejects.toThrow(
        "User not found"
      );
    });

    it("should throw an error if database query fails", async () => {
      // Preparar datos de prueba
      const userId = "1";
      const userToUpdate: UserUpdate = {
        userName: "usuario_actualizado",
        email: "usuario@actualizado.com",
        urlImg: "https://nueva-imagen.com",
        idRole: 2,
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
      await expect(usersDAO.update(userId, userToUpdate)).rejects.toThrow(
        "Database update error: Database update error"
      );
    });
  });

  describe("usersDAO - updatePassword", () => {
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
      const result = await usersDAO.updatePassword(userId, newPassword);

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
        usersDAO.updatePassword(userId, newPassword)
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
        usersDAO.updatePassword(userId, newPassword)
      ).rejects.toThrow("Database update error: Database update error");
    });
  });

  describe("UsersMysqlDAO - delete", () => {
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
      return expect(usersDAO.delete(mockUserId)).resolves.toBe(true);
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
      return expect(usersDAO.delete(mockUserId)).rejects.toThrow(
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
      return expect(usersDAO.delete(mockUserId)).rejects.toThrow(mockError);
    });
  });
});
