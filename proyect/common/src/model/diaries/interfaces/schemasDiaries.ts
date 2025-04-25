import { z } from "zod";
import { Temporal } from "@js-temporal/polyfill";
import { DiaryCreate, DiaryUpdate } from "./interfacesDiaries";
import { validateFutureDate } from "../../../validations/dateValidations";
import { validateString } from "../../../validations/stringValidations";
import { formatZodMessages } from "../../../validations/formatMessages";

// Constantes para los tipos de validación
const title = validateString("title", 1, 10);
const description = validateString("descripcion", 1, 300);
const activityDate = validateFutureDate("activityDate");

const idUser = z.string().uuid();

// Esquema para DiaryCreate
export const DiaryCreateSchema = z.object({
  title: title,
  description: description,
  activityDate: activityDate,
  idUser: idUser,
});

// Esquema para DiaryUpdate
export const DiaryUpdateSchema = z.object({
  title: title.optional(),
  description: description.optional(),
  activityDate: validateFutureDate("activityDate").optional(),
  idUser: idUser.optional(),
});

export const validateDiaryCreate = (input: Partial<DiaryCreate>) => {
  const result = DiaryCreateSchema.safeParse(input);
  return formatZodMessages(result);
};

// Método para validar los datos con safeParse en DiaryUpdate
export const validateDiaryUpdate = (input: Partial<DiaryUpdate>) => {
  const result = DiaryUpdateSchema.safeParse(input);
  return formatZodMessages(result);
};
