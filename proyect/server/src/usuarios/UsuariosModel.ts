import IUsuariosDAO from "@/src/usuarios/dao/IUsuariosDAO";
import { UsuarioCreate, UsuarioUpdate } from "./interfacesUsuarios";

export default class UsuariosModel {
  constructor(private usuariosDAO: IUsuariosDAO) {}

  // Obtener todos los roles
  async getAll(idRol?: number) {
    return this.usuariosDAO.getAll(idRol);
  }

  async getByCredentials(email: string, password: string) {
    return this.usuariosDAO.getByCredentials(email, password);
  }

  // Obtener rol por ID
  async getById(id: string) {
    return this.usuariosDAO.getById(id);
  }

  // Crear un rol
  async create(idUsuario: string, usuario: UsuarioCreate) {
    return this.usuariosDAO.create(idUsuario ,usuario);
  }

  // Actualizar un rol
  async update(id: string, usuario: UsuarioUpdate) {
    return this.usuariosDAO.update(id, usuario);
  }

  // Eliminar un rol
  async delete(id: string) {
    return this.usuariosDAO.delete(id);
  }
}
