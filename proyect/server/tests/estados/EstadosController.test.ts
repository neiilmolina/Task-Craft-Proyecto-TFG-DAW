// tests/estados/EstadosController.test.ts
import { Request, Response } from "express";
import EstadosController from "@/src/estados/EstadosController";
import EstadosModel from "@/src/estados/EstadosModel";
import { Estado, EstadoNoId } from "@/src/estados/interfacesEstados";

// At the top of your test file
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
});

// Mock the validation functions
jest.mock("@/src/estados/schemasEstados", () => ({
  validateEstadoNoId: jest.fn().mockReturnValue({ success: true }),
  validateEstado: jest.fn().mockReturnValue({ success: true }),
  validatePartialEstado: jest.fn().mockReturnValue({ success: true }),
}));

jest.mock("@/config/supabase", () => ({
  __esModule: true,
  default: {},
}));

describe("EstadosController", () => {
  let estadosController: EstadosController;
  let mockEstadosModel: jest.Mocked<EstadosModel>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    // Create mock for EstadosModel
    mockEstadosModel = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<EstadosModel>;

    // Create mock for request, response, and next
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();

    // Initialize controller with mock model
    estadosController = new EstadosController(mockEstadosModel);
  });

  describe("getEstados", () => {
    it("debería obtener todos los estados correctamente", async () => {
      // Arrange
      const mockEstados: Estado[] = [
        { idEstado: 1, estado: "Activo" },
        { idEstado: 2, estado: "Inactivo" },
      ];
      mockEstadosModel.getAll.mockResolvedValue(mockEstados);

      // Act
      await estadosController.getEstados(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockEstadosModel.getAll).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockEstados);
    });

    it("debería manejar errores correctamente", async () => {
      // Arrange
      const error = new Error("Error al obtener estados");
      mockEstadosModel.getAll.mockRejectedValue(error);

      // Act
      await estadosController.getEstados(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(console.error).toHaveBeenCalledWith(
        "Error al cargar los estados:",
        error
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Error interno del servidor",
      });
    });
  });

  describe("getEstadoById", () => {
    it("debería obtener un estado por ID correctamente", async () => {
      // Arrange
      const mockEstado: Estado = { idEstado: 1, estado: "Activo" };
      mockRequest.params = { idEstado: "1" };
      mockEstadosModel.getById.mockResolvedValue(mockEstado);

      // Act
      await estadosController.getEstadoById(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockEstadosModel.getById).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockEstado);
    });

    it("debería devolver 404 si el estado no existe", async () => {
      // Arrange
      mockRequest.params = { idEstado: "999" };
      mockEstadosModel.getById.mockResolvedValue(null);

      // Act
      await estadosController.getEstadoById(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockEstadosModel.getById).toHaveBeenCalledWith(999);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Estado no encontrado",
      });
    });
  });

  describe("createEstado", () => {
    it("debería crear un estado correctamente", async () => {
      // Arrange
      const nuevoEstado: EstadoNoId = { estado: "Pendiente" };
      const estadoCreado: Estado = { idEstado: 3, estado: "Pendiente" };
      mockRequest.body = { estado: "Pendiente" };
      mockEstadosModel.create.mockResolvedValue(estadoCreado);

      // Act
      await estadosController.createEstado(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockEstadosModel.create).toHaveBeenCalledWith(nuevoEstado);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(estadoCreado);
    });

    it("debería manejar errores de validación", async () => {
      // Arrange
      mockRequest.body = { estado: "" }; // Invalid estado

      // Mock validateEstadoNoId to return error for this test
      const validateEstadoNoIdMock =
        require("@/src/estados/schemasEstados").validateEstadoNoId;
      validateEstadoNoIdMock.mockReturnValueOnce({
        success: false,
        error: "Estado es requerido",
      });

      // Act
      await estadosController.createEstado(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Estado es requerido",
      });
    });
  });

  describe("deleteEstado", () => {
    it("debería eliminar un estado correctamente", async () => {
      // Arrange
      mockRequest.params = { idEstado: "1" };
      mockEstadosModel.delete.mockResolvedValue(true);

      // Act
      await estadosController.deleteEstado(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockEstadosModel.delete).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Estado eliminado correctamente",
      });
    });

    it("debería devolver 404 si el estado a eliminar no existe", async () => {
      // Arrange
      mockRequest.params = { idEstado: "999" };
      mockEstadosModel.delete.mockResolvedValue(false);

      // Act
      await estadosController.deleteEstado(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockEstadosModel.delete).toHaveBeenCalledWith(999);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Estado no encontrado",
      });
    });
  });

  describe("updateEstado", () => {
    it("debería actualizar un estado correctamente", async () => {
      // Arrange
      const idEstado = 1;
      const datosActualizados: EstadoNoId = { estado: "Actualizado" };
      const estadoActualizado: Estado = { idEstado: 1, estado: "Actualizado" };

      mockRequest.params = { idEstado: idEstado.toString() };
      mockRequest.body = { estado: "Actualizado" };
      mockEstadosModel.update.mockResolvedValue(estadoActualizado);

      // Act
      await estadosController.updateEstado(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockEstadosModel.update).toHaveBeenCalledWith(
        idEstado,
        datosActualizados
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(estadoActualizado);
    });

    it("debería devolver 404 si el estado a actualizar no existe", async () => {
      // Arrange
      const idEstado = 999;
      const datosActualizados: EstadoNoId = { estado: "Actualizado" };

      mockRequest.params = { idEstado: idEstado.toString() };
      mockRequest.body = { estado: "Actualizado" };
      mockEstadosModel.update.mockResolvedValue(null);

      // Act
      await estadosController.updateEstado(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockEstadosModel.update).toHaveBeenCalledWith(
        idEstado,
        datosActualizados
      );
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Estado no encontrado",
      });
    });

    it("debería manejar errores de validación", async () => {
      // Arrange
      mockRequest.params = { idEstado: "1" };
      mockRequest.body = { estado: "" }; // Invalid estado

      // Mock validateEstadoNoId to return error for this test
      const validateEstadoNoIdMock =
        require("@/src/estados/schemasEstados").validateEstadoNoId;
      validateEstadoNoIdMock.mockReturnValueOnce({
        success: false,
        error: "Estado es requerido",
      });

      // Act
      await estadosController.updateEstado(
        mockRequest as Request,
        mockResponse as Response
      );

      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Estado es requerido",
      });
    });
  });
});
