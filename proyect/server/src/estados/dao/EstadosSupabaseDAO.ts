import supabase from "@/config/supabase";
import { Estado, EstadoNoId } from "@/src/estados/interfacesEstados";
import IEstadosDAO  from "./IEstadosDAO";

export default class EstadosSupabaseDAO implements IEstadosDAO {
  async getAll(): Promise<Estado[]> {
    const { data, error } = await supabase.from("estados").select("*");
    
    if (error) {
      console.error("Error al obtener estados:", error);
      return [];
    }
    
    return data as Estado[];
  }

  async getById(id: number): Promise<Estado | null> {
    const { data, error } = await supabase
      .from("estados")
      .select("*")
      .eq("idEstado", id)
      .single();

    if (error) {
      console.error("Error al obtener estado por id:", error);
      return null;
    }
    
    return data as Estado;
  }

  async create(estado: EstadoNoId): Promise<Estado | null> {
    // Fixed the insert operation - it was using EstadosModel incorrectly
    const { data, error } = await supabase
      .from("estados")
      .insert([{ estado: estado.estado }])
      .select();

    if (error) {
      console.error("Error al insertar estado:", error);
      return null;
    }
    
    return data?.[0] as Estado || null;
  }

  async update(id: number, estadoData: EstadoNoId): Promise<Estado | null> {
    const { data, error } = await supabase
      .from("estados")
      .update({ estado: estadoData.estado })
      .eq("idEstado", id)
      .select();

    if (error) {
      console.error("Error al actualizar estado:", error);
      return null;
    }
    
    return data?.[0] as Estado || null;
  }

  async delete(id: number): Promise<boolean> {
    const { data, error } = await supabase
      .from("estados")
      .delete()
      .eq("idEstado", id)
      .select();

    if (error) {
      console.error("Error al eliminar estado:", error);
      return false;
    }
    
    // If we got data back, it means the deletion was successful
    return data && data.length > 0;
  }
}