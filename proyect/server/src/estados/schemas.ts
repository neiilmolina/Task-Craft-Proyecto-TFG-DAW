import { z } from "zod";
import { Estado } from "@/src/estados/interfaces";

const estadoSchema = z.object({
  id: z.number(),
  nome: z.string({
    required_error: "Estado es requerido",
    message: "Estado debe ser un string",
  }),
});

export function validateEstado(input: Estado) {
  return estadoSchema.safeParse(input);
}

export function validatePartialEstado(input: Estado) {
  return estadoSchema.partial().safeParse(input);
}
