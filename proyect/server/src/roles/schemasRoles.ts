import { z } from "zod";
import { Rol, RolNoId } from "@/src/roles/interfacesRoles";

const rolSchema = z.object({
  idRol: z.number().optional(),
  rol: z.string({
    required_error: "Rol es requerido",
    message: "Rol debe ser un string",
  }),
});

export function validateRol(input: Partial<Rol>) {
  return rolSchema.safeParse(input);
}

export function validateRolNoId(input: Partial<RolNoId>) {
  return rolSchema.omit({ idRol: true }).safeParse(input);
}
