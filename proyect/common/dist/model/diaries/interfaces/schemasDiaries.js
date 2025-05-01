"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDiaryFilters = exports.validateDiaryUpdate = exports.validateDiaryCreate = exports.DiaryFiltersSchema = exports.DiaryUpdateSchema = exports.DiaryCreateSchema = void 0;
const zod_1 = require("zod");
const dateValidations_1 = require("../../../validations/dateValidations");
const stringValidations_1 = require("../../../validations/stringValidations");
const formatMessages_1 = require("../../../validations/formatMessages");
// Constantes para los tipos de validación
const title = (0, stringValidations_1.validateString)("title", 1, 10);
const description = (0, stringValidations_1.validateString)("descripcion", 1, 300);
const activityDate = (0, dateValidations_1.validateFutureDate)("fecha");
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
    activityDate: (0, dateValidations_1.validateFutureDate)("fecha").optional(),
    idUser: idUser.optional(),
});
exports.DiaryFiltersSchema = zod_1.z.object({
    idUser: idUser.optional(),
    title: title.optional(),
    pastDate: (0, dateValidations_1.validatePastDate)("fecha pasada").optional(),
    futureDate: (0, dateValidations_1.validateFutureDate)("fecha futura").optional(),
});
const validateDiaryCreate = (input) => {
    const result = exports.DiaryCreateSchema.safeParse(input);
    return (0, formatMessages_1.formatZodMessages)(result);
};
exports.validateDiaryCreate = validateDiaryCreate;
// Método para validar los datos con safeParse en DiaryUpdate
const validateDiaryUpdate = (input) => {
    const result = exports.DiaryUpdateSchema.safeParse(input);
    return (0, formatMessages_1.formatZodMessages)(result);
};
exports.validateDiaryUpdate = validateDiaryUpdate;
const validateDiaryFilters = (input) => {
    const result = exports.DiaryFiltersSchema.safeParse(input);
    return (0, formatMessages_1.formatZodMessages)(result);
};
exports.validateDiaryFilters = validateDiaryFilters;
