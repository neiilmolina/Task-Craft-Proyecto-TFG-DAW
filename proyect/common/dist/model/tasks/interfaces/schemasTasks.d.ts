import { z } from "zod";
import { TaskCreate, TaskUpdate } from "./interfacesTasks";
export declare const TaskCreateSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    activityDate: z.ZodEffects<z.ZodString, string, string>;
    idState: z.ZodNumber;
    idType: z.ZodNumber;
    idUser: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    activityDate: string;
    description: string;
    idUser: string;
    idState: number;
    idType: number;
}, {
    title: string;
    activityDate: string;
    description: string;
    idUser: string;
    idState: number;
    idType: number;
}>;
export declare const TaskUpdateSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    activityDate: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    idState: z.ZodOptional<z.ZodNumber>;
    idType: z.ZodOptional<z.ZodNumber>;
    idUser: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    activityDate?: string | undefined;
    description?: string | undefined;
    idUser?: string | undefined;
    idState?: number | undefined;
    idType?: number | undefined;
}, {
    title?: string | undefined;
    activityDate?: string | undefined;
    description?: string | undefined;
    idUser?: string | undefined;
    idState?: number | undefined;
    idType?: number | undefined;
}>;
export declare const validateTaskCreate: (input: Partial<TaskCreate>) => {
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
export declare const validateTaskUpdate: (input: Partial<TaskUpdate>) => {
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
