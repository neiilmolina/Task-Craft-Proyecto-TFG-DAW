import TiposController from "@/src/tipos/TiposController";
import TiposModel from "@/src/tipos/TiposModel";
import { Request, Response } from "express";
import { Tipo, TipoCreate, TipoUpdate } from "@/src/tipos/interfacesTipos";
import { User } from "@supabase/supabase-js";

// At the top of your test file
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
});

jest.mock("@/src/tipos/schemasTipos", () => ({
  validateTipoCreate: jest.fn().mockReturnValue({ success: true }),
  validateTipoUpdate: jest.fn().mockReturnValue({ success: true }),
}));

jest.mock("@/config/supabase", () => ({
  __esModule: true,
  default: {},
}));

describe("TiposController", () => {
  let tiposController: TiposController;
  let mockTiposModel: jest.Mocked<TiposModel>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    // Create mock for EstadosModel
    mockTiposModel = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<TiposModel>;

    // Create mock for request, response, and next
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();

    // Initialize controller with mock model
    tiposController = new TiposController(mockTiposModel);
  });

  describe("getTipos", () => {
    it("debe devolver todos los tipos sin filtros cuando no hay parámetros", async () => {
      // Arrange
      mockRequest.params = {};
      const mockTipos = [
        { idTipo: 1, tipo: "Personal", color: "#FF5733", idUsuario: "user1" },
      ];
      mockTiposModel.getAll.mockResolvedValue(mockTipos);

      // Act
      await tiposController.getTipos(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockTiposModel.getAll).toHaveBeenCalledWith(undefined, false);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTipos);
    });

    it("debe filtrar por idUsuario cuando se proporciona", async () => {
      // Arrange
      mockRequest.params = { idUsuario: "usuario123" };
      const mockTipos = [
        {
          idTipo: 1,
          tipo: "Personal",
          color: "#FF5733",
          idUsuario: "usuario123",
        },
      ];
      mockTiposModel.getAll.mockResolvedValue(mockTipos);

      // Act
      await tiposController.getTipos(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockTiposModel.getAll).toHaveBeenCalledWith("usuario123", false);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTipos);
    });

    it("debe incluir detalles de usuario cuando userDetails es true", async () => {
      // Arrange
      mockRequest.params = { userDetails: "true" };
      const mockUser = {
        id: "1",
        email: "user1@example.com",
        role: "admin",
        created_at: "2025-03-08T00:00:00Z",
        updated_at: "2025-03-08T00:00:00Z",
        app_metadata: {
          provider: "email",
          providers: ["email"],
        },
        user_metadata: {
          first_name: "Admin User",
          last_name: "Admin Last Name",
          avatar_url: "https://example.com/admin-avatar.jpg",
        },
        aud: "authenticated",
      };
      const mockTipos = [
        {
          idTipo: 1,
          tipo: "Personal",
          color: "#FF5733",
          idUsuario: "usuario123",
          userDetails: mockUser,
        },
      ];
      mockTiposModel.getAll.mockResolvedValue(mockTipos);

      // Act
      await tiposController.getTipos(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockTiposModel.getAll).toHaveBeenCalledWith(undefined, true);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTipos);
    });

    it("debe filtrar por idUsuario y incluir detalles cuando se proporcionan ambos", async () => {
      // Arrange
      mockRequest.params = { idUsuario: "usuario123", userDetails: "true" };
      const mockUser: User = {
        id: "1",
        email: "user1@example.com",
        role: "admin",
        created_at: "2025-03-08T00:00:00Z",
        updated_at: "2025-03-08T00:00:00Z",
        app_metadata: {
          provider: "email",
          providers: ["email"],
        },
        user_metadata: {
          first_name: "Admin User",
          last_name: "Admin Last Name",
          avatar_url: "https://example.com/admin-avatar.jpg",
        },
        aud: "authenticated",
      };
      const mockTipos = [
        {
          idTipo: 1,
          tipo: "Personal",
          color: "#FF5733",
          idUsuario: "usuario123",
          userDetails: mockUser,
        },
      ];
      mockTiposModel.getAll.mockResolvedValue(mockTipos);

      // Act
      await tiposController.getTipos(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockTiposModel.getAll).toHaveBeenCalledWith("usuario123", true);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTipos);
    });

    it("debe devolver error 500 cuando falla la obtención de tipos", async () => {
      // Arrange
      mockRequest.params = {};
      mockTiposModel.getAll.mockRejectedValue(
        new Error("Error de base de datos")
      );

      // Act
      await tiposController.getTipos(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockTiposModel.getAll).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Error interno del servidor",
      });
    });

    it("debe manejar correctamente cuando getAll devuelve null", async () => {
      // Arrange
      mockRequest.params = {};
      mockTiposModel.getAll.mockResolvedValue(null);

      // Act
      await tiposController.getTipos(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockTiposModel.getAll).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(null);
    });
  });

  describe("getTiposById", () => {
    it("debe devolver un tipo cuando existe", async () => {
      // Arrange
      const idTipos = 1;
      mockRequest.params = { idTipos: idTipos.toString() };
      const mockTipo = {
        idTipo: 1,
        tipo: "Personal",
        color: "#FF5733",
        idUsuario: "usuario123",
      };
      mockTiposModel.getById.mockResolvedValue(mockTipo);

      // Act
      await tiposController.getTiposById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockTiposModel.getById).toHaveBeenCalledWith(idTipos);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTipo);
    });

    it("debe devolver 404 cuando el tipo no existe", async () => {
      // Arrange
      const idTipos = 999;
      mockRequest.params = { idTipos: idTipos.toString() };
      mockTiposModel.getById.mockResolvedValue(null);

      // Act
      await tiposController.getTiposById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockTiposModel.getById).toHaveBeenCalledWith(idTipos);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "tipo no encontrado",
      });
    });

    it("debe manejar errores al convertir idTipos a número", async () => {
      // Arrange
      mockRequest.params = { idTipos: "no-es-numero" };

      // Act
      await tiposController.getTiposById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(console.error).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Error interno del servidor",
      });
    });

    it("debe devolver error 500 cuando hay una excepción", async () => {
      // Arrange
      mockRequest.params = { idTipos: "1" };
      mockTiposModel.getById.mockRejectedValue(
        new Error("Error de base de datos")
      );

      // Act
      await tiposController.getTiposById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockTiposModel.getById).toHaveBeenCalledWith(1);
      expect(console.error).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Error interno del servidor",
      });
    });
  });
});
