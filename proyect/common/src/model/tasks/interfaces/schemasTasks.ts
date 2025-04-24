import { z } from "zod";
import { Temporal } from "@js-temporal/polyfill";
import { TaskCreate, TaskUpdate } from "./interfacesTasks";
import { validateFutureDate } from "../../../validations/dateValidations";
import { validateString } from "@/src/validations/stringValidations";

// Constantes para los tipos de validación
const title = validateString("titulo", 1);
const description = validateString("descripción", 1, 20);
const activityDate = validateFutureDate("fecha");
const idState = z
  .number()
  .min(1, "El estado debe ser un número válido y mayor que 0");
const idType = z
  .number()
  .min(1, "El tipo debe ser un número válido y mayor que 0");
const idUser = z.string().uuid();
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
  activityDate: validateFutureDate("fecha").optional(),
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
