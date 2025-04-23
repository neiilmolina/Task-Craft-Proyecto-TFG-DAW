import { z } from "zod";
import { DiaryCreate, DiaryUpdate } from "@/src/model/diaries/interfaces/interfacesDiaries";
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
    activityDate: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    idUser: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    description?: string | undefined;
    activityDate?: string | undefined;
    idUser?: string | undefined;
}, {
    title?: string | undefined;
    description?: string | undefined;
    activityDate?: string | undefined;
    idUser?: string | undefined;
}>;
export declare const validateDiaryCreate: (input: Partial<DiaryCreate>) => {
    success: boolean;
    input: {
        title: string;
        description: string;
        activityDate: string;
        idUser: string;
    };
    errors?: undefined;
} | {
    success: boolean;
    errors: {
        path: string;
        message: string;
    }[];
    input?: undefined;
};
export declare const validateDiaryUpdate: (input: Partial<DiaryUpdate>) => {
    success: boolean;
    input: {
        title?: string | undefined;
        description?: string | undefined;
        activityDate?: string | undefined;
        idUser?: string | undefined;
    };
    errors?: undefined;
} | {
    success: boolean;
    errors: z.ZodIssue[];
    input?: undefined;
};
