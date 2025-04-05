import IUsuariosDAO from "@/src/usuarios/dao/IUsuariosDAO";
import { UsuarioCreate, UsuarioUpdate } from "./interfacesUsuarios";

export default class UsuariosModel {
  constructor(private usuariosDAO: IUsuariosDAO) {}

  async getAll(idRol?: number) {
    return this.usuariosDAO.getAll(idRol);
  }

  async getByCredentials(email: string, password: string) {
    return this.usuariosDAO.getByCredentials(email, password);
  }

  async getById(id: string) {
    return this.usuariosDAO.getById(id);
  }

  async create(idUsuario: string, usuario: UsuarioCreate) {
    return this.usuariosDAO.create(idUsuario, usuario);
  }

  async update(id: string, usuario: UsuarioUpdate) {
    return this.usuariosDAO.update(id, usuario);
  }

  async updatePassword(id: string, password: string) {
    return this.usuariosDAO.updatePassword(id, password);
  }

  async delete(id: string) {
    return this.usuariosDAO.delete(id);
  }
}
