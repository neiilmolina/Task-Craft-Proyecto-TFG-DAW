import { formatZodMessages } from "../../src/validations/formatMessages";
import { z, type SafeParseReturnType } from "zod";

describe("formatZodMessages", () => {
  const testSchema = z.object({
    name: z.string().min(3),
    age: z.number().min(18),
  });

  it("should return success with data for valid input", () => {
    const validInput = { name: "John", age: 25 };
    const result = testSchema.safeParse(validInput);
    const formatted = formatZodMessages<typeof testSchema>(result);

    expect(formatted).toEqual({
      success: true,
      data: validInput,
    });
  });

  it("should return formatted errors for invalid input", () => {
    const invalidInput = { name: "Jo", age: 15 };
    const result = testSchema.safeParse(invalidInput);
    const formatted = formatZodMessages<typeof testSchema>(result);

    expect(formatted).toEqual({
      success: false,
      errors: [
        {
          field: "name",
          message: "String must contain at least 3 character(s)",
          code: "too_small",
        },
        {
          field: "age",
          message: "Number must be greater than or equal to 18",
          code: "too_small",
        },
      ],
    });
  });

  it("should handle nested fields", () => {
    const nestedSchema = z.object({
      user: z.object({
        profile: z.object({
          firstName: z.string().min(2),
        }),
      }),
    });

    const result = nestedSchema.safeParse({
      user: { profile: { firstName: "" } },
    });
    const formatted = formatZodMessages<typeof nestedSchema>(result);

    expect(formatted).toEqual({
      success: false,
      errors: [
        {
          field: "user.profile.firstName",
          message: "String must contain at least 2 character(s)",
          code: "too_small",
        },
      ],
    });
  });

  it("should handle root-level errors", () => {
    const schema = z.string();
    const result = schema.safeParse(123);
    const formatted = formatZodMessages<typeof schema>(result);

    expect(formatted).toEqual({
      success: false,
      errors: [
        {
          field: "root",
          message: "Expected string, received number",
          code: "invalid_type",
        },
      ],
    });
  });
});
