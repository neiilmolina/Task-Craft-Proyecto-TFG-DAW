import { z, ZodType, type SafeParseReturnType } from "zod";
export type FormattedError = {
    field: string;
    message: string;
    code: string;
};
export type FormatZodResult<TSchema extends ZodType<any, any, any>> = {
    success: true;
    data: z.infer<TSchema>;
} | {
    success: false;
    errors: FormattedError[];
};
export declare function formatZodMessages<TSchema extends z.ZodType<any>>(result: SafeParseReturnType<any, any>): FormatZodResult<TSchema>;
