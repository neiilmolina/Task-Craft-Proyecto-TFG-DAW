import { ResultSetHeader } from "mysql2";
import mysql from "@/tests/__mocks__/mysql";
import UsuariosMysqlDAO from "@/src/usuarios/dao/UsuariosMysqlDAO";
import { Usuario } from "@/src/usuarios/interfacesUsuarios";

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

  describe("UsuariosMysqlDAO - getAll", () => {
    it("should return an array of users when query is successful", async () => {
      const mockConnection = mysql.createConnection();

      const mockResults: Usuario[] = [
        {
          idUsuario: "1",
          nombreUsuario: "John Doe",
          email: "john@example.com",
          urlImg: "",
          rol: { idRol: 1, rol: "admin" },
        },
        {
          idUsuario: "2",
          nombreUsuario: "Jane Doe",
          email: "jane@example.com",
          urlImg: "",
          rol: { idRol: 2, rol: "user" },
        },
      ];

      // More explicit mock implementation with proper typing
      mockConnection.query.mockImplementation(
        (
          sql: string,
          params: any[] | ((err: Error | null, results?: Usuario[]) => void),
          callback?: (err: Error | null, results?: Usuario[]) => void
        ) => {
          // Handle both overloads of the query method
          if (typeof params === "function") {
            params(null, mockResults);
          } else if (callback && typeof callback === "function") {
            callback(null, mockResults);
          }
          return {} as any;
        }
      );

      // Call getAll method
      const usuarios = await usuariosDAO.getAll();

      // Verify results
      expect(usuarios).toEqual(mockResults);
      expect(mockConnection.query).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if query fails", async () => {
      const mockError = new Error("Database connection error");
      const mockConnection = mysql.createConnection();

      // Mockeamos query para que devuelva un error
      mockConnection.query.mockImplementation((sql: any, callback: any) => {
        callback(mockError);
      });

      await expect(usuariosDAO.getAll()).rejects.toThrow(mockError);
    });

    it("should throw an error if results are not an array", async () => {
      const mockInvalidResults = { message: "Not an array" };
      const mockConnection = mysql.createConnection();

      // Mockeamos query para que devuelva un resultado no array
      mockConnection.query.mockImplementation((sql: any, callback: any) => {
        callback(null, mockInvalidResults);
      });

      await expect(usuariosDAO.getAll()).rejects.toThrow(
        "Expected array of results but got something else."
      );
    });

    it("should return an empty array if no users are found", async () => {
      const mockResults: Usuario[] = [];
      const mockConnection = mysql.createConnection();

      // Mockeamos query para devolver un array vacío
      mockConnection.query.mockImplementation((sql: any, callback: any) => {
        callback(null, mockResults);
      });

      const usuarios = await usuariosDAO.getAll();
      expect(usuarios).toEqual(mockResults);
    });

    it("should handle filtering users by idRol", async () => {
      const mockResults: Usuario[] = [
        {
          idUsuario: "1",
          nombreUsuario: "John Doe",
          email: "john@example.com",
          urlImg: "",
          rol: { idRol: 1, rol: "admin" },
        },
      ];

      const mockConnection = mysql.createConnection();

      // Mockeamos query para devolver los usuarios filtrados por idRol
      mockConnection.query.mockImplementation((sql: any, callback: any) => {
        callback(null, mockResults);
      });

      const usuarios = await usuariosDAO.getAll("1"); // Filtrado por idRol
      expect(usuarios).toEqual(mockResults);
      expect(mockConnection.query).toHaveBeenCalledWith(
        expect.stringContaining("WHERE u.idRol = ?"),
        ["1"]
      );
    });
  });
});
