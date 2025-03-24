jest.mock("@/config/supabase", () => require("@/tests/__mocks__/supabase"));

import EstadosSupabaseDAO from "@/src/estados/dao/EstadosSupabaseDAO";
import supabase from "@/tests/__mocks__/supabase";
import { Estado, EstadoNoId } from "@/src/estados/interfacesEstados";

describe("EstadosSupabaseDAO", () => {
  let estadosDAO: EstadosSupabaseDAO = new EstadosSupabaseDAO();
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should return all estados", async () => {
      const mockEstados: Estado[] = [
        { idEstado: 1, estado: "Activo" },
        { idEstado: 2, estado: "Inactivo" },
      ];

      supabase
        .from()
        .select.mockResolvedValue({ data: mockEstados, error: null });

      const result = await estadosDAO.getAll();

      expect(result).toEqual(mockEstados);
      expect(supabase.from).toHaveBeenCalledWith("estados");
      expect(supabase.from().select).toHaveBeenCalledWith("*");
    });

    it("should return an empty array if an error occurs", async () => {
      supabase
        .from()
        .select.mockResolvedValue({ data: null, error: new Error("Error") });

      const result = await estadosDAO.getAll();

      expect(result).toEqual([]);
    });
  });

  describe("getById", () => {
    const mockEstado = { idEstado: 1, estado: "Activo" };

    it("should return a estado by id", async () => {
      supabase.from.mockReturnThis();
      supabase.select.mockReturnThis();
      supabase.eq.mockReturnThis();
      supabase.single.mockResolvedValue({ data: mockEstado, error: null });

      const result = await estadosDAO.getById(1);
      expect(supabase.from).toHaveBeenCalledWith("estados");
      expect(supabase.select).toHaveBeenCalledWith("*");
      expect(supabase.eq).toHaveBeenCalledWith("idEstado", 1);
      expect(supabase.single).toHaveBeenCalled();
      expect(result).toEqual(mockEstado);
    });

    it("should return null if an error occurs", async () => {
      supabase.from.mockReturnThis();
      supabase.select.mockReturnThis();
      supabase.eq.mockReturnThis();
      supabase.single.mockResolvedValue({
        data: null,
        error: new Error("Error"),
      });

      const result = await estadosDAO.getById(1);
      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("should create a new estado", async () => {
      const newEstado: EstadoNoId = { estado: "Nuevo" };
      const createdEstado: Estado = { idEstado: 3, estado: "Nuevo" };

      supabase
        .from()
        .insert()
        .select.mockResolvedValue({ data: [createdEstado], error: null });

      const result = await estadosDAO.create(newEstado);

      expect(result).toEqual(createdEstado);
      expect(supabase.from).toHaveBeenCalledWith("estados");
      expect(supabase.from().insert).toHaveBeenCalledWith([
        { estado: "Nuevo" },
      ]);
    });

    it("should return null if an error occurs", async () => {
      supabase
        .from()
        .insert()
        .select.mockResolvedValue({ data: null, error: new Error("Error") });

      const result = await estadosDAO.create({ estado: "Nuevo" });

      expect(result).toBeNull();
    });
  });

  describe("update", () => {
    it("should update an existing estado", async () => {
      const updatedEstado: Estado = { idEstado: 1, estado: "Actualizado" };

      supabase
        .from()
        .update()
        .eq()
        .select.mockResolvedValue({ data: [updatedEstado], error: null });

      const result = await estadosDAO.update(1, { estado: "Actualizado" });

      expect(result).toEqual(updatedEstado);
      expect(supabase.from().update).toHaveBeenCalledWith({
        estado: "Actualizado",
      });
      expect(supabase.from().eq).toHaveBeenCalledWith("idEstado", 1);
    });

    it("should return null if an error occurs", async () => {
      supabase
        .from()
        .update()
        .eq()
        .select.mockResolvedValue({ data: null, error: new Error("Error") });

      const result = await estadosDAO.update(1, { estado: "Actualizado" });

      expect(result).toBeNull();
    });
  });

  describe("delete", () => {
    it("should delete an existing estado", async () => {
      supabase
        .from()
        .delete()
        .eq()
        .select.mockResolvedValue({ data: [{}], error: null });

      const result = await estadosDAO.delete(1);

      expect(result).toBe(true);
      expect(supabase.from().delete).toHaveBeenCalled();
      expect(supabase.from().eq).toHaveBeenCalledWith("idEstado", 1);
    });

    it("should return false if an error occurs", async () => {
      supabase
        .from()
        .delete()
        .eq()
        .select.mockResolvedValue({ data: null, error: new Error("Error") });

      const result = await estadosDAO.delete(1);

      expect(result).toBe(false);
    });
  });
});
