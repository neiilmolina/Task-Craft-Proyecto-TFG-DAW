import { z } from "zod";
import {
  UsuarioCreate,
  UsuarioUpdate,
} from "@/src/usuarios/interfacesUsuarios";

export const usuarioCreateSchema = z.object({
  idUsuario: z
    .string()
    .uuid({ message: "El ID de usuario debe ser un UUID válido" }),
  nombre: z
    .string()
    .trim()
    .min(1, { message: "El nombre es requerido" })
    .optional(),
  email: z.string().email({ message: "Email inválido" }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
  urlImg: z.string().url({ message: "URL de imagen inválida" }).optional(),
  idRol: z.number().int().positive().optional(),
});

export const usuarioUpdateSchema = z.object({
  idUsuario: z
    .string()
    .uuid({ message: "El ID de usuario debe ser un UUID válido" }),
  nombreUsuario: z.string().trim().min(1, { message: "El nombre es requerido" }),
  email: z.string().email({ message: "Email inválido" }).optional(),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
    .optional(),
  urlImg: z.string().url({ message: "URL de imagen inválida" }).optional(),
  idRol: z.number().int().positive().optional(),
});

export function validateUsuarioCreate(input: Partial<UsuarioCreate>) {
  return usuarioCreateSchema.safeParse(input);
}

export function validateUsuarioUpdate(input: Partial<UsuarioUpdate>) {
  return usuarioUpdateSchema.safeParse(input);
}
