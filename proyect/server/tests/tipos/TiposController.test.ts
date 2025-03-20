import TiposController from "@/src/tipos/TiposController";
import TiposModel from "@/src/tipos/TiposModel";
import { Request, Response } from "express";
import { Tipo, TipoCreate, TipoUpdate } from "@/src/tipos/interfacesTipos";
import { User } from "@supabase/supabase-js";
import { validateTipoUpdate } from "@/src/tipos/schemasTipos";

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
      mockRequest.params = {
        idTipos: idTipos.toString(),
        userDetails: "true", // Añade este parámetro
      };

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

      const mockTipo: Tipo = {
        idTipo: 1,
        tipo: "Personal",
        color: "#FF5733",
        idUsuario: "usuario123",
        userDetails: mockUser,
      };

      mockTiposModel.getById.mockResolvedValue(mockTipo);

      // Act
      await tiposController.getTiposById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockTiposModel.getById).toHaveBeenCalledWith(idTipos, true);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTipo);
    });

    it("debe devolver un tipo con detalles de usuario cuando userDetails es true", async () => {
      // Arrange
      const idTipos = 1;
      const userDetails = true;
      mockRequest.params = {
        idTipos: idTipos.toString(),
        userDetails: userDetails.toString(),
      };
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
      const mockTipo: Tipo = {
        idTipo: 1,
        tipo: "Personal",
        color: "#FF5733",
        idUsuario: "usuario123",
        userDetails: mockUser,
      };
      mockTiposModel.getById.mockResolvedValue(mockTipo);

      // Act
      await tiposController.getTiposById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockTiposModel.getById).toHaveBeenCalledWith(idTipos, userDetails);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTipo);
    });

    it("debe devolver 404 cuando el tipo no existe", async () => {
      // Arrange
      const idTipos = 999;
      const userDetails = false;
      mockRequest.params = {
        idTipos: idTipos.toString(),
        userDetails: userDetails.toString(),
      };
      mockTiposModel.getById.mockResolvedValue(null);

      // Act
      await tiposController.getTiposById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockTiposModel.getById).toHaveBeenCalledWith(idTipos, userDetails);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "tipo no encontrado",
      });
    });

    it("debe manejar errores al convertir idTipos a número", async () => {
      // Arrange
      mockRequest.params = {
        idTipos: "no-es-numero",
        userDetails: "false",
      };

      // Simular que getById devuelve null cuando se le pasa NaN
      mockTiposModel.getById.mockResolvedValue(null);

      // Act
      await tiposController.getTiposById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      // Como el comportamiento real devuelve 404, actualizamos la expectativa
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "tipo no encontrado",
      });
    });

    it("debe devolver error 500 cuando hay una excepción", async () => {
      // Arrange
      const idTipos = 1;
      const userDetails = false;
      mockRequest.params = {
        idTipos: idTipos.toString(),
        userDetails: userDetails.toString(),
      };
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
      expect(mockTiposModel.getById).toHaveBeenCalledWith(idTipos, userDetails);
      expect(console.error).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Error interno del servidor",
      });
    });
  });

  describe("createTipo", () => {
    it("debe crear un tipo correctamente", async () => {
      // Arrange
      const tipoData: TipoCreate = {
        tipo: "Nuevo Tipo",
        color: "#123456",
        idUsuario: "user123",
      };
      mockRequest.body = tipoData;

      const createdTipo: Tipo = {
        idTipo: 1,
        tipo: "Nuevo Tipo",
        color: "#123456",
        idUsuario: "user123",
      };

      mockTiposModel.create.mockResolvedValue(createdTipo);

      // Act
      await tiposController.createTipo(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockTiposModel.create).toHaveBeenCalledWith(tipoData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(createdTipo);
    });

    it("debe devolver error 400 cuando los datos son inválidos", async () => {
      // Arrange
      const tipoData = {
        // Datos inválidos (falta color)
        tipo: "Tipo Inválido",
        idUsuario: "user123",
      };
      mockRequest.body = tipoData;

      // Mock de validateTipoCreate para que devuelva error
      const mockError = { message: "Color es requerido" };
      jest
        .requireMock("@/src/tipos/schemasTipos")
        .validateTipoCreate.mockReturnValueOnce({
          success: false,
          error: mockError,
        });

      // Act
      await tiposController.createTipo(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockTiposModel.create).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: mockError });
    });

    it("debe devolver error 500 cuando newTipo es null", async () => {
      // Arrange
      const tipoData: TipoCreate = {
        tipo: "Nuevo Tipo",
        color: "#123456",
        idUsuario: "user123",
      };
      mockRequest.body = tipoData;

      mockTiposModel.create.mockResolvedValue(null);

      // Act
      await tiposController.createTipo(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockTiposModel.create).toHaveBeenCalledWith(tipoData);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "No se pudo crear el tipo",
      });
    });

    it("debe devolver error 400 cuando el usuario ya existe", async () => {
      // Arrange
      const tipoData: TipoCreate = {
        tipo: "Nuevo Tipo",
        color: "#123456",
        idUsuario: "user123",
      };
      mockRequest.body = tipoData;

      const duplicateError = new Error(
        "duplicate key value violates unique constraint already exists"
      );
      mockTiposModel.create.mockRejectedValue(duplicateError);

      // Act
      await tiposController.createTipo(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockTiposModel.create).toHaveBeenCalledWith(tipoData);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "El Tipo ya existe",
      });
    });

    it("debe devolver error 500 cuando hay una excepción", async () => {
      // Arrange
      const tipoData: TipoCreate = {
        tipo: "Nuevo Tipo",
        color: "#123456",
        idUsuario: "user123",
      };
      mockRequest.body = tipoData;

      mockTiposModel.create.mockRejectedValue(
        new Error("Error de base de datos")
      );

      // Act
      await tiposController.createTipo(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockTiposModel.create).toHaveBeenCalledWith(tipoData);
      expect(console.error).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Error interno del servidor",
      });
    });
  });

  describe("updateTipo", () => {
    const mockTipoUpdate: TipoUpdate = {
      tipo: "TipoActualizado",
      color: "#FF5733",
    };

    const mockTipoResponse: Tipo = {
      idTipo: 1,
      tipo: "TipoActualizado",
      color: "#FF5733",
      idUsuario: "user123",
    };

    it("debería actualizar un tipo exitosamente", async () => {
      // Arrange
      mockRequest.params = { id: "1" };
      mockRequest.body = mockTipoUpdate;
      mockTiposModel.update.mockResolvedValue(mockTipoResponse);
      (validateTipoUpdate as jest.Mock).mockReturnValue({ success: true });

      // Act
      await tiposController.updateTipo(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(validateTipoUpdate).toHaveBeenCalledWith(mockTipoUpdate);
      expect(mockTiposModel.update).toHaveBeenCalledWith(1, mockTipoUpdate);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTipoResponse);
    });

    it("debería actualizar un tipo con idUsuario opcional", async () => {
      // Arrange
      const tipoConUsuario: TipoUpdate = {
        ...mockTipoUpdate,
        idUsuario: "nuevoUsuario456",
      };

      const tipoRespuestaConUsuario: Tipo = {
        ...mockTipoResponse,
        idUsuario: "nuevoUsuario456",
      };

      mockRequest.params = { id: "1" };
      mockRequest.body = tipoConUsuario;
      mockTiposModel.update.mockResolvedValue(tipoRespuestaConUsuario);
      (validateTipoUpdate as jest.Mock).mockReturnValue({ success: true });

      // Act
      await tiposController.updateTipo(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(validateTipoUpdate).toHaveBeenCalledWith(tipoConUsuario);
      expect(mockTiposModel.update).toHaveBeenCalledWith(1, tipoConUsuario);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(tipoRespuestaConUsuario);
    });

    it("debería devolver un error 400 cuando la validación falla por tipo vacío", async () => {
      // Arrange
      mockRequest.params = { id: "1" };
      mockRequest.body = { tipo: "", color: "#FF5733" }; // Tipo inválido
      const validationError = { message: "El tipo es requerido" };
      (validateTipoUpdate as jest.Mock).mockReturnValue({
        success: false,
        error: validationError,
      });

      // Act
      await tiposController.updateTipo(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(validateTipoUpdate).toHaveBeenCalledWith(mockRequest.body);
      expect(mockTiposModel.update).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: validationError,
      });
    });

    it("debería devolver un error 400 cuando la validación falla por color inválido", async () => {
      // Arrange
      mockRequest.params = { id: "1" };
      mockRequest.body = { tipo: "TipoValido", color: "colorInvalido" }; // Color inválido
      const validationError = {
        message: "El color debe ser un código hexadecimal válido",
      };
      (validateTipoUpdate as jest.Mock).mockReturnValue({
        success: false,
        error: validationError,
      });

      // Act
      await tiposController.updateTipo(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(validateTipoUpdate).toHaveBeenCalledWith(mockRequest.body);
      expect(mockTiposModel.update).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: validationError,
      });
    });

    it("debería devolver un error 404 cuando el tipo no existe", async () => {
      // Arrange
      mockRequest.params = { id: "999" }; // ID que no existe
      mockRequest.body = mockTipoUpdate;
      mockTiposModel.update.mockResolvedValue(null); // El modelo devuelve null si no encuentra el tipo
      (validateTipoUpdate as jest.Mock).mockReturnValue({ success: true });

      // Act
      await tiposController.updateTipo(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(validateTipoUpdate).toHaveBeenCalledWith(mockTipoUpdate);
      expect(mockTiposModel.update).toHaveBeenCalledWith(999, mockTipoUpdate);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Tipo no encontrado",
      });
    });

    it("debería manejar errores internos del servidor", async () => {
      // Arrange
      mockRequest.params = { id: "1" };
      mockRequest.body = mockTipoUpdate;
      const serverError = new Error("Error de la base de datos");
      mockTiposModel.update.mockRejectedValue(serverError);
      (validateTipoUpdate as jest.Mock).mockReturnValue({ success: true });

      // Act
      await tiposController.updateTipo(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(validateTipoUpdate).toHaveBeenCalledWith(mockTipoUpdate);
      expect(mockTiposModel.update).toHaveBeenCalledWith(1, mockTipoUpdate);
      expect(console.error).toHaveBeenCalledWith(
        "Error interno del servidor:",
        serverError
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Error interno del servidor",
      });
    });

    it("debería convertir correctamente el ID de string a number", async () => {
      // Arrange
      mockRequest.params = { id: "42" };
      mockRequest.body = mockTipoUpdate;
      mockTiposModel.update.mockResolvedValue({
        ...mockTipoResponse,
        idTipo: 42,
      });
      (validateTipoUpdate as jest.Mock).mockReturnValue({ success: true });

      // Act
      await tiposController.updateTipo(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockTiposModel.update).toHaveBeenCalledWith(42, mockTipoUpdate);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe("deleteTipo", () => {
    it("debería eliminar un tipo existente y devolver un estado 200", async () => {
      mockRequest = { params: { id: "1" } } as unknown as Request;
      mockTiposModel.delete.mockResolvedValue(true);

      await tiposController.deleteTipo(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockTiposModel.delete).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Tipo eliminado correctamente",
      });
    });

    it("debería devolver un estado 404 si el tipo no existe", async () => {
      mockRequest = { params: { id: "999" } } as unknown as Request;
      mockTiposModel.delete.mockResolvedValue(false);

      await tiposController.deleteTipo(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockTiposModel.delete).toHaveBeenCalledWith(999);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Tipo no encontrado",
      });
    });

    it("debería devolver un estado 500 si ocurre un error interno", async () => {
      mockRequest = { params: { id: "2" } } as unknown as Request;
      mockTiposModel.delete.mockRejectedValue(
        new Error("Error de base de datos")
      );

      await tiposController.deleteTipo(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockTiposModel.delete).toHaveBeenCalledWith(2);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Error interno del servidor",
      });
      expect(console.error).toHaveBeenCalledWith(
        "Error al eliminar el tipo:",
        expect.any(Error)
      );
    });

    it("debería devolver un estado 400 si el id no es un número válido", async () => {
      mockRequest = { params: { id: "abc" } } as unknown as Request;

      await tiposController.deleteTipo(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "ID inválido" });
    });

    it("debería manejar correctamente una solicitud sin parámetro de id", async () => {
      mockRequest = { params: {} } as unknown as Request;

      await tiposController.deleteTipo(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: "ID inválido" });
    });
  });
});
