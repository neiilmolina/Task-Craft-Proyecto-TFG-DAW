import IUsuariosDAO from "@/src/usuarios/dao/IUsuariosDAO";
import {
  Usuario,
  UsuarioCreate,
  UsuarioUpdate,
  PaginatedUsers,
  UserFilters,
  AuthResponse,
  LoginCredentials,
} from "@/src/usuarios/interfacesUsuarios";

export default class UsuariosModel {
  constructor(private usuariosDAO: IUsuariosDAO) {}

  // Crear un usuario
  async signUp(usuario: UsuarioCreate): Promise<AuthResponse> {
    return this.usuariosDAO.signUp(usuario);
  }

  // Iniciar sesión
  async signIn(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.usuariosDAO.signIn(credentials);
  }

  // Cerrar sesión
  async signOut(): Promise<void> {
    return this.usuariosDAO.signOut();
  }

  // Restablecer la contraseña
  async resetPassword(email: string): Promise<boolean> {
    return this.usuariosDAO.resetPassword(email);
  }

  // Obtener todos los usuarios con filtros y paginación
  async getAll(filters?: UserFilters): Promise<PaginatedUsers> {
    return this.usuariosDAO.getAll(filters);
  }

  // Obtener usuario por ID
  async getById(id: string): Promise<Usuario | null> {
    return this.usuariosDAO.getById(id);
  }

  // Eliminar un usuario
  async delete(id: string): Promise<boolean> {
    return this.usuariosDAO.delete(id);
  }

  // Crear un usuario
  async create(usuario: UsuarioCreate): Promise<Usuario | null> {
    return this.usuariosDAO.create(usuario);
  }

  // Actualizar un usuario
  async update(id: string, usuario: UsuarioUpdate): Promise<Usuario | null> {
    return this.usuariosDAO.update(id, usuario);
  }

  // Cambiar la contraseña del usuario
  async changePassword(newPassword: string): Promise<boolean> {
    return this.usuariosDAO.changePassword(newPassword);
  }

  // Restablecer el correo del usuario
  async resetEmail(email: string): Promise<boolean> {
    return this.usuariosDAO.resetEmail(email);
  }
}
