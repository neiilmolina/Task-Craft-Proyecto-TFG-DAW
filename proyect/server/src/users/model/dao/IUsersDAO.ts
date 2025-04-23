import {
  User,
  UserCreate,
  UserReturn,
  UserUpdate,
} from "task-craft-models/src/model/users/interfaces/interfacesUsers";

export default interface IUsersDAO {
  getAll(idRol?: number, stringSearch?: string): Promise<User[]>;
  getById(id: string): Promise<User | null>;
  getByCredentials(email: string, password: string): Promise<User | null>;
  create(
    idUser: string,
    user: UserCreate
  ): Promise<UserReturn | null>;
  update(id: string, user: UserUpdate): Promise<UserReturn | null>;
  updatePassword(id: string, password: string): Promise<Boolean>;
  delete(id: string): Promise<boolean>;
}
