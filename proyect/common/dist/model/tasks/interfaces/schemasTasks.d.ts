import { z } from "zod";
import { TaskCreate, TaskUpdate } from "../../../model/tasks/interfaces/interfacesTasks";
export declare const TaskCreateSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    activityDate: z.ZodEffects<z.ZodString, string, string>;
    idState: z.ZodNumber;
    idType: z.ZodNumber;
    idUser: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    description: string;
    activityDate: string;
    idUser: string;
    idState: number;
    idType: number;
}, {
    title: string;
    description: string;
    activityDate: string;
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
    description?: string | undefined;
    activityDate?: string | undefined;
    idUser?: string | undefined;
    idState?: number | undefined;
    idType?: number | undefined;
}, {
    title?: string | undefined;
    description?: string | undefined;
    activityDate?: string | undefined;
    idUser?: string | undefined;
    idState?: number | undefined;
    idType?: number | undefined;
}>;
export declare const validateTaskCreate: (input: Partial<TaskCreate>) => {
    success: boolean;
    input: {
        title: string;
        description: string;
        activityDate: string;
        idUser: string;
        idState: number;
        idType: number;
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
export declare const validateTaskUpdate: (input: Partial<TaskUpdate>) => {
    success: boolean;
    input: {
        title?: string | undefined;
        description?: string | undefined;
        activityDate?: string | undefined;
        idUser?: string | undefined;
        idState?: number | undefined;
        idType?: number | undefined;
    };
    errors?: undefined;
} | {
    success: boolean;
    errors: z.ZodIssue[];
    input?: undefined;
};
