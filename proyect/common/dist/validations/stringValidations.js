"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateString = validateString;
const zod_1 = require("zod");
function validateString(atributeName, minLenght, maxLength = 20) {
    return zod_1.z
        .string()
        .min(minLenght, `El campo ${atributeName} es obligatorio`)
        .max(maxLength, `El campo ${atributeName} no puede ser mayor a ${maxLength} caracteres`);
}
