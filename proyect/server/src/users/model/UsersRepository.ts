import IUsersDAO from "@/src/users/model/dao/IUsersDAO";
import {
  UserCreate,
  UserUpdate,
} from "task-craft-models";

export default class UsersRepository {
  constructor(private usersDAO: IUsersDAO) {}

  async getAll(idRol?: number, stringSearch?: string) {
    return this.usersDAO.getAll(idRol, stringSearch);
  }

  async getByCredentials(email: string, password: string) {
    return this.usersDAO.getByCredentials(email, password);
  }

  async getById(id: string) {
    return this.usersDAO.getById(id);
  }

  async create(idUsuario: string, usuario: UserCreate) {
    return this.usersDAO.create(idUsuario, usuario);
  }

  async update(id: string, usuario: UserUpdate) {
    return this.usersDAO.update(id, usuario);
  }

  async updatePassword(id: string, password: string) {
    return this.usersDAO.updatePassword(id, password);
  }

  async updateEmail(id: string, email: string) {
    return this.usersDAO.updateEmail(id, email);
  }

  async updateUserName(id: string, userName: string) {
    return this.usersDAO.updateUserName(id, userName);
  }

  async delete(id: string) {
    return this.usersDAO.delete(id);
  }
}
