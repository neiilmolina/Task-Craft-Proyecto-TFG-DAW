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
export declare function validateUserCreate(input: Partial<UserCreate>): {
    success: false;
    errors: {
        field: string;
        message: string;
        code: string;
    }[];
} | {
    success: true;
    data: any;
};
export declare function validateUserUpdate(input: Partial<UserUpdate>): {
    success: false;
    errors: {
        field: string;
        message: string;
        code: string;
    }[];
} | {
    success: true;
    data: any;
};
export declare function validatePassword(input: string): {
    success: false;
    errors: {
        field: string;
        message: string;
        code: string;
    }[];
} | {
    success: true;
    data: any;
};
