export function fieldsWithEmptyStrings(
  data: object,
  excludeKeys: string[] = []
): boolean {
  return Object.entries(data)
    .filter(([key]) => !excludeKeys.includes(key))
    .every(([, valor]) => typeof valor === "string" && valor.trim() === "");
}

export function fieldsEqualZero(
  data: object,
  excludeKeys: string[] = []
): boolean {
  return Object.entries(data)
    .filter(([key]) => !excludeKeys.includes(key))
    .every(([, valor]) => typeof valor === "number" && valor === 0);
}

export function isAllEmptyOrZero(data: object, excludeKeys: string[] = []): boolean {
  return Object.entries(data)
    .filter(([key]) => !excludeKeys.includes(key))
    .every(([, value]) => {
      return (
        (typeof value === "string" && value.trim() === "") ||
        (typeof value === "number" && value === 0)
      );
    });
}

export function fieldsUndefined(
  data: object,
  excludeKeys: string[] = []
): boolean {
  return Object.entries(data)
    .filter(([key]) => !excludeKeys.includes(key))
    .every(([, value]) => value === undefined);
}
