// src/usuarios/dao/IUsuariosDAO.ts
import { 
    UsuarioCreate, 
    UsuarioUpdate, 
    AuthResponse, 
    LoginCredentials,
    UserFilters,
    PaginatedUsers 
} from '@/src/usuarios/interfacesUsuarios';
import { User } from '@supabase/supabase-js';

export default interface IUsuariosDAO {
    // Métodos de autenticación
    signUp(userData: UsuarioCreate): Promise<AuthResponse>;
    signIn(credentials: LoginCredentials): Promise<AuthResponse>;
    signOut(): Promise<void>;
    resetPassword(email: string): Promise<boolean>;
    
    // Métodos de gestión de usuarios
    getAll(filters?: UserFilters): Promise<PaginatedUsers>;
    getById(id: string): Promise<User | null>;
    create(userData: UsuarioCreate): Promise<User | null>;
    update(id: string, usuario: UsuarioUpdate): Promise<User | null>;
    delete(id: string): Promise<boolean>;
    
    // Gestión de perfil
    changePassword(newPassword: string): Promise<boolean>;
    
    // Nuevo método para resetear el email
    resetEmail(email: string): Promise<boolean>;
}
