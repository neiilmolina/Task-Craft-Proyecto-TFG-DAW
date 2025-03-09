// src/usuarios/interfaces/UsuarioInterfaces.ts
import { Session, User } from "@supabase/supabase-js";

export interface user_metadata {
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}

// Interface for creating a new user (without ID and timestamps)
export interface UsuarioCreate {
  email: string;
  password: string;
  userMetadata?: user_metadata;
  role?: string;
}

// Interface for updating user information (all fields optional)
export interface UsuarioUpdate {
  userMetadata?: user_metadata;
  role?: string;
  email?: string;
}

// Interface for authentication response
export interface AuthResponse {
  user: User | null;
  session: Session | any | null;
  error?: string;
}

// Interface for login credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

// Interface for password reset
export interface PasswordReset {
  email: string;
}

// Interface for user profile
export interface UserProfile {
  firstName?: string;
  lastName?: string;
  role?: string;
  email: string;
}

// Interface for user search filters
export interface UserFilters {
  role?: string;
  searchTerm?: string;
  sortBy?: "createdAt" | "email" | "role";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

// Interface for pagination response
export interface PaginatedUsers {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
