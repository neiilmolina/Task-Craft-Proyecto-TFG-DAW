import { z } from "zod";
export declare const validateFutureDate: (attributeName: string) => z.ZodEffects<z.ZodString, string, string>;
export declare const validatePastDate: (attributeName: string) => z.ZodEffects<z.ZodString, string, string>;
export declare const validateDateFormat: (attributeName: string) => z.ZodEffects<z.ZodString, string, string>;
