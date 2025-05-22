import { z } from "zod";
import { DiaryCreate, DiaryFilters, DiaryUpdate } from "./interfacesDiaries";
export declare const DiaryCreateSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    activityDate: z.ZodEffects<z.ZodString, string, string>;
    idUser: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    description: string;
    activityDate: string;
    idUser: string;
}, {
    title: string;
    description: string;
    activityDate: string;
    idUser: string;
}>;
export declare const DiaryUpdateSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    idUser: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    description?: string | undefined;
    idUser?: string | undefined;
}, {
    title?: string | undefined;
    description?: string | undefined;
    idUser?: string | undefined;
}>;
export declare const DiaryFiltersSchema: z.ZodObject<{
    idUser: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    pastDate: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    futureDate: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    idUser?: string | undefined;
    pastDate?: string | undefined;
    futureDate?: string | undefined;
}, {
    title?: string | undefined;
    idUser?: string | undefined;
    pastDate?: string | undefined;
    futureDate?: string | undefined;
}>;
export declare const validateDiaryCreate: (input: Partial<DiaryCreate>) => import("../../../validations/formatMessages").FormatZodResult<z.ZodType<any, z.ZodTypeDef, any>>;
export declare const validateDiaryUpdate: (input: Partial<DiaryUpdate>) => import("../../../validations/formatMessages").FormatZodResult<z.ZodType<any, z.ZodTypeDef, any>>;
export declare const validateDiaryFilters: (input: Partial<DiaryFilters>) => import("../../../validations/formatMessages").FormatZodResult<z.ZodType<any, z.ZodTypeDef, any>>;
