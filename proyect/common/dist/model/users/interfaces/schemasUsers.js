"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userUpdateSchema = exports.userCreateSchema = void 0;
exports.validateUserCreate = validateUserCreate;
exports.validateUserUpdate = validateUserUpdate;
exports.validatePassword = validatePassword;
const zod_1 = require("zod");
const formatMessages_1 = require("../../../validations/formatMessages");
const passwordSchema = zod_1.z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" });
const userName = zod_1.z
    .string()
    .trim()
    .min(1, { message: "El nombre es requerido" });
const email = zod_1.z.string().email({ message: "Email inválido" });
const urlImg = zod_1.z.string().url({ message: "URL de imagen inválida" }).optional();
const idRol = zod_1.z.number().int().positive().optional();
exports.userCreateSchema = zod_1.z.object({
    // idUsuario: z
    //   .string()
    //   .uuid({ message: "El ID de usuario debe ser un UUID válido" }),
    userName: userName.optional(),
    password: passwordSchema,
    email: email,
    urlImg: urlImg,
    idRol: idRol,
});
exports.userUpdateSchema = zod_1.z.object({
    userName: userName.optional(),
    email: email,
    urlImg: urlImg,
    idRol: idRol,
});
function validateUserCreate(input) {
    const result = exports.userCreateSchema.safeParse(input);
    return (0, formatMessages_1.formatZodMessages)(result);
}
function validateUserUpdate(input) {
    const result = exports.userUpdateSchema.safeParse(input);
    return (0, formatMessages_1.formatZodMessages)(result);
}
function validatePassword(input) {
    const result = passwordSchema.safeParse(input);
    return (0, formatMessages_1.formatZodMessages)(result);
}
