import supabase from "@/config/supabase";
import IUsuariosDAO from "./IUsuariosDAO";
import {
  UsuarioCreate,
  UsuarioUpdate,
  AuthResponse,
  LoginCredentials,
  UserFilters,
  PaginatedUsers,
} from "@/src/usuarios/interfacesUsuarios";
import { User } from "@supabase/supabase-js";

export default class UsuariosSupabaseDAO implements IUsuariosDAO {
  // Registro de usuario
  async signUp(userData: UsuarioCreate): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            role: userData.role || "user",
            ...userData.userMetadata,
          },
        },
      });

      if (error) throw error;

      return {
        user: data.user as User,
        session: data.session,
      };
    } catch (error: any) {
      console.error("Error in signUp:", error);
      return {
        user: null,
        session: null,
        error: error.message,
      };
    }
  }

  // Inicio de sesión
  async signIn(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;

      return {
        user: data.user as User,
        session: data.session,
      };
    } catch (error: any) {
      console.error("Error in signIn:", error);
      return {
        user: null,
        session: null,
        error: error.message,
      };
    }
  }

  // Cierre de sesión
  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  // Restablecer contraseña
  async resetPassword(email: string): Promise<boolean> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error in resetPassword:", error);
      return false;
    }
  }

  async getAll(filters?: UserFilters): Promise<PaginatedUsers> {
    try {
      // Obtener todos los usuarios con supabase.auth.admin.listUsers()
      const { data, error } = await supabase.auth.admin.listUsers({
        page: filters?.page || 1, // Página solicitada
        perPage: filters?.limit || 10, // Número de usuarios por página
      });

      if (error) throw error;

      let users = data.users as User[];

      // Filtrar por rol si se especifica
      if (filters?.role) {
        users = users.filter((user) => user.role === filters.role);
      }

      // Filtrar por término de búsqueda en email, nombre y apellido
      if (filters?.searchTerm) {
        const searchTermLower = filters.searchTerm.toLowerCase();

        users = users.filter((user) => {
          // Filtrar por email, first_name y last_name
          return (
            user.email?.toLowerCase().includes(searchTermLower) ||
            user.user_metadata?.first_name
              .toLowerCase()
              .includes(searchTermLower) ||
            user.user_metadata?.last_name
              .toLowerCase()
              .includes(searchTermLower)
          );
        });
      }

      // Ordenar los usuarios por un campo y orden (si se especifica)
      if (filters?.sortBy) {
        users = users.sort((a, b) => {
          const fieldA = a[filters.sortBy as keyof User] as string;
          const fieldB = b[filters.sortBy as keyof User] as string;
          if (filters.sortOrder === "asc") {
            return fieldA.localeCompare(fieldB);
          } else {
            return fieldB.localeCompare(fieldA);
          }
        });
      }

      // Paginación: calcular los usuarios a mostrar según la página y el límite
      const page = filters?.page ?? 1; // Usamos 1 como valor predeterminado si no está definido
      const limit = filters?.limit ?? 10; // Usamos 10 como valor predeterminado si no está definido

      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedUsers = users.slice(start, end);

      // Devolver los resultados paginados
      return {
        users: paginatedUsers,
        total: users.length,
        page: filters?.page || 1,
        limit: filters?.limit || 10,
        totalPages: Math.ceil(users.length / (filters?.limit || 10)),
      };
    } catch (error) {
      console.error("Error in getAll:", error);
      throw error;
    }
  }

  // Obtener usuario por ID
  async getById(id: string): Promise<User | null> {
    try {
      const { data, error } = await supabase.auth.getUser(id);

      if (error) throw error;
      return data.user as User;
    } catch (error) {
      console.error("Error in getById:", error);
      return null;
    }
  }

  // Eliminar un usuario
  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.auth.admin.deleteUser(id);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error("Error in delete:", error);
      return false;
    }
  }

  async create(userData: UsuarioCreate): Promise<User | null> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            role: userData.role || "user",
            ...userData.userMetadata,
          },
        },
      });

      if (error) throw error;

      return data.user as User;
    } catch (error: any) {
      console.error("Error in signUp:", error);
      return null;
    }
  }

  // Actualizar un usuario
  async update(id: string, usuario: UsuarioUpdate): Promise<User | null> {
    try {
      // Preparar los datos de usuario a actualizar
      const updateData: any = { ...usuario };

      // Si user_metadata está presente, propagamos sus valores
      if (usuario.user_metadata) {
        updateData.data = { ...usuario.user_metadata };
      }

      // Realizamos la actualización del usuario
      const { data, error } = await supabase.auth.admin.updateUserById(
        id,
        updateData
      );

      if (error) throw error;

      return data.user as User;
    } catch (error) {
      console.error("Error in update:", error);
      return null;
    }
  }

  async changePassword(newPassword: string): Promise<boolean> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error in changePassword:", error);
      return false;
    }
  }

  // Restablecer correo del usuario
  async resetEmail(email: string): Promise<boolean> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "https://your-app-url.com/reset-email", // URL donde el usuario podrá actualizar su correo
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error in resetEmail:", error);
      return false;
    }
  }
}
