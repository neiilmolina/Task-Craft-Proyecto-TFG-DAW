import { z } from "zod";
import {
  Diary,
  DiaryCreate,
  DiaryFilters,
  DiaryUpdate,
} from "./interfacesDiaries";
import {
  validateDateFormat,
  validateFutureDate,
  validatePastDate,
} from "../../../validations/dateValidations";
import { validateString } from "../../../validations/stringValidations";
import { formatZodMessages } from "../../../validations/formatMessages";

// Constantes para los tipos de validación
const title = validateString("title", 1);
const description = validateString("descripcion", 1, 300);
const activityDate = validateDateFormat("fecha");

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
  idUser: idUser.optional(),
});

export const DiaryFiltersSchema = z.object({
  idUser: idUser.optional(),
  title: title.optional(),
  pastDate: validatePastDate("fecha pasada").optional(),
  futureDate: validateFutureDate("fecha futura").optional(),
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

export const validateDiaryFilters = (input: Partial<DiaryFilters>) => {
  const result = DiaryFiltersSchema.safeParse(input);
  return formatZodMessages(result);
};
