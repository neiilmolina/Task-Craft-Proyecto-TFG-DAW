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
