import { z } from "zod";
import { TypeCreate, TypeUpdate } from "./interfacesTypes";
import { validateString } from "../../../validations/stringValidations";
import { formatZodMessages } from "../../../validations/formatMessages";

const typeSchema = z.object({
  idType: z.number(),
  type: validateString("tipo", 1, 10),
  color: z.string().regex(/^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {
    message: "Color debe ser un valor hexadecimal válido ",
  }),
  idUser: z.string(),
});

const typeCreateSchema = typeSchema.omit({ idType: true });

const typeUpdateSchema = typeSchema.partial(); // Permite actualizar solo algunos campos

export function validateTypeCreate(input: Partial<TypeCreate>) {
  const result = typeCreateSchema.safeParse(input);
  return formatZodMessages(result);
}

export function validateTypeUpdate(input: Partial<TypeUpdate>) {
  const result = typeUpdateSchema.safeParse(input);
  return formatZodMessages(result);
}
