import { z } from "zod";
import { Temporal } from "@js-temporal/polyfill";
import {
  TaskCreate,
  TaskUpdate,
} from "@/src/tasks/model/interfaces/interfacesTasks";
import { UUID_REGEX } from "@/src/core/constants";

// Constantes para los tipos de validación
const title = z.string().min(1, "El título es obligatorio");
const description = z.string().min(1, "La descripción es obligatoria");
const activityDate = z.string().refine((value) => {
  try {
    Temporal.PlainDateTime.from(value); // Intentar convertir el string a Temporal.PlainDateTime
    return true;
  } catch {
    return false;
  }
}, "activityDate debe ser una fecha válida en formato ISO, como '2025-04-11T10:00:00'");
const idState = z
  .number()
  .min(1, "El estado debe ser un número válido y mayor que 0");
const idType = z
  .number()
  .min(1, "El tipo debe ser un número válido y mayor que 0");
const idUser = z.string().refine((val) => UUID_REGEX.test(val), {
  message:
    "El ID del usuario debe ser un UUID válido, como 'bb89888b-2921-453f-b8c2-49dc2668595f'",
});

// Esquema para TaskCreate
export const TaskCreateSchema = z.object({
  title: title,
  description: description,
  activityDate: activityDate,
  idState: idState,
  idType: idType,
  idUser: idUser,
});

// Esquema para TaskUpdate
export const TaskUpdateSchema = z.object({
  title: title.optional(),
  description: description.optional(),
  activityDate: activityDate.optional(),
  idState: idState.optional(),
  idType: idType.optional(),
  idUser: idUser.optional(),
});

export const validateTaskCreate = (input: Partial<TaskCreate>) => {
  const result = TaskCreateSchema.safeParse(input);
  if (result.success) {
    return { success: true, input: result.data };
  } else {
    const errors = result.error.errors.map((err) => ({
      path: err.path.join("."),
      message: err.message,
    }));
    return { success: false, errors };
  }
};

// Método para validar los datos con safeParse en TaskUpdate
export const validateTaskUpdate = (input: Partial<TaskUpdate>) => {
  const result = TaskUpdateSchema.safeParse(input);
  if (result.success) {
    return { success: true, input: result.data };
  } else {
    return { success: false, errors: result.error.errors };
  }
};
