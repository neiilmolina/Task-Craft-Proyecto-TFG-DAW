import { Temporal } from "@js-temporal/polyfill";

export function formatDate(date: string | Date): Temporal.PlainDateTime {
  if (date instanceof Date) {
    // Convertimos la fecha a Instant (UTC)
    const instant = Temporal.Instant.from(date.toISOString());
    // La convertimos a ZonedDateTime en Europe/Madrid
    const zonedDateTime = instant.toZonedDateTimeISO("Europe/Madrid");
    // Extraemos PlainDateTime (sin zona horaria pero ya con la hora local correcta)
    return zonedDateTime.toPlainDateTime();
  } else if (typeof date === "string") {
    // Si es string, asumimos que ya viene local o en ISO sin Z
    return Temporal.PlainDateTime.from(date.replace(" ", "T"));
  } else {
    throw new Error("❌ Tipo de fecha inesperado: " + typeof date);
  }
}

