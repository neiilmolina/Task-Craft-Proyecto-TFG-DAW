"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFutureDate = void 0;
const zod_1 = require("zod");
const polyfill_1 = require("@js-temporal/polyfill");
const validateFutureDate = (attributeName) => zod_1.z
    .string()
    .min(1, { message: `${attributeName} es requerido` }) // Rechaza strings vacíos
    .refine((value) => {
    try {
        // Detectamos si el string contiene información de hora o solo fecha
        if (value.includes("T")) {
            // Formato completo (fecha y hora)
            const temporalDate = polyfill_1.Temporal.PlainDateTime.from(value);
            const now = polyfill_1.Temporal.Now.plainDateTimeISO();
            return polyfill_1.Temporal.PlainDateTime.compare(temporalDate, now) > 0;
        }
        else {
            // Solo fecha (sin hora)
            const temporalDate = polyfill_1.Temporal.PlainDate.from(value);
            const today = polyfill_1.Temporal.Now.plainDateISO();
            return polyfill_1.Temporal.PlainDate.compare(temporalDate, today) > 0;
        }
    }
    catch (error) {
        // Si hay error al parsear, la fecha es inválida
        return false;
    }
}, {
    message: `${attributeName} debe ser una fecha futura válida`,
});
exports.validateFutureDate = validateFutureDate;
