import IRolesDAO from "@/src/roles/dao/IRolesDAO";
import { RolNoId } from "@/src/roles/interfacesRoles";
export default class RolesModel {
  constructor(private rolesDAO: IRolesDAO) {}

  // Obtener todos los roles
  async getAll() {
    return this.rolesDAO.getAll();
  }

  // Obtener rol por ID
  async getById(idRol: number) {
    return this.rolesDAO.getById(idRol);
  }

  // Crear un rol
  async create(rol: RolNoId) {
    return this.rolesDAO.create(rol);
  }

  // Actualizar un rol
  async update(idRol: number, rol: RolNoId) {
    return this.rolesDAO.update(idRol, rol);
  }

  // Eliminar un rol
  async delete(idRol: number) {
    return this.rolesDAO.delete(idRol);
  }
}
