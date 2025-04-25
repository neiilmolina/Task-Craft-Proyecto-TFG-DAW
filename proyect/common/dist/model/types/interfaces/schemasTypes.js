"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTypeCreate = validateTypeCreate;
exports.validateTypeUpdate = validateTypeUpdate;
const zod_1 = require("zod");
const stringValidations_1 = require("../../../validations/stringValidations");
const formatMessages_1 = require("../../../validations/formatMessages");
const typeSchema = zod_1.z.object({
    idType: zod_1.z.number(),
    type: (0, stringValidations_1.validateString)("tipo", 1, 10),
    color: zod_1.z.string().regex(/^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {
        message: "Color debe ser un valor hexadecimal válido ",
    }),
    idUser: zod_1.z.string(),
});
const typeCreateSchema = typeSchema.omit({ idType: true });
const typeUpdateSchema = typeSchema.partial(); // Permite actualizar solo algunos campos
function validateTypeCreate(input) {
    const result = typeCreateSchema.safeParse(input);
    return (0, formatMessages_1.formatZodMessages)(result);
}
function validateTypeUpdate(input) {
    const result = typeUpdateSchema.safeParse(input);
    return (0, formatMessages_1.formatZodMessages)(result);
}
