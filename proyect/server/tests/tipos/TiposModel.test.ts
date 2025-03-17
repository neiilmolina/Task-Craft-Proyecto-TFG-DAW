import supabase from "@/tests/__mocks__/supabase";
import TiposModel from "@/src/tipos/TiposModel";
import ITiposDAO from "@/src/tipos/dao/ITiposDAO";
import { Tipo, TipoCreate, TipoUpdate } from "@/src/tipos/interfacesTipos";

jest.mock("@/config/supabase", () => ({
  __esModule: true,
  default: supabase,
}));

describe("TiposModel", () => {
  let tiposModel: TiposModel;
  let mockDAO: jest.Mocked<ITiposDAO>;

  beforeEach(() => {
    mockDAO = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<ITiposDAO>;

    tiposModel = new TiposModel(mockDAO);
  });

  describe("getAll", () => {
    it("debería obtener una lista de todos los tipos", async () => {
      const mockTipos: Tipo[] = [
        { idTipo: 1, tipo: "Evento", color: "#00000", idUsuario: "1" },
        { idTipo: 2, tipo: "Tarea", color: "#00000", idUsuario: "1" },
        { idTipo: 3, tipo: "Evento", color: "#00000", idUsuario: "2" },
      ];

      mockDAO.getAll.mockResolvedValue(mockTipos);

      const result = await tiposModel.getAll();

      expect(mockDAO.getAll).toHaveBeenCalled();
      expect(result).toEqual(mockTipos);
    });

    it("debería obtener solo los tipos de un usuario específico", async () => {
      const idUsuario = "1";
      const mockTiposFiltrados: Tipo[] = [
        { idTipo: 1, tipo: "Evento", color: "#00000", idUsuario: "1" },
        { idTipo: 2, tipo: "Tarea", color: "#00000", idUsuario: "1" },
      ];

      mockDAO.getAll.mockResolvedValue(mockTiposFiltrados);

      const result = await tiposModel.getAll(idUsuario);

      expect(mockDAO.getAll).toHaveBeenCalledWith(idUsuario);
      expect(result).toEqual(mockTiposFiltrados);
    });

    it("debería retornar una lista vacía si no hay tipos", async () => {
      mockDAO.getAll.mockResolvedValue([]);

      const result = await tiposModel.getAll();

      expect(mockDAO.getAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe("getById", () => {
    it("debería obtener un tipo por su ID", async () => {
      const mockTipo: Tipo = {
        idTipo: 1,
        tipo: "Evento",
        color: "#00000",
        idUsuario: "1",
      };

      mockDAO.getById.mockResolvedValue(mockTipo);

      const result = await tiposModel.getById(1);

      expect(mockDAO.getById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTipo);
    });

    it("debería retornar null si el tipo no existe", async () => {
      mockDAO.getById.mockResolvedValue(null);

      const result = await tiposModel.getById(999);

      expect(mockDAO.getById).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("debería crear un nuevo tipo", async () => {
      const mockTipoCreate: TipoCreate = {
        tipo: "Reunión",
        color: "#123456",
        idUsuario: "1",
      };
      const mockTipo: Tipo = { idTipo: 1, ...mockTipoCreate };

      mockDAO.create.mockResolvedValue(mockTipo);

      const result = await tiposModel.create(mockTipoCreate);

      expect(mockDAO.create).toHaveBeenCalledWith(mockTipoCreate);
      expect(result).toEqual(mockTipo);
    });

    it("debería retornar null si la creación falla", async () => {
      const mockTipoCreate: TipoCreate = {
        tipo: "Reunión",
        color: "#123456",
        idUsuario: "1",
      };

      mockDAO.create.mockResolvedValue(null);

      const result = await tiposModel.create(mockTipoCreate);

      expect(mockDAO.create).toHaveBeenCalledWith(mockTipoCreate);
      expect(result).toBeNull();
    });
  });

  describe("update", () => {
    it("debería actualizar un tipo existente", async () => {
      const idTipo = 1;
      const mockTipoUpdate: TipoUpdate = {
        tipo: "Actualizado",
        color: "#654321",
        idUsuario: "1",
      };
      const mockUpdatedTipo: Tipo = {
        idTipo,
        ...mockTipoUpdate,
        idUsuario: mockTipoUpdate.idUsuario ?? "1",
      };

      mockDAO.update.mockResolvedValue(mockUpdatedTipo);

      const result = await tiposModel.update(idTipo, mockTipoUpdate);

      expect(mockDAO.update).toHaveBeenCalledWith(idTipo, mockTipoUpdate);
      expect(result).toEqual(mockUpdatedTipo);
    });

    it("debería retornar null si la actualización falla", async () => {
      const idTipo = 1;
      const mockTipoUpdate: TipoUpdate = {
        tipo: "Actualizado",
        color: "#654321",
        idUsuario: "1",
      };

      mockDAO.update.mockResolvedValue(null);

      const result = await tiposModel.update(idTipo, mockTipoUpdate);

      expect(mockDAO.update).toHaveBeenCalledWith(idTipo, mockTipoUpdate);
      expect(result).toBeNull();
    });
  });

  describe("delete", () => {
    it("should delete an existing tipo", async () => {
      const idTipo = 1;

      mockDAO.delete.mockResolvedValue(true);
      // Ejecutamos la función delete
      const result = await tiposModel.delete(idTipo);

      expect(mockDAO.delete).toHaveBeenCalled();
      // Verificamos que el resultado sea true, indicando que no hubo error
      expect(result).toEqual(true);
    });

    it("should return false if an error occurs", async () => {
      const idTipo = 1;
      // Mock de error en la función delete
      mockDAO.delete.mockResolvedValue(false);

      // Ejecutamos la función delete
      const result = await tiposModel.delete(idTipo);

      // Verificamos que el resultado sea false
      expect(result).toBe(false);
    });
  });
});
