// src/estados/schemasEstados.ts
import { z } from "zod";
import { State, StateNoId } from "./interfacesStates";
import { validateString } from "../../../validations/stringValidations";
import { formatZodMessages } from "../../../validations/formatMessages";

const statechema = z.object({
  idState: z.number().optional(), // Changed from id to idState and made it optional
  state: validateString("estado", 1),
});

// For validating a complete Estado object (with idState)
export function validateState(input: Partial<State>) {
  const result = statechema.safeParse(input);
  return formatZodMessages(result);
}

// For validating just the state field (without idState)
export function validateStateNoId(input: Partial<StateNoId>) {
  const result = statechema.omit({ idState: true }).safeParse(input);
  return formatZodMessages(result);
}
