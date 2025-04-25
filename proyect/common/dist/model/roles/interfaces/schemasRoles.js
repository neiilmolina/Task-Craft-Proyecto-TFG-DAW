"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleSchema = void 0;
exports.validateRole = validateRole;
exports.validateRoleNoId = validateRoleNoId;
const zod_1 = require("zod");
const stringValidations_1 = require("../../../validations/stringValidations");
const formatMessages_1 = require("../../../validations/formatMessages");
exports.roleSchema = zod_1.z.object({
    idRole: zod_1.z.number().optional(),
    role: (0, stringValidations_1.validateString)("rol", 1),
});
function validateRole(input) {
    const result = exports.roleSchema.safeParse(input);
    return (0, formatMessages_1.formatZodMessages)(result);
}
function validateRoleNoId(input) {
    const result = exports.roleSchema.safeParse(input);
    return (0, formatMessages_1.formatZodMessages)(result);
}
