import {
  Usuario,
  UsuarioCreate,
  UsuarioReturn,
  UsuarioUpdate,
} from "@/src/usuarios/interfacesUsuarios";

export default interface IUsuariosDAO {
  getAll(idRol?: number): Promise<Usuario[]>;
  getById(id: string): Promise<Usuario | null>;
  getByCredentials(email: string, password: string): Promise<Usuario | null>;
  create(
    idUsuario: string,
    usuario: UsuarioCreate
  ): Promise<UsuarioReturn | null>;
  update(id: string, usuario: UsuarioUpdate): Promise<UsuarioReturn | null>;
  updatePassword(id: string, password: string): Promise<Boolean>;
  delete(id: string): Promise<boolean>;
}
