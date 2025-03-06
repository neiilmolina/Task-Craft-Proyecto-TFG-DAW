import EstadosController from "@/src/estados/EstadosController";
import { Request, Response } from "express";

describe("EstadosController", () => {
  let estadosController: EstadosController;
  let mockEstadosModel: any;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    // Mock del modelo de estados
    mockEstadosModel = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    // Mock de request y response
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();

    // Instancia del controlador con el modelo mock
    estadosController = new EstadosController(mockEstadosModel);
  });

  describe("getEstados", () => {
    it("debería obtener todos los estados correctamente", async () => {
      const mockEstados = [
        { id: 1, nombre: "Activo" },
        { id: 2, nombre: "Inactivo" },
      ];
      mockEstadosModel.getAll.mockResolvedValue(mockEstados);

      await estadosController.getEstados(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockEstadosModel.getAll).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockEstados);
    });

    it("debería manejar errores correctamente", async () => {
      const error = new Error("Error al obtener estados");
      mockEstadosModel.getAll.mockRejectedValue(error);

      await estadosController.getEstados(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getEstadoById", () => {
    it("debería obtener un estado por ID correctamente", async () => {
      const mockEstado = { id: 1, nombre: "Activo" };
      mockRequest.params = { id: "1" };
      mockEstadosModel.getById.mockResolvedValue(mockEstado);

      await estadosController.getEstadoById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockEstadosModel.getById).toHaveBeenCalledWith("1");
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockEstado);
    });

    it("debería devolver 404 si el estado no existe", async () => {
      mockRequest.params = { id: "999" };
      mockEstadosModel.getById.mockResolvedValue(null);

      await estadosController.getEstadoById(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Estado no encontrado",
      });
    });
  });

  // Tests similares para createEstado, updateEstado y deleteEstado
  describe("createEstado", () => {
    it("debería crear un estado correctamente", async () => {
      const nuevoEstado = { nombre: "Pendiente" };
      const estadoCreado = { id: 3, nombre: "Pendiente" };
      mockRequest.body = nuevoEstado;
      mockEstadosModel.create.mockResolvedValue(estadoCreado);

      await estadosController.createEstado(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockEstadosModel.create).toHaveBeenCalledWith(nuevoEstado);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(estadoCreado);
    });
  });
});
