// src/estados/schemasEstados.ts
import { z } from "zod";
import { Estado, EstadoNoId } from "@/src/estados/interfacesEstados";

const estadoSchema = z.object({
  idEstado: z.number().optional(), // Changed from id to idEstado and made it optional
  estado: z.string({
    required_error: "Estado es requerido",
    message: "Estado debe ser un string",
  }),
});

// For validating a complete Estado object (with idEstado)
export function validateEstado(input: Partial<Estado>) {
  return estadoSchema.safeParse(input);
}

// For validating just the estado field (without idEstado)
export function validateEstadoNoId(input: Partial<EstadoNoId>) {
  return estadoSchema.omit({ idEstado: true }).safeParse(input);
}
