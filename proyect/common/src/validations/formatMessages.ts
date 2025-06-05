import { z, ZodType, type SafeParseReturnType } from "zod";

export type FormattedError = {
  field: string;
  message: string;
  code: string;
};

export type FormatZodResult<TSchema extends ZodType<any, any, any>> =
  | { success: true; data: z.infer<TSchema> }
  | { success: false; errors: FormattedError[] };

export function formatZodMessages<TSchema extends z.ZodType<any>>(
  result: SafeParseReturnType<any, any>
): FormatZodResult<TSchema> {
  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  const errors = result.error.errors.map((issue) => ({
    field: issue.path.join(".") || "root",
    message: issue.message,
    code: issue.code,
  }));

  return {
    success: false,
    errors,
  };
}
