import { Temporal } from "@js-temporal/polyfill";

type getDatePhraseFromTemporalProps = {
  format?: Intl.LocalesArgument;
  date: Temporal.PlainDateTime;
};

export function getDatePhraseFromTemporal({
  format = "es-ES",
  date,
}: getDatePhraseFromTemporalProps): string {
  const { day, year } = date;

  const zonedDate = date.toZonedDateTime("UTC"); // Solo esto

  const nativeDate = new Date(zonedDate.epochMilliseconds);

  const formatter = new Intl.DateTimeFormat(format, { month: "long" });
  const month = formatter.format(nativeDate);

  return `${day} de ${month} de ${year}`;
}
