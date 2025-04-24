import { z } from "zod";
import { Role, RoleNoId } from "./interfacesRoles";
import { validateString } from "@/src/validations/stringValidations";

export const roleSchema = z.object({
  idRole: z.number().optional(),
  role: validateString("rol", 1),
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
