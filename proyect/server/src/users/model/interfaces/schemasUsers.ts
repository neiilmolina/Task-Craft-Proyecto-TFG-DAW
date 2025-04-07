import { z } from "zod";
import {
  UserCreate,
  UserUpdate,
} from "@/src/users/model/interfaces/interfacesUsers";

const passwordSchema = z
  .string()
  .min(6, { message: "La contraseña debe tener al menos 6 caracteres" });

const userName = z
  .string()
  .trim()
  .min(1, { message: "El nombre es requerido" });

const email = z.string().email({ message: "Email inválido" });
const urlImg = z.string().url({ message: "URL de imagen inválida" }).optional();
const idRol = z.number().int().positive().optional();

export const userCreateSchema = z.object({
  // idUsuario: z
  //   .string()
  //   .uuid({ message: "El ID de usuario debe ser un UUID válido" }),
  userName: userName.optional(),
  password: passwordSchema,
  email: email,
  urlImg: urlImg,
  idRol: idRol,
});

export const userUpdateSchema = z.object({
  userName: userName.optional(),
  email: email,
  urlImg: urlImg,
  idRol: idRol,
});

export function validateUserCreate(input: Partial<UserCreate>) {
  return userCreateSchema.safeParse(input);
}

export function validateUserUpdate(input: Partial<UserUpdate>) {
  return userUpdateSchema.safeParse(input);
}

export function validatePassword(input: string) {
  return passwordSchema.safeParse(input);
}
