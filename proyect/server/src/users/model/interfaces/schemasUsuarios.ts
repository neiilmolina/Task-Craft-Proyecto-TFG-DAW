import { z } from "zod";
import {
  UsuarioCreate,
  UsuarioUpdate,
} from "@/src/users/model/interfaces/interfacesUsers";

const passwordSchema = z
  .string()
  .min(6, { message: "La contraseña debe tener al menos 6 caracteres" });

export const usuarioCreateSchema = z.object({
  // idUsuario: z
  //   .string()
  //   .uuid({ message: "El ID de usuario debe ser un UUID válido" }),
  nombre: z
    .string()
    .trim()
    .min(1, { message: "El nombre es requerido" })
    .optional(),
  email: z.string().email({ message: "Email inválido" }),
  password: passwordSchema,
  urlImg: z.string().url({ message: "URL de imagen inválida" }).optional(),
  idRol: z.number().int().positive().optional(),
});

export const usuarioUpdateSchema = z.object({
  nombreUsuario: z
    .string()
    .trim()
    .min(1, { message: "El nombre es requerido" }),
  email: z.string().email({ message: "Email inválido" }).optional(),
  urlImg: z.string().url({ message: "URL de imagen inválida" }).optional(),
  idRol: z.number().int().positive().optional(),
});

export function validateUsuarioCreate(input: Partial<UsuarioCreate>) {
  return usuarioCreateSchema.safeParse(input);
}

export function validateUsuarioUpdate(input: Partial<UsuarioUpdate>) {
  return usuarioUpdateSchema.safeParse(input);
}

export function validatePassword(input: string) {
  return passwordSchema.safeParse(input);
}
