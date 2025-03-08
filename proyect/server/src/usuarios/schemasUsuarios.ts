// src/usuarios/schemasUsuarios.ts
import { z } from "zod";
import {
  Usuario,
  UsuarioCreate,
  UsuarioUpdate,
  UserFilters,
} from "@/src/usuarios/interfacesUsuarios";

// Definir atributos comunes
const id = z.string().uuid().optional();
const email = z.string().email("El email debe ser válido");
const firstName = z
  .string()
  .min(2, "El nombre debe tener al menos 2 caracteres")
  .optional();
const lastName = z
  .string()
  .min(2, "El apellido debe tener al menos 2 caracteres")
  .optional();
const role = z.string().min(1, "El rol es requerido");
const createdAt = z.string().optional();
const updatedAt = z.string().optional();
const password = z
  .string()
  .min(6, "La contraseña debe tener al menos 6 caracteres");

// Esquema para un Usuario completo
const usuarioSchema = z.object({
  id,
  email,
  firstName,
  lastName,
  role: role, // Rol requerido en este caso
  createdAt,
  updatedAt,
});

// Esquema para la creación de un usuario
const usuarioCreateSchema = z.object({
  email,
  password,
  firstName,
  lastName,
  role: role.optional(),
});

// Esquema para actualizar la información de un usuario
const usuarioUpdateSchema = z.object({
  firstName,
  lastName,
  role: role.optional(),
  email,
});

// Esquema para filtros de usuarios
const userFiltersSchema = z.object({
  role: role.optional(),
  searchTerm: z.string().optional(),
  sortBy: z.enum(["createdAt", "email", "role"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

// Validación para un Usuario completo
export function validateUsuario(input: Partial<Usuario>) {
  return usuarioSchema.safeParse(input);
}

// Validación para la creación de un usuario
export function validateUsuarioCreate(input: UsuarioCreate) {
  return usuarioCreateSchema.safeParse(input);
}

// Validación para la actualización de un usuario
export function validateUsuarioUpdate(input: UsuarioUpdate) {
  return usuarioUpdateSchema.safeParse(input);
}

// Validación para filtros de usuarios
export function validateUserFilters(input: UserFilters) {
  return userFiltersSchema.safeParse(input);
}
