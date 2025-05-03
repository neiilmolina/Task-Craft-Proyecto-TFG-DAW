import { z } from "zod";

export function validateString(
  atributeName: string,
  minLenght: number,
  maxLength: number = 20
) {
  return z
    .string()
    .min(minLenght, `El campo ${atributeName} es obligatorio`)
    .max(
      maxLength,
      `El campo ${atributeName} no puede ser mayor a ${maxLength} caracteres`
    );
}
