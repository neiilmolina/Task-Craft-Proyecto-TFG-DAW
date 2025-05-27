import { z } from "zod";
import { UserCreate, UserUpdate } from "./interfacesUsers";
export declare const userCreateSchema: z.ZodObject<{
    userName: z.ZodOptional<z.ZodString>;
    password: z.ZodString;
    email: z.ZodString;
    urlImg: z.ZodOptional<z.ZodString>;
    idRol: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    password: string;
    email: string;
    userName?: string | undefined;
    urlImg?: string | undefined;
    idRol?: number | undefined;
}, {
    password: string;
    email: string;
    userName?: string | undefined;
    urlImg?: string | undefined;
    idRol?: number | undefined;
}>;
export declare const userUpdateSchema: z.ZodObject<{
    userName: z.ZodOptional<z.ZodString>;
    email: z.ZodString;
    urlImg: z.ZodOptional<z.ZodString>;
    idRol: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    email: string;
    userName?: string | undefined;
    urlImg?: string | undefined;
    idRol?: number | undefined;
}, {
    email: string;
    userName?: string | undefined;
    urlImg?: string | undefined;
    idRol?: number | undefined;
}>;
export declare const userFilterSchema: z.ZodObject<{
    idRol: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    stringSearch: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    idRol?: number | undefined;
    stringSearch?: string | undefined;
}, {
    idRol?: number | undefined;
    stringSearch?: string | undefined;
}>;
export declare function validateUserCreate(input: Partial<UserCreate>): import("../../../validations/formatMessages").FormatZodResult<z.ZodType<any, z.ZodTypeDef, any>>;
export declare function validateUserUpdate(input: Partial<UserUpdate>): import("../../../validations/formatMessages").FormatZodResult<z.ZodType<any, z.ZodTypeDef, any>>;
export declare function validateUserFilterSchema(input: Partial<UserUpdate>): import("../../../validations/formatMessages").FormatZodResult<z.ZodType<any, z.ZodTypeDef, any>>;
export declare function validatePassword(input: string): import("../../../validations/formatMessages").FormatZodResult<z.ZodType<any, z.ZodTypeDef, any>>;
