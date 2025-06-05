/* eslint-disable @typescript-eslint/no-explicit-any */
export default function buildChangedFields(
  original: any,
  updated: any,
  keys: string[]
) {
  return keys.reduce((acc, key) => {
    if (original[key] !== updated[key]) {
      acc[key] = updated[key];
    }
    return acc;
  }, {} as Record<string, any>);
}
