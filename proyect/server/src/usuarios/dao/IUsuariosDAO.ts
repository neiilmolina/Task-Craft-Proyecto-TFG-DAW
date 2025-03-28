import {
    Usuario,
    UsuarioCreate,
    UsuarioReturn,
    UsuarioUpdate,
  } from "@/src/usuarios/interfacesUsuarios";
  
  export default interface IUsuariosDAO {
    getAll(idRol?: string): Promise<Usuario[]>;
    getById(id: string): Promise<Usuario | null>;
    create(usuario: UsuarioCreate): Promise<UsuarioReturn | null>;
    update(id: string, usuario: UsuarioUpdate): Promise<UsuarioReturn | null>;
    delete(id: string): Promise<boolean>;
  }
  