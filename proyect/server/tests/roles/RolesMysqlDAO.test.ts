import mysql from "@/tests/__mocks__/mysql";
import RolesMysqlDAO from "@/src/roles/dao/RolesMysqlDAO";
import { Rol, RolNoId } from "@/src/roles/interfacesRoles";
import { ResultSetHeader } from "mysql2";

// Reemplaza mysql2 con el mock de conexión
jest.mock("mysql2", () => ({
  createConnection: mysql.createConnection,
}));

describe("RolesMysqlDAO", () => {
  let rolesDAO: RolesMysqlDAO;

  beforeEach(() => {
    // Configura la instancia de RolesMysqlDAO antes de cada test
    rolesDAO = new RolesMysqlDAO();

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("RolesMysqlDAO - getAll", () => {
    it("should return an array of roles when query is successful", async () => {
      // Simula una respuesta exitosa de la base de datos
      const mockResults: Rol[] = [
        { idRol: 1, rol: "admin" },
        { idRol: 2, rol: "user" },
      ];

      // Configura el mock para resolver con los resultados esperados
      const mockConnection = mysql.createConnection();

      // Usa un mock más genérico
      mockConnection.query.mockImplementation(
        (
          sql: string,
          callback: (err: Error | null, results?: Rol[]) => void
        ) => {
          callback(null, mockResults);
        }
      );

      const roles = await rolesDAO.getAll();

      // Verifica que los roles coincidan
      expect(roles).toEqual(mockResults);

      // Verifica que se haya llamado al método query
      expect(mockConnection.query).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if query fails", async () => {
      // Simula un error de base de datos
      const mockError = new Error("Database connection error");

      // Get the mock connection
      const mockConnection = mysql.createConnection();

      // Explicitly type the query method as a mock
      const mockQuery = mockConnection.query as jest.Mock;

      // Use a more explicit mock implementation
      mockQuery.mockImplementation(
        (
          query: string,
          callback: (err: Error | null, results?: any) => void
        ) => {
          // Directly call the callback with an error
          callback(mockError);
        }
      );

      // Expect the method to reject with the error
      await expect(rolesDAO.getAll()).rejects.toThrow(mockError);
    });

    it("should throw an error if results are not an array", async () => {
      // Simula un resultado no esperado de la base de datos
      const mockInvalidResults = { message: "Not an array" };

      // Configura el mock para devolver un resultado no array
      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;

      mockQuery.mockImplementation(
        (
          query: string,
          callback: (err: Error | null, results?: any) => void
        ) => {
          // Simulate a successful query with non-array results
          callback(null, mockInvalidResults);
        }
      );

      // Espera que el método lance un error personalizado
      await expect(rolesDAO.getAll()).rejects.toThrow(
        "Expected array of results but got something else."
      );
    });
  });

  describe("RolesMysqlDAO - getById", () => {
    it("should return a role when a valid ID is provided", async () => {
      // Preparar datos de prueba
      const mockRolId = 1;
      const mockRole = {
        idRol: 1,
        rol: "admin",
      };

      // Configurar el mock de la conexión
      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;

      // Mockear la implementación del query
      mockQuery.mockImplementation((query, params, callback) => {
        // Simular un resultado de base de datos
        const mockResults = [
          {
            idRol: mockRolId,
            rol: "admin",
          },
        ];

        callback(null, mockResults);
      });

      // Ejecutar el método y verificar
      const result = await rolesDAO.getById(mockRolId);

      // Verificaciones
      expect(result).toEqual(mockRole);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("SELECT * FROM"),
        [mockRolId],
        expect.any(Function)
      );
    });

    it("should return null when no role is found", async () => {
      // Preparar datos de prueba
      const mockRolId = 999; // ID que no existe

      // Configurar el mock de la conexión
      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;

      // Mockear la implementación del query
      mockQuery.mockImplementation((query, params, callback) => {
        // Simular un resultado vacío
        callback(null, []);
      });

      // Ejecutar el método y verificar
      const result = await rolesDAO.getById(mockRolId);

      // Verificaciones
      expect(result).toBeNull();
    });

    it("should throw an error if database query fails", async () => {
      // Preparar datos de prueba
      const mockRolId = 1;
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
      await expect(rolesDAO.getById(mockRolId)).rejects.toThrow(mockError);
    });
  });

  describe("RolesMysqlDAO - create", () => {
    it("should successfully create a new role", async () => {
      // Preparar datos de prueba
      const roleToCreate: RolNoId = { rol: "nuevo_rol" };
      const mockInsertId = 5;

      // Configurar el mock de la conexión
      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;

      // Mockear la implementación del query
      mockQuery.mockImplementation((query, params, callback) => {
        // Simular un ResultSetHeader con insertId
        const mockResults = {
          insertId: mockInsertId,
          affectedRows: 1,
        } as ResultSetHeader;

        callback(null, mockResults);
      });

      // Ejecutar el método y verificar
      const result = await rolesDAO.create(roleToCreate);

      // Verificaciones
      expect(result).toEqual({
        idRol: mockInsertId,
        rol: roleToCreate.rol,
      });

      // Verificar que la query fue llamada con los parámetros correctos
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO"),
        [roleToCreate.rol],
        expect.any(Function)
      );
    });

    it("should throw an error if database query fails", async () => {
      // Preparar datos de prueba
      const roleToCreate: RolNoId = { rol: "nuevo_rol" };
      const mockError = new Error("Database insertion error");

      // Configurar el mock de la conexión
      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;

      // Mockear la implementación del query para simular un error
      mockQuery.mockImplementation((query, params, callback) => {
        callback(mockError, null);
      });

      // Ejecutar el método y verificar que lanza un error
      await expect(rolesDAO.create(roleToCreate)).rejects.toThrow(mockError);
    });
  });

  describe("RolesMysqlDAO - update", () => {
    it("should successfully update an existing role", async () => {
      // Preparar datos de prueba
      const roleId = 1;
      const roleToUpdate: RolNoId = { rol: "rol_actualizado" };

      // Configurar el mock de la conexión
      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;

      // Mockear la implementación del query
      mockQuery.mockImplementation((query, params, callback) => {
        // Simular un ResultSetHeader con affectedRows
        const mockResults = {
          insertId: 0,
          affectedRows: 1,
        } as ResultSetHeader;

        callback(null, mockResults);
      });

      // Ejecutar el método y verificar
      const result = await rolesDAO.update(roleId, roleToUpdate);

      // Verificaciones
      expect(result).toEqual({
        idRol: roleId,
        rol: roleToUpdate.rol,
      });

      // Verificar que la query fue llamada con los parámetros correctos
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE"),
        [roleToUpdate.rol, roleId],
        expect.any(Function)
      );
    });

    it("should throw an error if role is not found", async () => {
      // Preparar datos de prueba
      const roleId = 999;
      const roleToUpdate: RolNoId = { rol: "rol_actualizado" };

      // Configurar el mock de la conexión
      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;

      // Mockear la implementación del query para simular 0 filas afectadas
      mockQuery.mockImplementation((query, params, callback) => {
        const mockResults = {
          insertId: 0,
          affectedRows: 0,
        } as ResultSetHeader;

        callback(null, mockResults);
      });

      // Ejecutar el método y verificar que lanza un error
      await expect(rolesDAO.update(roleId, roleToUpdate)).rejects.toThrow(
        "Role not found"
      );
    });

    it("should throw an error if database query fails", async () => {
      // Preparar datos de prueba
      const roleId = 1;
      const roleToUpdate: RolNoId = { rol: "rol_actualizado" };
      const mockError = new Error("Database update error");

      // Configurar el mock de la conexión
      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;

      // Mockear la implementación del query para simular un error
      mockQuery.mockImplementation((query, params, callback) => {
        callback(mockError, null);
      });

      // Ejecutar el método y verificar que lanza un error
      await expect(rolesDAO.update(roleId, roleToUpdate)).rejects.toThrow(
        mockError
      );
    });
  });

  describe("RolesMysqlDAO - delete", () => {
    it("should return true when the role is successfully deleted", async () => {
      // Preparar datos de prueba
      const mockRolId = 1;
      const mockResults = { affectedRows: 1 } as ResultSetHeader;

      // Configurar el mock de la conexión
      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;

      // Mockear la implementación del query para simular una eliminación exitosa
      mockQuery.mockImplementation((query, params, callback) => {
        callback(null, mockResults);
      });

      // Ejecutar el método y verificar
      const result = await rolesDAO.delete(mockRolId);

      // Verificaciones
      expect(result).toBe(true);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("DELETE FROM"),
        [mockRolId],
        expect.any(Function)
      );
    });

    it("should throw an error if role is not found", async () => {
      // Preparar datos de prueba
      const mockRolId = 999; // ID que no existe
      const mockResults = { affectedRows: 0 } as ResultSetHeader;

      // Configurar el mock de la conexión
      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;

      // Mockear la implementación del query para simular un caso donde no se eliminen filas
      mockQuery.mockImplementation((query, params, callback) => {
        callback(null, mockResults);
      });

      // Ejecutar el método y verificar que lanza un error
      await expect(rolesDAO.delete(mockRolId)).rejects.toThrow(
        "Role not found"
      );
    });

    it("should throw an error if database query fails", async () => {
      // Preparar datos de prueba
      const mockRolId = 1;
      const mockError = new Error("Database deletion error");

      // Configurar el mock de la conexión
      const mockConnection = mysql.createConnection();
      const mockQuery = mockConnection.query as jest.Mock;

      // Mockear la implementación del query para simular un error de base de datos
      mockQuery.mockImplementation((query, params, callback) => {
        callback(mockError, null);
      });

      // Ejecutar el método y verificar que lanza un error
      await expect(rolesDAO.delete(mockRolId)).rejects.toThrow(mockError);
    });
  });
});
