import { z } from "zod";
import { Temporal } from "@js-temporal/polyfill";
import {
  TaskCreate,
  TaskUpdate,
} from "@/src/tasks/model/interfaces/interfacesTasks";
import { UUID_REGEX } from "@/src/core/constants";

// Constantes para los tipos de validación
const title = z.string();
const description = z.string();
const activityDate = z.string().refine((value) => {
  try {
    Temporal.PlainDateTime.from(value); // Intentar convertir el string a Temporal.PlainDateTime
    return true;
  } catch {
    return false;
  }
}, "activityDate debe ser una fecha válida en formato ISO");
const idState = z.number();
const idType = z.number();
const idUser = z.string().refine((val) => UUID_REGEX.test(val), {
  message: "El ID del usuario debe ser un UUID válido",
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
    return { success: false, errors: result.error.errors };
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
