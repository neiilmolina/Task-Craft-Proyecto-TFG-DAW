import { Temporal } from "@js-temporal/polyfill";

export function formatDate(date: string | Date): Temporal.PlainDateTime {
  let dateFormatted;

  if (date instanceof Date) {
    const isoString = date.toISOString().replace("Z", "");
    dateFormatted = Temporal.PlainDateTime.from(isoString);
  } else if (typeof date === "string") {
    dateFormatted = Temporal.PlainDateTime.from(date.replace(" ", "T"));
  } else {
    throw new Error("❌ Tipo de fecha inesperado: " + typeof date);
  }

  return dateFormatted;
}
