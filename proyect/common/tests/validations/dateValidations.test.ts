import { validateFutureDate } from "../../src/validations/dateValidations";
import { z } from "zod";
import { Temporal } from "@js-temporal/polyfill";

const mockNow = jest.spyOn(Temporal.Now, "plainDateTimeISO");

describe("validateFutureDate", () => {
  const TestSchema = z.object({
    date: validateFutureDate("Fecha de actividad"),
  });

  beforeEach(() => {
    mockNow.mockReturnValue(Temporal.PlainDateTime.from("2025-04-24T12:00:00"));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should accept a future date", () => {
    const date = Temporal.Now.plainDateISO().add({ days: 1 }).toString();
    const result = TestSchema.safeParse({
      date: date,
    });

    expect(result.success).toBe(true);
  });

  it("should reject a past date", () => {
    const date = Temporal.Now.plainDateISO().subtract({ days: 1 }).toString();

    const result = TestSchema.safeParse({
      date: date,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain(
        "debe ser una fecha futura válida"
      );
    }
  });

  it("should reject today's date", () => {
    const date = Temporal.Now.plainDateISO().toString();

    const result = TestSchema.safeParse({
      date: date,
    });

    expect(result.success).toBe(false);
  });

  it("should reject an empty string", () => {
    const result = TestSchema.safeParse({
      date: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain("es requerido");
    }
  });

  it("should reject an invalid date format", () => {
    const result = TestSchema.safeParse({
      date: "not-a-date",
    });

    expect(result.success).toBe(false);
  });

  it("should handle dates without time component", () => {
    const mockPlainDateNow = jest.spyOn(Temporal.Now, "plainDateISO");
    mockPlainDateNow.mockReturnValue(Temporal.PlainDate.from("2025-04-24"));

    const futureResult = TestSchema.safeParse({
      date: "2025-05-01",
    });
    expect(futureResult.success).toBe(true);

    const pastResult = TestSchema.safeParse({
      date: "2025-04-10",
    });
    expect(pastResult.success).toBe(false);

    mockPlainDateNow.mockRestore();
  });

  it("should log comparison values for debugging", () => {
    const consoleSpy = jest.spyOn(console, "log");

    TestSchema.safeParse({
      date: "2025-04-11T10:00:00",
    });

    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
