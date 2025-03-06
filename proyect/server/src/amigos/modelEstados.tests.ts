// src/estados/__tests__/modelEstados.test.ts

import supabase from '@/config/supabase';
import { EstadosSupabaseDAO } from '@/src/estados/dao/EstadosSupabaseDAO';
// Mock de supabase
jest.mock('@/src/config/supabase');

describe('EstadosModel', () => {
  let estadosModel: EstadosSupabaseDAO;
  const mockSupabase = supabase as jest.Mocked<typeof supabase>;

  beforeEach(() => {
    jest.clearAllMocks();
    estadosModel = new EstadosModel();
  });

  describe('getAll', () => {
    it('debería obtener todos los estados de Supabase', async () => {
      const mockEstados = [{ id: 1, nombre: 'Activo' }, { id: 2, nombre: 'Inactivo' }];
      
      // Configurar el mock para devolver datos
      mockSupabase.from.mockReturnThis();
      mockSupabase.select.mockResolvedValue({
        data: mockEstados,
        error: null
      });

      const result = await estadosModel.getAll();

      expect(mockSupabase.from).toHaveBeenCalledWith('estados');
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(result).toEqual(mockEstados);
    });

    it('debería manejar errores de Supabase', async () => {
      mockSupabase.from.mockReturnThis();
      mockSupabase.select.mockResolvedValue({
        data: null,
        error: { message: 'Error de conexión' }
      });

      await expect(estadosModel.getAll()).rejects.toThrow('Error de conexión');
    });
  });

  // Tests similares para getById, create, update y delete
});
