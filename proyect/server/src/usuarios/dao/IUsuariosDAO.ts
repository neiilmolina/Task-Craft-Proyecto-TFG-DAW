// src/usuarios/dao/IUsuariosDAO.ts
import { 
    Usuario, 
    UsuarioCreate, 
    UsuarioUpdate, 
    AuthResponse, 
    LoginCredentials,
    UserFilters,
    PaginatedUsers 
} from '@/src/usuarios/interfacesUsuarios';

export default interface IUsuariosDAO {
    // Métodos de autenticación
    signUp(userData: UsuarioCreate): Promise<AuthResponse>;
    signIn(credentials: LoginCredentials): Promise<AuthResponse>;
    signOut(): Promise<void>;
    resetPassword(email: string): Promise<boolean>;
    
    // Métodos de gestión de usuarios
    getAll(filters?: UserFilters): Promise<PaginatedUsers>;
    getById(id: string): Promise<Usuario | null>;
    create(userData: UsuarioCreate): Promise<Usuario | null>;
    update(id: string, usuario: UsuarioUpdate): Promise<Usuario | null>;
    delete(id: string): Promise<boolean>;
    
    // Gestión de perfil
    changePassword(newPassword: string): Promise<boolean>;
    
    // Nuevo método para resetear el email
    resetEmail(email: string): Promise<boolean>;
}
