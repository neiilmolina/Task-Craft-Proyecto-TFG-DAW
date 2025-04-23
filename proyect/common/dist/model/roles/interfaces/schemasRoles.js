"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleSchema = void 0;
exports.validateRole = validateRole;
exports.validateRoleNoId = validateRoleNoId;
const zod_1 = require("zod");
exports.roleSchema = zod_1.z.object({
    idRole: zod_1.z.number().optional(),
    role: zod_1.z
        .string({
        required_error: "Rol es requerido",
        message: "Rol debe ser un string",
    })
        .trim()
        .min(1, { message: "El rol no puede estar vacío" }),
});
function validateRole(input) {
    return exports.roleSchema.safeParse(input);
}
function validateRoleNoId(input) {
    const result = exports.roleSchema.safeParse(input);
    if (!result.success)
        return { success: false, error: result.error.errors[0].message };
    return { success: true };
}
