import { z } from "zod";
import { UserCreate, UserUpdate } from "./interfacesUsers";
import { formatZodMessages } from "../../../validations/formatMessages";

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
  const result = userCreateSchema.safeParse(input);
  return formatZodMessages(result);
}

export function validateUserUpdate(input: Partial<UserUpdate>) {
  const result = userUpdateSchema.safeParse(input);
  return formatZodMessages(result);
}

export function validatePassword(input: string) {
  const result = passwordSchema.safeParse(input);
  return formatZodMessages(result);
}
