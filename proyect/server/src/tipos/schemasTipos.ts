import { z } from "zod";
import { TipoCreate, TipoUpdate } from "./interfacesTipos";

const tipoSchema = z.object({
  idTipo: z.number(),
  tipo: z.string({
    required_error: "Estado es requerido",
    message: "Estado debe ser un string",
  }),
  color: z.string().regex(/^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {
    message: "Color debe ser un valor hexadecimal válido ",
  }),
  idUsuario: z.string(),
});

export function validateTipoCreate(input: Partial<TipoCreate>) {
  const result = tipoSchema.safeParse(input);

  if (!result.success)
    return { success: false, error: result.error.errors[0].message }; // Mensaje del primer error

  return { success: true };
}
export function validateTipoUpdate(input: Partial<TipoUpdate>) {
  const result = tipoSchema.safeParse(input);

  if (!result.success)
    return { success: false, error: result.error.errors[0].message }; // Mensaje del primer error

  return { success: true };
}
