import supabase from "@/config/supabase";
import { Estado, EstadoNoId } from "@/src/estados/interfaces";

export class EstadosModel {
  async selectAllEstados() {
    const { data: estados, error } = await supabase.from("estados").select("*");
    if (error) {
      console.error("Error al obtener estados:", error);
      return [];
    }
    return estados;
  }

  async selectEstadoById(id: number) {
    const { data: estados, error } = await supabase
      .from("estados")
      .select("*")
      .eq("idEstado", id)
      .single();

    if (error) {
      console.error("Error al obtener estado por id:", error);
      return [];
    }
    return estados;
  }

  async insertEstado(estado: EstadoNoId) {
    const uuid = require("uuid");
    const { data, error } = await supabase
      .from("estados")
      .insert([{ idEstado: uuid, estado: estado.estado }])
      .select();

    if (error) {
      console.error("Error al insertar estado:", error);
      return [];
    }
    return data;
  }
  
  async deleteEstado(id: number) {
    const { data, error } = await supabase
      .from("estados")
      .delete()
      .eq("idEstado", id)
      .select();

    if (error) {
      console.error("Error al eliminar estado:", error);
      return [];
    }
    return data;
  }

  async updateEstado(estado: Estado) {
    const { data, error } = await supabase
      .from("estados")
      .update({ estado: estado.estado })
      .eq("idEstado", estado.idEstado)
      .select();

    if (error) {
      console.error("Error al actualizar estado:", error);
      return [];
    }
    return data;
  }
}
