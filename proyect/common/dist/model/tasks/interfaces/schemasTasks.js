"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTaskUpdate = exports.validateTaskCreate = exports.TaskUpdateSchema = exports.TaskCreateSchema = void 0;
const zod_1 = require("zod");
const polyfill_1 = require("@js-temporal/polyfill");
// Constantes para los tipos de validación
const title = zod_1.z.string().min(1, "El título es obligatorio");
const description = zod_1.z.string().min(1, "La descripción es obligatoria");
const activityDate = zod_1.z.string().refine((value) => {
    try {
        polyfill_1.Temporal.PlainDateTime.from(value); // Intentar convertir el string a Temporal.PlainDateTime
        return true;
    }
    catch {
        return false;
    }
}, "activityDate debe ser una fecha válida en formato ISO, como '2025-04-11T10:00:00'");
const idState = zod_1.z
    .number()
    .min(1, "El estado debe ser un número válido y mayor que 0");
const idType = zod_1.z
    .number()
    .min(1, "El tipo debe ser un número válido y mayor que 0");
const idUser = zod_1.z.string().uuid();
// Esquema para TaskCreate
exports.TaskCreateSchema = zod_1.z.object({
    title: title,
    description: description,
    activityDate: activityDate,
    idState: idState,
    idType: idType,
    idUser: idUser,
});
// Esquema para TaskUpdate
exports.TaskUpdateSchema = zod_1.z.object({
    title: title.optional(),
    description: description.optional(),
    activityDate: activityDate.optional(),
    idState: idState.optional(),
    idType: idType.optional(),
    idUser: idUser.optional(),
});
const validateTaskCreate = (input) => {
    const result = exports.TaskCreateSchema.safeParse(input);
    if (result.success) {
        return { success: true, input: result.data };
    }
    else {
        const errors = result.error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
        }));
        return { success: false, errors };
    }
};
exports.validateTaskCreate = validateTaskCreate;
// Método para validar los datos con safeParse en TaskUpdate
const validateTaskUpdate = (input) => {
    const result = exports.TaskUpdateSchema.safeParse(input);
    if (result.success) {
        return { success: true, input: result.data };
    }
    else {
        return { success: false, errors: result.error.errors };
    }
};
exports.validateTaskUpdate = validateTaskUpdate;
