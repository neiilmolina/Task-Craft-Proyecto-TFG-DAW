import supabase from '@/tests/__mocks__/supabase';
import EstadosModel from '@/src/estados/EstadosModel';
import IEstadosDAO  from '@/src/estados/dao/IEstadosDAO';
import { Estado, EstadoNoId } from '@/src/estados/interfacesEstados';

jest.mock('@/config/supabase', () => ({
  __esModule: true,
  default: supabase
}));

describe('EstadosModel', () => {
  let estadosModel: EstadosModel;
  let mockDAO: jest.Mocked<IEstadosDAO>;

  beforeEach(() => {
    // Create a mock implementation of IEstadosDAO
    mockDAO = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    } as jest.Mocked<IEstadosDAO>;

    // Initialize the model with the mock DAO
    estadosModel = new EstadosModel(mockDAO);
  });

  describe('getById', () => {
    it('debería obtener un estado por su ID', async () => {
      // Arrange
      const mockEstado: Estado = { idEstado: 1, estado: 'Activo' };
      mockDAO.getById.mockResolvedValue(mockEstado);

      // Act
      const result = await estadosModel.getById(1);

      // Assert
      expect(mockDAO.getById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockEstado);
    });

    it('debería devolver null cuando el estado no existe', async () => {
      // Arrange
      mockDAO.getById.mockResolvedValue(null);

      // Act
      const result = await estadosModel.getById(999);

      // Assert
      expect(mockDAO.getById).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });

    it('debería manejar errores en la consulta', async () => {
      // Arrange
      const error = new Error('Error de base de datos');
      mockDAO.getById.mockRejectedValue(error);

      // Act & Assert
      await expect(estadosModel.getById(1)).rejects.toThrow('Error de base de datos');
    });
  });

  describe('create', () => {
    it('debería crear un nuevo estado correctamente', async () => {
      // Arrange
      const nuevoEstado: EstadoNoId = { estado: 'Pendiente' };
      const estadoCreado: Estado = { idEstado: 3, estado: 'Pendiente' };
      mockDAO.create.mockResolvedValue(estadoCreado);

      // Act
      const result = await estadosModel.create(nuevoEstado);

      // Assert
      expect(mockDAO.create).toHaveBeenCalledWith(nuevoEstado);
      expect(result).toEqual(estadoCreado);
    });

    it('debería devolver null cuando falla la creación', async () => {
      // Arrange
      const nuevoEstado: EstadoNoId = { estado: 'Pendiente' };
      mockDAO.create.mockResolvedValue(null);

      // Act
      const result = await estadosModel.create(nuevoEstado);

      // Assert
      expect(mockDAO.create).toHaveBeenCalledWith(nuevoEstado);
      expect(result).toBeNull();
    });

    it('debería manejar errores en la creación', async () => {
      // Arrange
      const nuevoEstado: EstadoNoId = { estado: 'Pendiente' };
      const error = new Error('Error al insertar en la base de datos');
      mockDAO.create.mockRejectedValue(error);

      // Act & Assert
      await expect(estadosModel.create(nuevoEstado)).rejects.toThrow('Error al insertar en la base de datos');
    });
  });

  describe('update', () => {
    it('debería actualizar un estado correctamente', async () => {
      // Arrange
      const estadoId = 1;
      const datosActualizados: EstadoNoId = { estado: 'Actualizado' };
      const estadoActualizado: Estado = { idEstado: 1, estado: 'Actualizado' };
      mockDAO.update.mockResolvedValue(estadoActualizado);

      // Act
      const result = await estadosModel.update(estadoId, datosActualizados);

      // Assert
      expect(mockDAO.update).toHaveBeenCalledWith(estadoId, datosActualizados);
      expect(result).toEqual(estadoActualizado);
    });

    it('debería devolver null cuando el estado a actualizar no existe', async () => {
      // Arrange
      const estadoId = 999;
      const datosActualizados: EstadoNoId = { estado: 'Actualizado' };
      mockDAO.update.mockResolvedValue(null);

      // Act
      const result = await estadosModel.update(estadoId, datosActualizados);

      // Assert
      expect(mockDAO.update).toHaveBeenCalledWith(estadoId, datosActualizados);
      expect(result).toBeNull();
    });

    it('debería manejar errores en la actualización', async () => {
      // Arrange
      const estadoId = 1;
      const datosActualizados: EstadoNoId = { estado: 'Actualizado' };
      const error = new Error('Error al actualizar en la base de datos');
      mockDAO.update.mockRejectedValue(error);

      // Act & Assert
      await expect(estadosModel.update(estadoId, datosActualizados)).rejects.toThrow('Error al actualizar en la base de datos');
    });
  });

  describe('delete', () => {
    it('debería eliminar un estado correctamente', async () => {
      // Arrange
      const estadoId = 1;
      mockDAO.delete.mockResolvedValue(true);

      // Act
      const result = await estadosModel.delete(estadoId);

      // Assert
      expect(mockDAO.delete).toHaveBeenCalledWith(estadoId);
      expect(result).toBe(true);
    });

    it('debería devolver false cuando el estado a eliminar no existe', async () => {
      // Arrange
      const estadoId = 999;
      mockDAO.delete.mockResolvedValue(false);

      // Act
      const result = await estadosModel.delete(estadoId);

      // Assert
      expect(mockDAO.delete).toHaveBeenCalledWith(estadoId);
      expect(result).toBe(false);
    });

    it('debería manejar errores en la eliminación', async () => {
      // Arrange
      const estadoId = 1;
      const error = new Error('Error al eliminar de la base de datos');
      mockDAO.delete.mockRejectedValue(error);

      // Act & Assert
      await expect(estadosModel.delete(estadoId)).rejects.toThrow('Error al eliminar de la base de datos');
    });
  });
});
