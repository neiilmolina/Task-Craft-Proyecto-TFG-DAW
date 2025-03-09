// src/usuarios/schemasUsuarios.ts
import { z } from "zod";
import {
  UsuarioCreate,
  UsuarioUpdate,
  UserFilters,
} from "@/src/usuarios/interfacesUsuarios"; // Ajustar la importación

// Esquema para user_metadata (esto se aplica en las interfaces)
const userMetadataSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  avatar_url: z.string().optional(),
});

// Esquema para la creación de un usuario
const usuarioCreateSchema = z.object({
  email: z.string().email("El email debe ser válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  user_metadata: userMetadataSchema.optional(),
  role: z.string().min(1).optional(),
});

// Esquema para actualizar la información de un usuario
const usuarioUpdateSchema = z.object({
  user_metadata: userMetadataSchema.optional(),
  role: z.string().min(1).optional(),
  email: z.string().email("El email debe ser válido"),
});

// Esquema para filtros de usuarios
const userFiltersSchema = z.object({
  role: z.string().optional(),
  searchTerm: z.string().optional(),
  sortBy: z.enum(["createdAt", "email", "role"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

export function validateUsuarioCreate(input: UsuarioCreate) {
  const result = usuarioCreateSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: result.error.errors[0].message }; // Mensaje del primer error
  }
  return { success: true };
}

// Validación para la actualización de un usuario
export function validateUsuarioUpdate(input: UsuarioUpdate) {
  return usuarioUpdateSchema.safeParse(input);
}

// Validación para filtros de usuarios
export function validateUserFilters(input: UserFilters) {
  return userFiltersSchema.safeParse(input);
}
