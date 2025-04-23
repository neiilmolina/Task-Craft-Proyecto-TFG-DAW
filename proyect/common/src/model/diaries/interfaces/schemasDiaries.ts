import { z } from "zod";
import { Temporal } from "@js-temporal/polyfill";
import { DiaryCreate, DiaryUpdate } from "@/src/model/diaries/interfaces/interfacesDiaries";

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
}, "activityDate debe ser una fecha válida en formato ISO");

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
  activityDate: activityDate.optional(),
  idUser: idUser.optional(),
});

export const validateDiaryCreate = (input: Partial<DiaryCreate>) => {
  const result = DiaryCreateSchema.safeParse(input);
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

// Método para validar los datos con safeParse en DiaryUpdate
export const validateDiaryUpdate = (input: Partial<DiaryUpdate>) => {
  const result = DiaryUpdateSchema.safeParse(input);
  if (result.success) {
    return { success: true, input: result.data };
  } else {
    return { success: false, errors: result.error.errors };
  }
};
