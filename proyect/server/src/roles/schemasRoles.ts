import { z } from "zod";
import { Rol, RolNoId } from "@/src/roles/interfacesRoles";

const rolSchema = z.object({
  idRol: z.number().optional(),
  rol: z
    .string({
      required_error: "Rol es requerido",
      message: "Rol debe ser un string",
    })
    .trim()
    .min(1, { message: "El rol no puede estar vacío" }),
});

export function validateRol(input: Partial<Rol>) {
  return rolSchema.safeParse(input);
}

export function validateRolNoId(input: Partial<RolNoId>) {
  const result = rolSchema.safeParse(input);

  if (!result.success)
    return { success: false, error: result.error.errors[0].message };

  return { success: true };
}
