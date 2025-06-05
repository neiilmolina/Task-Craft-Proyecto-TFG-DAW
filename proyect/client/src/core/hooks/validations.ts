/* eslint-disable @typescript-eslint/no-explicit-any */

import { FormattedError } from "task-craft-models";

export function filterErrors(
  errors: FormattedError[],
  field: string
): FormattedError[] {
  return errors.filter(
    (error) => error.code !== "invalid_type" && error.field === field
  );
}

export function checkAllEmptyFields(obj: Record<string, any>): boolean {
  return Object.values(obj).every(
    (value) => typeof value === "string" && value.trim() === ""
  );
}
