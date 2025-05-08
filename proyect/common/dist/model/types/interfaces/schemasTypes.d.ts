import { z } from "zod";
import { TypeCreate, TypeUpdate } from "./interfacesTypes";
export declare function validateTypeCreate(input: Partial<TypeCreate>): import("../../../validations/formatMessages").FormatZodResult<z.ZodType<any, z.ZodTypeDef, any>>;
export declare function validateTypeUpdate(input: Partial<TypeUpdate>): import("../../../validations/formatMessages").FormatZodResult<z.ZodType<any, z.ZodTypeDef, any>>;
