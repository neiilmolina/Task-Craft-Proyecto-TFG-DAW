// src/usuarios/schemasUsuarios.ts
import { z } from "zod";
import {
  UsuarioCreate,
  UsuarioUpdate,
  UserFilters,
} from "@/src/usuarios/interfacesUsuarios"; // Ajustar la importación

// Esquema para user_metadata (esto se aplica en las interfaces)
const user_metadataSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  avatar_url: z.string().optional(),
});
const emailSchema = z.string().email("El email debe ser válido");

const passwordSchema = z
  .string()
  .min(6, "La contraseña debe tener al menos 6 caracteres");

// Esquema para la creación de un usuario
const usuarioCreateSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  user_metadata: user_metadataSchema.optional(),
  role: z.string().min(1).optional(),
});

// Esquema para actualizar la información de un usuario
const usuarioUpdateSchema = z.object({
  email: emailSchema,
  user_metadata: user_metadataSchema.optional(),
  role: z.string().min(1).optional(),
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
  const result = usuarioUpdateSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: result.error.errors[0].message }; // Devuelve el primer error
  }
  return { success: true };
}

// Validación para filtros de usuarios
export function validateUserFilters(input: UserFilters) {
  return userFiltersSchema.safeParse(input);
}

export function validatePassword(password: string) {
  const result = passwordSchema.safeParse(password);

  if (!result.success) {
    return { success: false, error: result.error.errors[0].message }; // Devuelve el primer error
  }
  return { success: true };
}

export function validateEmail(email: string) {
  const result = emailSchema.safeParse(email);

  if (!result.success) {
    return { success: false, error: result.error.errors[0].message }; // Devuelve el primer error
  }
  return { success: true };
}
