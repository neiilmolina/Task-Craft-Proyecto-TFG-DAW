import ITiposDAO from "@/src/types/model/dao/ITypesDAO";
import {
  TypeCreate,
  TypeUpdate,
} from "@/src/types/model/interfaces/interfacesTypes";

export default class TypesRepository {
  constructor(private typesDAO: ITiposDAO) {}

  // Obtener todos los tipos
  async getAll(idUsuario?: string) {
    return this.typesDAO.getAll(idUsuario);
  }

  // Obtener tipo por ID
  async getById(idTipo: number) {
    return this.typesDAO.getById(idTipo);
  }

  // Crear un tipo
  async create(tipo: TypeCreate) {
    return this.typesDAO.create(tipo);
  }

  // Actualizar un tipo
  async update(idTipo: number, tipo: TypeUpdate) {
    return this.typesDAO.update(idTipo, tipo);
  }

  // Eliminar un tipo
  async delete(idTipo: number) {
    return this.typesDAO.delete(idTipo);
  }
}
