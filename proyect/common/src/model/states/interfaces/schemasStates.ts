// src/estados/schemasEstados.ts
import { z } from "zod";
import {
  State,
  StateNoId,
} from "./interfacesStates";

const statechema = z.object({
  idState: z.number().optional(), // Changed from id to idState and made it optional
  state: z.string({
    required_error: "Estado es requerido",
    message: "Estado debe ser un string",
  }),
});

// For validating a complete Estado object (with idState)
export function validateState(input: Partial<State>) {
  return statechema.safeParse(input);
}

// For validating just the state field (without idState)
export function validateStateNoId(input: Partial<StateNoId>) {
  return statechema.omit({ idState: true }).safeParse(input);
}
