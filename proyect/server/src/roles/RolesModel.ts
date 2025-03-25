import IRolesDAO from "@/src/roles/dao/IRolesDAO";
import { RolNoId } from "@/src/roles/interfacesRoles";
export default class RolesModel {
  constructor(private rolesDAO: IRolesDAO) {}

  // Obtener todos los roles
  async getAll() {
    return this.rolesDAO.getAll();
  }

  // Obtener tipo por ID
  async getById(idRol: number) {
    return this.rolesDAO.getById(idRol);
  }

  // Crear un tipo
  async create(tipo: RolNoId) {
    return this.rolesDAO.create(tipo);
  }

  // Actualizar un tipo
  async update(idRol: number, tipo: RolNoId) {
    return this.rolesDAO.update(idRol, tipo);
  }

  // Eliminar un tipo
  async delete(idRol: number) {
    return this.rolesDAO.delete(idRol);
  }
}
