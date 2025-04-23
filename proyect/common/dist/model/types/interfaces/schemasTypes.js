"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTypeCreate = validateTypeCreate;
exports.validateTypeUpdate = validateTypeUpdate;
const zod_1 = require("zod");
const typeSchema = zod_1.z.object({
    idType: zod_1.z.number(),
    type: zod_1.z.string({
        required_error: "Tipo es requerido",
        message: "Tipo debe ser un string",
    }),
    color: zod_1.z.string().regex(/^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {
        message: "Color debe ser un valor hexadecimal válido ",
    }),
    idUser: zod_1.z.string(),
});
const typeCreateSchema = typeSchema.omit({ idType: true });
const typeUpdateSchema = typeSchema.partial(); // Permite actualizar solo algunos campos
function validateTypeCreate(input) {
    const result = typeCreateSchema.safeParse(input);
    if (!result.success)
        return { success: false, error: result.error.errors[0].message };
    return { success: true };
}
function validateTypeUpdate(input) {
    const result = typeUpdateSchema.safeParse(input);
    if (!result.success)
        return { success: false, error: result.error.errors[0].message }; // Mensaje del primer error
    return { success: true };
}
