"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateState = validateState;
exports.validateStateNoId = validateStateNoId;
// src/estados/schemasEstados.ts
const zod_1 = require("zod");
const statechema = zod_1.z.object({
    idState: zod_1.z.number().optional(), // Changed from id to idState and made it optional
    state: zod_1.z.string({
        required_error: "Estado es requerido",
        message: "Estado debe ser un string",
    }),
});
// For validating a complete Estado object (with idState)
function validateState(input) {
    return statechema.safeParse(input);
}
// For validating just the state field (without idState)
function validateStateNoId(input) {
    return statechema.omit({ idState: true }).safeParse(input);
}
