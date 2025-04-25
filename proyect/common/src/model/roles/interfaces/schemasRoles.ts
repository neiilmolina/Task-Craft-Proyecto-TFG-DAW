import { z } from "zod";
import { Role, RoleNoId } from "./interfacesRoles";
import { validateString } from "../../../validations/stringValidations";
import { formatZodMessages } from "../../../validations/formatMessages";

export const roleSchema = z.object({
  idRole: z.number().optional(),
  role: validateString("rol", 1),
});

export function validateRole(input: Partial<Role>) {
  const result = roleSchema.safeParse(input);
  return formatZodMessages(result);
}

export function validateRoleNoId(input: Partial<RoleNoId>) {
  const result = roleSchema.safeParse(input);
  return formatZodMessages(result);
}
