import supabase from "@/config/supabase";
import { Estado, EstadoNoId } from "@/src/estados/interfacesEstados";
import IEstadosDAO from "./IEstadosDAO";

// Constantes para los nombres de la tabla y los campos
const TABLE_NAME = "estados";
const FIELDS = {
  idEstado: "idestado",
  estado: "estado",
};

export default class EstadosSupabaseDAO implements IEstadosDAO {
  async getAll(): Promise<Estado[]> {
    const { data, error } = await supabase.from(TABLE_NAME).select("*");

    if (error) {
      console.error("Error al obtener estados:", error);
      return [];
    }

    console.log("Retrieved estados:", data);
    return data as Estado[];
  }

  async getById(id: number): Promise<Estado | null> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq(FIELDS.idEstado, id)
      .single();

    if (error) {
      console.error("Error al obtener estado por id:", error);
      return null;
    }

    return data as Estado;
  }

  async create(estado: EstadoNoId): Promise<Estado | null> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([{ [FIELDS.estado]: estado.estado }])
      .select();

    if (error) {
      console.error("Error al insertar estado:", error);
      return null;
    }

    return (data?.[0] as Estado) || null;
  }

  async update(id: number, estadoData: EstadoNoId): Promise<Estado | null> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({ [FIELDS.estado]: estadoData.estado })
      .eq(FIELDS.idEstado, id)
      .select();

    if (error) {
      console.error("Error al actualizar estado:", error);
      return null;
    }

    return (data?.[0] as Estado) || null;
  }

  async delete(id: number): Promise<boolean> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq(FIELDS.idEstado, id)
      .select();

    if (error) {
      console.error("Error al eliminar estado:", error);
      return false;
    }

    // Si obtuvimos datos de vuelta, significa que la eliminación fue exitosa
    return data && data.length > 0;
  }
}
