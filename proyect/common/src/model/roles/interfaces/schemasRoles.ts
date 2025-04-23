import { z } from "zod";
import { Role, RoleNoId } from "../../../model/roles/interfaces/interfacesRoles";

export const roleSchema = z.object({
  idRole: z.number().optional(),
  role: z
    .string({
      required_error: "Rol es requerido",
      message: "Rol debe ser un string",
    })
    .trim()
    .min(1, { message: "El rol no puede estar vacío" }),
});

export function validateRole(input: Partial<Role>) {
  return roleSchema.safeParse(input);
}

export function validateRoleNoId(input: Partial<RoleNoId>) {
  const result = roleSchema.safeParse(input);

  if (!result.success)
    return { success: false, error: result.error.errors[0].message };

  return { success: true };
}
