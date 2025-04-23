import IRolesDAO from "@/src/roles/model/dao/IRolesDAO";
import { RoleNoId } from "task-craft-models/src/model/roles/interfaces/schemasRoles";
export default class RolesRepository {
  constructor(private rolesDAO: IRolesDAO) {}

  // Obtener todos los roles
  async getAll() {
    return this.rolesDAO.getAll();
  }

  // Obtener rol por ID
  async getById(idRole: number) {
    return this.rolesDAO.getById(idRole);
  }

  // Crear un rol
  async create(role: RoleNoId) {
    return this.rolesDAO.create(role);
  }

  // Actualizar un rol
  async update(idRole: number, role: RoleNoId) {
    return this.rolesDAO.update(idRole, role);
  }

  // Eliminar un rol
  async delete(idRole: number) {
    return this.rolesDAO.delete(idRole);
  }
}
