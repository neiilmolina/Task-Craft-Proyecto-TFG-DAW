// src/usuarios/schemasUsuarios.ts
import { z } from "zod";
import {
  Usuario,
  UsuarioCreate,
  UsuarioUpdate,
  UserFilters,
} from "@/src/usuarios/interfacesUsuarios";

// Esquema para un Usuario completo (con todos los campos)
const usuarioSchema = z.object({
  id: z.string().uuid().optional(), // UUID opcional
  email: z.string().email("El email debe ser válido").optional(),
  firstName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .optional(),
  lastName: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .optional(),
  role: z.string().min(1, "El rol es requerido"), // Rol requerido
  createdAt: z.string().optional(), // Puede ser un string con formato de fecha
  updatedAt: z.string().optional(), // Lo mismo para updatedAt
});

// Esquema para la creación de un usuario (sin el ID ni timestamps)
const usuarioCreateSchema = z.object({
  email: z.string().email("El email debe ser válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  firstName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .optional(),
  lastName: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .optional(),
  role: z.string().min(1, "El rol es requerido").optional(),
});

// Esquema para actualizar la información de un usuario (todos los campos son opcionales)
const usuarioUpdateSchema = z.object({
  firstName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .optional(),
  lastName: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .optional(),
  role: z.string().min(1, "El rol es requerido").optional(),
  email: z.string().email("El email debe ser válido").optional(),
});

// Esquema para filtros de usuarios (con validación de parámetros)
const userFiltersSchema = z.object({
  role: z.string().optional(),
  searchTerm: z.string().optional(),
  sortBy: z.enum(["createdAt", "email", "role"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).optional(), // Página mínima de 1
  limit: z.number().min(1).max(100).optional(), // Límite entre 1 y 100
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
