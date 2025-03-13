import TiposSupabaseDAO from "@/src/tipos/dao/TiposSupabaseDAO";
import supabase from "@/tests/__mocks__/supabase";
import { Tipo, TipoCreate, TipoUpdate } from "@/src/tipos/interfacesTipos"; // Usamos la interfaz Tipo

jest.mock("@/config/supabase", () => require("@/tests/__mocks__/supabase"));

describe("TiposSupabaseDAO", () => {
  const tiposDAO = new TiposSupabaseDAO();

  // Mock con la propiedad 'color' añadida
  const mockTipos: Tipo[] = [
    { idTipo: 1, tipo: "Evento", color: "#00000", idUsuario: "1" },
    { idTipo: 2, tipo: "Tarea", color: "#00000", idUsuario: "1" },
    { idTipo: 3, tipo: "Evento", color: "#00000", idUsuario: "2" },
  ];

  const mockTiposConUserDetails: Tipo[] = [
    {
      idTipo: 1,
      tipo: "Evento",
      color: "#00000",
      idUsuario: "1",
      userDetails: {
        id: "1",
        app_metadata: { provider: "email", roles: ["admin"] },
        user_metadata: { first_name: "User", last_name: "One" },
        aud: "authenticated",
        created_at: "2022-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z",
        email: "user1@example.com",
      },
    },
    {
      idTipo: 2,
      tipo: "Tarea",
      color: "#00000",
      idUsuario: "1",
      userDetails: {
        id: "1",
        app_metadata: { provider: "email", roles: ["admin"] },
        user_metadata: { first_name: "User", last_name: "One" },
        aud: "authenticated",
        created_at: "2022-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z",
        email: "user1@example.com",
      },
    },
    {
      idTipo: 3,
      tipo: "Evento",
      color: "#00000",
      idUsuario: "2",
      userDetails: {
        id: "2",
        app_metadata: { provider: "email", roles: ["user"] },
        user_metadata: { first_name: "User", last_name: "Two" },
        aud: "authenticated",
        created_at: "2022-02-01T00:00:00Z",
        updated_at: "2023-02-01T00:00:00Z",
        email: "user2@example.com",
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should return all tipos", async () => {
      const mockResponse = { data: mockTipos, error: null };

      // Mock de Supabase
      supabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockResponse),
      });

      // Ejecutamos la función que estamos probando
      const result = await tiposDAO.getAll();

      // Verificamos que supabase.from fue llamado con el nombre correcto de la tabla
      expect(supabase.from).toHaveBeenCalledWith("tipos");

      // Verificamos que select fue llamado con "*"
      expect(supabase.from().select).toHaveBeenCalledWith("*");

      // Verificamos que el resultado de la función es el esperado
      expect(result).toEqual(mockTipos);
    });

    it("should return all tipos with idUsuario = 1", async () => {
      // Filtramos los tipos que tengan idUsuario = "1"
      const mockFilterList = mockTipos.filter((tipo) => tipo.idUsuario === "1");

      // Mock encadenado para manejar from -> select -> eq
      const selectMock = jest.fn().mockReturnThis();
      const eqMock = jest
        .fn()
        .mockResolvedValue({ data: mockFilterList, error: null });

      supabase.from.mockReturnValue({
        select: selectMock,
        eq: eqMock,
      });

      // Ejecutamos la función que estamos probando
      const result = await tiposDAO.getAll("1");

      // Verificamos que supabase.from fue llamado con el nombre correcto de la tabla
      expect(supabase.from).toHaveBeenCalledWith("tipos");

      // Verificamos que select fue llamado con "*"
      expect(selectMock).toHaveBeenCalledWith("*");

      // Verificamos que eq fue llamado correctamente
      expect(eqMock).toHaveBeenCalledWith("tipos.idUsuario", "1");

      // Verificamos que el resultado de la función es el filtro esperado
      expect(result).toEqual(mockFilterList);
    });

    it("should return an empty array if an error occurs", async () => {
      // Mock de error
      const mockResponse = { data: null, error: "Error" };

      supabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await tiposDAO.getAll();

      expect(result).toEqual(null);
    });

    describe("getAll with userDetails = true", () => {
      it("should return tipos with user details when userDetails is true", async () => {
        // Mock de Supabase para la llamada
        supabase.from.mockReturnValue({
          select: jest
            .fn()
            .mockResolvedValue({ data: mockTiposConUserDetails, error: null }),
        });

        // Ejecutamos la función getAll con userDetails = true
        const result = await tiposDAO.getAll(undefined, true); // userDetails = true

        // Verificamos que supabase.from fue llamado con el nombre correcto de la tabla
        expect(supabase.from).toHaveBeenCalledWith("tipos");

        // Verificamos que select fue llamado con "*" y "auth.users(*)"
        expect(supabase.from().select).toHaveBeenCalledWith("*, auth.users(*)");

        // Verificamos que el resultado de la función es el esperado (con userDetails)
        expect(result).toEqual(mockTiposConUserDetails);
      });

      it("should return tipos with user details and idUsuario = 1 when userDetails is true", async () => {
        // Mock encadenado para simular from -> select -> eq
        const selectMock = jest.fn().mockReturnThis();
        const eqMock = jest
          .fn()
          .mockResolvedValue({ data: mockTiposConUserDetails, error: null });

        supabase.from.mockReturnValue({
          select: selectMock,
          eq: eqMock,
        });

        // Ejecutamos la función con userDetails = true
        const result = await tiposDAO.getAll("1", true);

        // Verificamos que supabase.from fue llamado con el nombre correcto de la tabla
        expect(supabase.from).toHaveBeenCalledWith("tipos");

        // Verificamos que select fue llamado con los campos correctos incluyendo el JOIN
        expect(selectMock).toHaveBeenCalledWith("*, auth.users(*)");

        // Verificamos que eq fue llamado correctamente con el filtro de idUsuario
        expect(eqMock).toHaveBeenCalledWith("tipos.idUsuario", "1");

        // Verificamos que el resultado es el esperado con detalles de usuario
        expect(result).toEqual(mockTiposConUserDetails);
      });
    });
  });

  describe("getById", () => {
    it("should return a tipo by id", async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSingle = jest
        .fn()
        .mockResolvedValue({ data: mockTipos[0], error: null });

      supabase.from.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      const result = await tiposDAO.getById(1);

      expect(supabase.from).toHaveBeenCalledWith("tipos");
      expect(mockSelect).toHaveBeenCalledWith("*");
      expect(mockEq).toHaveBeenCalledWith("idTipo", 1);
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual(mockTipos[0]);
    });

    it("should return null if an error occurs", async () => {
      supabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({ data: null, error: "Error" }),
      });

      const result = await tiposDAO.getById(1);

      expect(result).toBeNull();
    });

    describe("getById with userDetails = true", () => {
      it("should return a tipo by id with user details", async () => {
        const mockSelect = jest.fn().mockReturnThis();
        const mockEq = jest.fn().mockReturnThis();
        const mockSingle = jest
          .fn()
          .mockResolvedValue({ data: mockTipos[0], error: null });

        supabase.from.mockReturnValue({
          select: mockSelect,
          eq: mockEq,
          single: mockSingle,
        });

        const result = await tiposDAO.getById(1, true);

        expect(supabase.from).toHaveBeenCalledWith("tipos");
        expect(mockSelect).toHaveBeenCalledWith("*, auth.users(*)");
        expect(mockEq).toHaveBeenCalledWith("idTipo", 1);
        expect(mockSingle).toHaveBeenCalled();
        expect(result).toEqual(mockTipos[0]);
      });

      it("should return null if an error occurs", async () => {
        const mockSelect = jest.fn().mockReturnThis();
        const mockEq = jest.fn().mockReturnThis();
        const mockSingle = jest
          .fn()
          .mockResolvedValue({ data: null, error: new Error("Error") });

        supabase.from.mockReturnValue({
          select: mockSelect,
          eq: mockEq,
          single: mockSingle,
        });

        const result = await tiposDAO.getById(1, true);

        expect(result).toBeNull();
      });
    });
  });

  describe("create", () => {
    it("should create a new tipo", async () => {
      const mockCreate: TipoCreate = {
        tipo: "Evento",
        color: "#00000",
        idUsuario: "1",
      };

      const mockCreateReturnValue: Tipo = {
        ...mockCreate,
        idTipo: 1,
      };

      supabase.from.mockReturnValue({
        insert: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockCreateReturnValue,
          error: null,
        }),
      });

      const result = await tiposDAO.create(mockCreate);

      // Aquí es donde debes esperar la llamada con mockCreate, no con mockTipos[0]
      expect(supabase.from).toHaveBeenCalledWith("tipos");
      expect(supabase.from().insert).toHaveBeenCalledWith([
        {
          tipo: mockCreate.tipo,
          color: mockCreate.color,
          idUsuario: mockCreate.idUsuario,
        },
      ]);
      expect(supabase.from().single).toHaveBeenCalled();

      // Deberías esperar que el resultado sea mockCreateReturnValue
      expect(result).toEqual(mockCreateReturnValue);
    });

    it("should return null if an error occurs", async () => {
      supabase.from.mockReturnValue({
        insert: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: "Error" }),
      });

      const result = await tiposDAO.create(mockTipos[0]);

      expect(result).toBeNull();
    });
  });

  describe.only("update", () => {
    it("should update an existing tipo", async () => {
      const mockUpdate: TipoUpdate = {
        tipo: "Evento",
        color: "#00000",
        idUsuario: "1", // Asegúrate de que idUsuario esté presente aquí
      };

      const mockUpdateReturnValue: Tipo = {
        ...mockUpdate,
        idTipo: 1,
        idUsuario: mockUpdate.idUsuario ?? "1",
      };

      supabase.from.mockReturnValue({
        update: jest
          .fn()
          .mockResolvedValue({ data: mockUpdateReturnValue, error: null }),
      });

      const result = await tiposDAO.update(1, mockUpdate);

      expect(supabase.from).toHaveBeenCalledWith("tipos");

      // Comparación exacta del objeto
      expect(supabase.from().update).toHaveBeenCalledWith([
        {
          tipo: mockUpdate.tipo,
          color: mockUpdate.color,
          idUsuario: mockUpdate.idUsuario,
        },
      ]);

      expect(result).toEqual(mockUpdateReturnValue);
    });

    it("should return null if an error occurs", async () => {
      supabase.from.mockReturnValue({
        update: jest.fn().mockResolvedValue({ data: null, error: "Error" }),
      });

      const result = await tiposDAO.update(1, mockTipos[0]);

      expect(result).toBeNull();
    });
  });

  describe("delete", () => {
    it("should delete an existing tipo", async () => {
      supabase.from.mockReturnValue({
        delete: jest
          .fn()
          .mockResolvedValue({ data: [mockTipos[0]], error: null }),
      });

      const result = await tiposDAO.delete(1);

      expect(supabase.from).toHaveBeenCalledWith("tipos");
      expect(supabase.from().delete).toHaveBeenCalled();
      expect(result).toEqual(mockTipos[0]);
    });

    it("should return false if an error occurs", async () => {
      supabase.from.mockReturnValue({
        delete: jest.fn().mockResolvedValue({ data: null, error: "Error" }),
      });

      const result = await tiposDAO.delete(1);

      expect(result).toBe(false);
    });
  });
});
