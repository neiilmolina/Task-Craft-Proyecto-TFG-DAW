import { z } from "zod";
import { DiaryCreate, DiaryUpdate } from "./interfacesDiaries";
export declare const DiaryCreateSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    activityDate: z.ZodEffects<z.ZodString, string, string>;
    idUser: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    activityDate: string;
    description: string;
    idUser: string;
}, {
    title: string;
    activityDate: string;
    description: string;
    idUser: string;
}>;
export declare const DiaryUpdateSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    activityDate: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    idUser: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    activityDate?: string | undefined;
    description?: string | undefined;
    idUser?: string | undefined;
}, {
    title?: string | undefined;
    activityDate?: string | undefined;
    description?: string | undefined;
    idUser?: string | undefined;
}>;
export declare const validateDiaryCreate: (input: Partial<DiaryCreate>) => {
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
export declare const validateDiaryUpdate: (input: Partial<DiaryUpdate>) => {
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
