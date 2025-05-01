import { z } from "zod";
import { Temporal } from "@js-temporal/polyfill";

export const validateFutureDate = (attributeName: string) =>
  z
    .string()
    .min(1, { message: `${attributeName} es requerido` }) // Rechaza strings vacíos
    .refine(
      (value) => {
        try {
          // Detectamos si el string contiene información de hora o solo fecha
          if (value.includes("T")) {
            // Formato completo (fecha y hora)
            const temporalDate = Temporal.PlainDateTime.from(value);
            const now = Temporal.Now.plainDateTimeISO();
            return Temporal.PlainDateTime.compare(temporalDate, now) > 0;
          } else {
            // Solo fecha (sin hora)
            const temporalDate = Temporal.PlainDate.from(value);
            const today = Temporal.Now.plainDateISO();
            return Temporal.PlainDate.compare(temporalDate, today) > 0;
          }
        } catch (error) {
          // Si hay error al parsear, la fecha es inválida
          return false;
        }
      },
      {
        message: `${attributeName} debe ser una fecha futura válida`,
      }
    );
export const validatePastDate = (attributeName: string) =>
  z
    .string()
    .min(1, { message: `${attributeName} es requerido` }) // Rechaza strings vacíos
    .refine(
      (value) => {
        try {
          // Detectamos si el string contiene información de hora o solo fecha
          if (value.includes("T")) {
            // Formato completo (fecha y hora)
            const temporalDate = Temporal.PlainDateTime.from(value);
            const now = Temporal.Now.plainDateTimeISO();
            return Temporal.PlainDateTime.compare(temporalDate, now) < 0;
          } else {
            // Solo fecha (sin hora)
            const temporalDate = Temporal.PlainDate.from(value);
            const today = Temporal.Now.plainDateISO();
            return Temporal.PlainDate.compare(temporalDate, today) < 0;
          }
        } catch (error) {
          // Si hay error al parsear, la fecha es inválida
          return false;
        }
      },
      {
        message: `${attributeName} debe ser una fecha pasada válida`,
      }
    );

export const validateDateFormat = (attributeName: string) =>
  z
    .string()
    .min(1, { message: `${attributeName} es requerido` })
    .refine(
      (value) => {
        try {
          // Detectar si incluye tiempo o solo fecha
          if (value.includes("T")) {
            Temporal.PlainDateTime.from(value); // Lanza error si es inválido
          } else {
            Temporal.PlainDate.from(value);
          }
          return true;
        } catch {
          return false;
        }
      },
      {
        message: `${attributeName} debe tener un formato de fecha válido`,
      }
    );
