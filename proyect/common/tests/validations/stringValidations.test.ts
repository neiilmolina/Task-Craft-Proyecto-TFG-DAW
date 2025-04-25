import { validateString } from "../../src/validations/stringValidations"; 

import { z } from "zod";

describe("validateString", () => {
  // Test 1: Validación exitosa
  it("debe aceptar un string dentro de los límites", () => {
    const validator = validateString("nombre", 3, 10);
    const result = validator.safeParse("Juan");
    expect(result.success).toBe(true);
  });

  // Test 2: String demasiado corto
  it("debe rechazar un string más corto que el mínimo", () => {
    const validator = validateString("nombre", 3);
    const result = validator.safeParse("Ju") as z.SafeParseError<string>;

    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe(
      "El campo nombre es obligatorio"
    );
  });

  // Test 3: String demasiado largo
  it("debe rechazar un string más largo que el máximo", () => {
    const validator = validateString("descripción", 1, 5);
    const result = validator.safeParse(
      "DemasiadoLargo"
    ) as z.SafeParseError<string>;

    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe(
      "El campo descripción no puede ser mayor a 5 caracteres"
    );
  });

  // Test 4: Valor no string
  it("debe rechazar valores que no son string", () => {
    const validator = validateString("edad", 1);
    const result = validator.safeParse(123) as z.SafeParseError<string>;

    expect(result.success).toBe(false);
    expect(result.error.issues[0].code).toBe("invalid_type");
  });

  // Test 5: Valor vacío
  it("debe rechazar strings vacíos cuando el mínimo es mayor a 0", () => {
    const validator = validateString("comentario", 1);
    const result = validator.safeParse("") as z.SafeParseError<string>;

    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe(
      "El campo comentario es obligatorio"
    );
  });

  // Test 6: Valor undefined
  it("debe rechazar undefined", () => {
    const validator = validateString("usuario", 1);
    const result = validator.safeParse(undefined) as z.SafeParseError<string>;

    expect(result.success).toBe(false);
    expect(result.error.issues[0].code).toBe("invalid_type");
  });

  // Test 7: Valor null
  it("debe rechazar null", () => {
    const validator = validateString("contraseña", 1);
    const result = validator.safeParse(null) as z.SafeParseError<string>;

    expect(result.success).toBe(false);
    expect(result.error.issues[0].code).toBe("invalid_type");
  });

  // Test 8: Mensaje personalizado con máximo por defecto
  it("debe usar el máximo por defecto de 10 caracteres", () => {
    const validator = validateString("código", 1);
    const validResult = validator.safeParse("1234567890"); // exactamente 10
    const invalidResult = validator.safeParse(
      "12345678901"
    ) as z.SafeParseError<string>; // 11

    expect(validResult.success).toBe(true);
    expect(invalidResult.success).toBe(false);
    expect(invalidResult.error.issues[0].message).toBe(
      "El campo código no puede ser mayor a 10 caracteres"
    );
  });
});
