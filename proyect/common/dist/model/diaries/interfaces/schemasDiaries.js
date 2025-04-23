"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDiaryUpdate = exports.validateDiaryCreate = exports.DiaryUpdateSchema = exports.DiaryCreateSchema = void 0;
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
}, "activityDate debe ser una fecha válida en formato ISO");
const idUser = zod_1.z.string().uuid();
// Esquema para DiaryCreate
exports.DiaryCreateSchema = zod_1.z.object({
    title: title,
    description: description,
    activityDate: activityDate,
    idUser: idUser,
});
// Esquema para DiaryUpdate
exports.DiaryUpdateSchema = zod_1.z.object({
    title: title.optional(),
    description: description.optional(),
    activityDate: activityDate.optional(),
    idUser: idUser.optional(),
});
const validateDiaryCreate = (input) => {
    const result = exports.DiaryCreateSchema.safeParse(input);
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
exports.validateDiaryCreate = validateDiaryCreate;
// Método para validar los datos con safeParse en DiaryUpdate
const validateDiaryUpdate = (input) => {
    const result = exports.DiaryUpdateSchema.safeParse(input);
    if (result.success) {
        return { success: true, input: result.data };
    }
    else {
        return { success: false, errors: result.error.errors };
    }
};
exports.validateDiaryUpdate = validateDiaryUpdate;
