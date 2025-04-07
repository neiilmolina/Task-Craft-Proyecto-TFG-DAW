import { z } from "zod";
import { Temporal } from "@js-temporal/polyfill";
import { TaskCreate, TaskUpdate } from "@/src/tasks/model/interfaces/interfacesTasks";

// Constantes para los tipos de validación
const title = z.string();
const description = z.string();
const activityDate = z.instanceof(Temporal.PlainDateTime);
const idState = z.number();
const idType = z.number();
const idUser = z.string();

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

export const validateTaskCreateSchema = (input: Partial<TaskCreate>) => {
  const result = TaskCreateSchema.safeParse(input);
  if (result.success) {
    return { success: true, input: result.data };
  } else {
    return { success: false, errors: result.error.errors };
  }
};

// Método para validar los datos con safeParse en TaskUpdate
export const validateTaskUpdateSchema = (input: Partial<TaskUpdate>) => {
  const result = TaskUpdateSchema.safeParse(input);
  if (result.success) {
    return { success: true, input: result.data };
  } else {
    return { success: false, errors: result.error.errors };
  }
};
