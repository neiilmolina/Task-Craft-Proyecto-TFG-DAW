"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTaskFilters = exports.validateTaskUpdate = exports.validateTaskCreate = exports.TaskFiltersSchema = exports.TaskUpdateSchema = exports.TaskCreateSchema = void 0;
const zod_1 = require("zod");
const dateValidations_1 = require("../../../validations/dateValidations");
const stringValidations_1 = require("../../../validations/stringValidations");
const formatMessages_1 = require("../../../validations/formatMessages");
// Constantes para los tipos de validación
const title = (0, stringValidations_1.validateString)("titulo", 1);
const description = (0, stringValidations_1.validateString)("descripción", 1, 50);
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
    activityDate: (0, dateValidations_1.validateFutureDate)("fecha"),
    idState: idState,
    idType: idType,
    idUser: idUser,
});
// Esquema para TaskUpdate
exports.TaskUpdateSchema = zod_1.z.object({
    title: title.optional(),
    description: description.optional(),
    activityDate: (0, dateValidations_1.validateFutureDate)("fecha").optional(),
    idState: idState.optional(),
    idType: idType.optional(),
    idUser: idUser.optional(),
});
exports.TaskFiltersSchema = zod_1.z.object({
    idUser: idUser.optional(),
    stateString: (0, stringValidations_1.validateString)("estado", 1).optional(),
    typeString: (0, stringValidations_1.validateString)("tipo", 1).optional(),
    title: title.optional(),
    pastDate: (0, dateValidations_1.validatePastDate)("fecha pasada").optional(),
    futureDate: (0, dateValidations_1.validateFutureDate)("fecha futura").optional(),
});
const validateTaskCreate = (input) => {
    const result = exports.TaskCreateSchema.safeParse(input);
    return (0, formatMessages_1.formatZodMessages)(result);
};
exports.validateTaskCreate = validateTaskCreate;
// Método para validar los datos con safeParse en TaskUpdate
const validateTaskUpdate = (input) => {
    const result = exports.TaskUpdateSchema.safeParse(input);
    return (0, formatMessages_1.formatZodMessages)(result);
};
exports.validateTaskUpdate = validateTaskUpdate;
const validateTaskFilters = (input) => {
    const result = exports.TaskFiltersSchema.safeParse(input);
    return (0, formatMessages_1.formatZodMessages)(result);
};
exports.validateTaskFilters = validateTaskFilters;
