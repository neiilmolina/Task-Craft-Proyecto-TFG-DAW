import { z } from "zod";

export const validateString = (
  atributeName: string,
  minLenght: number,
  maxLength: number = 10
) =>
  z
    .string()
    .min(minLenght, `El campo ${atributeName} es obligatorio`)
    .max(maxLength, "t");
