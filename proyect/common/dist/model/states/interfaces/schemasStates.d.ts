import { z } from "zod";
import { State, StateNoId } from "./interfacesStates";
export declare function validateState(input: Partial<State>): import("../../../validations/formatMessages").FormatZodResult<z.ZodType<any, z.ZodTypeDef, any>>;
export declare function validateStateNoId(input: Partial<StateNoId>): import("../../../validations/formatMessages").FormatZodResult<z.ZodType<any, z.ZodTypeDef, any>>;
