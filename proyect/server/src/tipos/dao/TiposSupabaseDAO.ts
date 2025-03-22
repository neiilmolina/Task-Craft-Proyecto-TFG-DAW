import ITiposDAO from "./ITiposDAO";
import { Tipo, TipoCreate, TipoUpdate } from "@/src/tipos/interfacesTipos";
import supabase from "@/config/supabase"; // Asegúrate de que tu archivo de configuración de Supabase esté correctamente configurado

// Constantes para los nombres de la tabla y los campos
const TABLE_NAME = "tipos";
const FIELDS = {
  idTipo: "idtipo",
  tipo: "tipo",
  color: "color",
  idUsuario: "idusuario",
};

export default class TiposSupabaseDAO implements ITiposDAO {
  // Obtener todos los tipos, opcionalmente filtrados por idUsuario
  async getAll(
    idUsuario?: string,
    userDetails?: boolean
  ): Promise<Tipo[] | null> {
    try {
      let query;

      if (userDetails) {
        query = supabase.from(TABLE_NAME).select("*, auth.users(*)");
      } else {
        query = supabase.from(TABLE_NAME).select("*");
      }

      if (idUsuario) {
        query = query.eq("tipos.idUsuario", idUsuario);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data as Tipo[];
    } catch (error) {
      console.error("Error fetching tipos:", error);
      return null;
    }
  }

  // Obtener un tipo por su idTipo
  async getById(idTipo: number, userDetails?: boolean): Promise<Tipo | null> {
    try {
      // Definir el select según si se requieren los detalles del usuario
      let query;

      if (userDetails) {
        query = supabase.from(TABLE_NAME).select("*, auth.users(*)");
      } else {
        query = supabase.from(TABLE_NAME).select("*");
      }

      query = query.eq(FIELDS.idTipo, idTipo).single();

      const { data, error } = await query;
      if (error) throw error;

      return data as Tipo;
    } catch (error) {
      console.error("Error fetching tipo by id:", error);
      return null;
    }
  }

  // Crear un nuevo tipo
  async create(tipo: TipoCreate): Promise<Tipo | null> {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert([
          {
            [FIELDS.tipo]: tipo.tipo,
            [FIELDS.color]: tipo.color,
            [FIELDS.idUsuario]: tipo.idUsuario,
          },
        ])
        .single();

      if (error) throw error;

      return data as Tipo;
    } catch (error) {
      console.error("Error creating tipo:", error);
      return null;
    }
  }

  // Actualizar un tipo existente
  async update(idTipo: number, tipo: TipoUpdate): Promise<Tipo | null> {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .update({
          [FIELDS.tipo]: tipo.tipo,
          [FIELDS.color]: tipo.color,
          [FIELDS.idUsuario]: tipo.idUsuario,
        })
        .eq(FIELDS.idTipo, idTipo) // Filtra por idTipo
        .single(); // Devuelve el objeto actualizado

      if (error) throw error;

      return data as Tipo;
    } catch (error) {
      console.error("Error updating tipo:", error);
      return null;
    }
  }

  // Eliminar un tipo por su idTipo
  async delete(idTipo: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(TABLE_NAME)
        .delete()
        .eq(FIELDS.idTipo, idTipo);

      if (error) throw error;

      return true; // Si no hubo error, la eliminación fue exitosa
    } catch (error) {
      console.error("Error deleting tipo:", error);
      return false;
    }
  }
}
