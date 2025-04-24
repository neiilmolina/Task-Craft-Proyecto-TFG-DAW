import { validateFutureDate } from "../../src/validations/dateValidations"; // Ajusta la ruta según tu estructura
import { z } from "zod";
import { Temporal } from "@js-temporal/polyfill"; // Asegúrate de importar Temporal correctamente

// Mock para la fecha actual
const mockNow = jest.spyOn(Temporal.Now, "plainDateTimeISO");

describe("validateFutureDate", () => {
  const TestSchema = z.object({
    date: validateFutureDate("Fecha de actividad"),
  });

  beforeEach(() => {
    // Establecemos una fecha fija para las pruebas: 24 de abril de 2025 a las 12:00:00
    mockNow.mockReturnValue(Temporal.PlainDateTime.from("2025-04-24T12:00:00"));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should accept a future date", () => {
    // Fecha futura: 1 de mayo de 2025
    const result = TestSchema.safeParse({
      date: "2025-05-01T10:00:00",
    });

    expect(result.success).toBe(true);
  });

  it("should reject a past date", () => {
    // Fecha pasada: 11 de abril de 2025
    const result = TestSchema.safeParse({
      date: "2025-04-11T10:00:00",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain(
        "debe ser una fecha futura válida"
      );
    }
  });

  it("should reject today's date", () => {
    // Fecha actual: 24 de abril de 2025
    const result = TestSchema.safeParse({
      date: "2025-04-24T10:00:00",
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
    // Mock para PlainDate
    const mockPlainDateNow = jest.spyOn(Temporal.Now, "plainDateISO");
    mockPlainDateNow.mockReturnValue(Temporal.PlainDate.from("2025-04-24"));

    // Fecha futura sin componente de hora
    const futureResult = TestSchema.safeParse({
      date: "2025-05-01",
    });
    expect(futureResult.success).toBe(true);

    // Fecha pasada sin componente de hora
    const pastResult = TestSchema.safeParse({
      date: "2025-04-10",
    });
    expect(pastResult.success).toBe(false);

    mockPlainDateNow.mockRestore();
  });

  it("should log comparison values for debugging", () => {
    // Espía para console.log
    const consoleSpy = jest.spyOn(console, "log");

    TestSchema.safeParse({
      date: "2025-04-11T10:00:00",
    });

    // Verificar que se están registrando valores de depuración
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
