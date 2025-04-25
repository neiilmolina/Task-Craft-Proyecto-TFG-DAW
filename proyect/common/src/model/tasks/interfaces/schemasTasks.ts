import { z } from "zod";
import { Temporal } from "@js-temporal/polyfill";
import { TaskCreate, TaskUpdate } from "./interfacesTasks";
import { validateFutureDate } from "../../../validations/dateValidations";
import { validateString } from "../../../validations/stringValidations";
import { formatZodMessages } from "../../../validations/formatMessages";

// Constantes para los tipos de validación
const title = validateString("titulo", 1);
const description = validateString("descripción", 1, 50);
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
  activityDate: validateFutureDate("fecha"),
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
  return formatZodMessages(result);
};

// Método para validar los datos con safeParse en TaskUpdate
export const validateTaskUpdate = (input: Partial<TaskUpdate>) => {
  const result = TaskUpdateSchema.safeParse(input);
  return formatZodMessages(result);
};
