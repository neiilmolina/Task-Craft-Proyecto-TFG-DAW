import ITiposDAO from "@/src/tipos/dao/ITiposDAO";
import { TipoCreate, TipoUpdate } from "@/src/tipos/interfacesTipos";

export default class TiposModel {
  constructor(private tiposDAO: ITiposDAO) {}

  // Obtener todos los tipos
  async getAll(idUsuario?: string, userDetails?: boolean) {
    return this.tiposDAO.getAll(idUsuario, userDetails);
  }

  // Obtener tipo por ID
  async getById(idTipo: number, userDetails?: boolean) {
    return this.tiposDAO.getById(idTipo, userDetails);
  }

  // Crear un tipo
  async create(tipo: TipoCreate) {
    return this.tiposDAO.create(tipo);
  }

  // Actualizar un tipo
  async update(idTipo: number, tipo: TipoUpdate) {
    return this.tiposDAO.update(idTipo, tipo);
  }

  // Eliminar un tipo
  async delete(idTipo: number) {
    return this.tiposDAO.delete(idTipo);
  }
}
