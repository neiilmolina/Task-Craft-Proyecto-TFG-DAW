// src/estados/schemasEstados.ts
import { z } from "zod";
import { State, StateNoId } from "./interfacesStates";
import { validateString } from "@/src/validations/stringValidations";

const statechema = z.object({
  idState: z.number().optional(), // Changed from id to idState and made it optional
  state: validateString("estado", 1),
});

// For validating a complete Estado object (with idState)
export function validateState(input: Partial<State>) {
  return statechema.safeParse(input);
}

// For validating just the state field (without idState)
export function validateStateNoId(input: Partial<StateNoId>) {
  return statechema.omit({ idState: true }).safeParse(input);
}
