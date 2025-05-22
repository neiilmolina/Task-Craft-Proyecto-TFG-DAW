import { Temporal } from "@js-temporal/polyfill";

type getDatePhraseFromTemporalProps = {
  format?: Intl.LocalesArgument;
  date: Temporal.PlainDate;
};

export function getDatePhraseFromTemporal({
  format = "es-ES",
  date,
}: getDatePhraseFromTemporalProps): string {
  const { day, year } = date;

  const zonedDate = date.toZonedDateTime({
    timeZone: "UTC",
    plainTime: Temporal.PlainTime.from("00:00"),
  });

  const nativeDate = new Date(zonedDate.epochMilliseconds);

  const formatter = new Intl.DateTimeFormat(format, { month: "long" });
  const month = formatter.format(nativeDate);

  return `${day} de ${month} de ${year}`;
}
