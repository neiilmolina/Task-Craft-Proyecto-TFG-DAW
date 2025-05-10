import { FormattedError } from "task-craft-models";

export default function filterErrors(
  errors: FormattedError[],
  field: string
): FormattedError[] {
  return errors.filter(
    (error) => error.code !== "invalid_type" && error.field === field
  );
}
