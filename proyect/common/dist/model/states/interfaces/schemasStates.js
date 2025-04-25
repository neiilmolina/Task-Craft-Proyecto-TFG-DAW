"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateState = validateState;
exports.validateStateNoId = validateStateNoId;
// src/estados/schemasEstados.ts
const zod_1 = require("zod");
const stringValidations_1 = require("../../../validations/stringValidations");
const formatMessages_1 = require("../../../validations/formatMessages");
const statechema = zod_1.z.object({
    idState: zod_1.z.number().optional(), // Changed from id to idState and made it optional
    state: (0, stringValidations_1.validateString)("estado", 1),
});
// For validating a complete Estado object (with idState)
function validateState(input) {
    const result = statechema.safeParse(input);
    return (0, formatMessages_1.formatZodMessages)(result);
}
// For validating just the state field (without idState)
function validateStateNoId(input) {
    const result = statechema.omit({ idState: true }).safeParse(input);
    return (0, formatMessages_1.formatZodMessages)(result);
}
