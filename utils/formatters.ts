import { SupportedLocale } from "@/types2/weather.types";

/**
 * Formats a 24h HH:mm clock string in a given IANA timezone.
 * Deliberately not using Intl's hour12 flag here — HH:mm should always read
 * as a 24h station clock regardless of locale, per the brief.
 */
export function formatClockTime(date: Date, timeZone?: string): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
  }).formatToParts(date);

  const hour = parts.find((p) => p.type === "hour")?.value ?? "00";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "00";
  return `${hour}:${minute}`;
}

/** "10 de julho" (pt-BR) or "July 10" (en-US) — no year, locale-native ordering. */
export function formatLongDate(date: Date, locale: SupportedLocale, timeZone?: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    timeZone,
  }).format(date);
}

/** Full weekday name, capitalized ("Sexta-feira" / "Friday"). */
export function formatWeekdayLong(date: Date, locale: SupportedLocale, timeZone?: string): string {
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "long", timeZone }).format(date);
  return capitalize(weekday);
}

/** Short weekday name for compact rows ("qui" / "Thu"). */
export function formatWeekdayShort(date: Date, locale: SupportedLocale, timeZone?: string): string {
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "short", timeZone }).format(date);
  return capitalize(weekday.replace(".", ""));
}

/**
 * Hour label for the hourly strip ("14h" / "2 PM"). Built manually rather
 * than left to `Intl`'s locale defaults, whose "h" suffix for pt-BR varies
 * across ICU/browser versions — this keeps the output consistent everywhere.
 */
export function formatHourLabel(date: Date, locale: SupportedLocale, timeZone?: string): string {
  const hour24 = Number(
    new Intl.DateTimeFormat("en-GB", { hour: "2-digit", hour12: false, timeZone }).format(date)
  );

  if (locale === "pt-BR") {
    return `${String(hour24).padStart(2, "0")}h`;
  }

  const period = hour24 < 12 ? "AM" : "PM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12} ${period}`;
}

/** "Agora" / "Now" label used on the first hourly card when it matches the current hour. */
export function isSameHour(a: Date, b: Date, timeZone?: string): boolean {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
    timeZone,
  });
  return fmt.format(a) === fmt.format(b);
}

/**
 * Rough day/night guess for hourly entries, which the API doesn't tag with
 * `is_day` the way `current` does. 6h–18h counts as day. Good enough for
 * picking a clear-sky icon variant; not meant to be astronomically precise.
 */
export function inferIsDayFromHour(date: Date, timeZone?: string): boolean {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", { hour: "2-digit", hour12: false, timeZone }).format(date)
  );
  return hour >= 6 && hour < 18;
}

export function isDaytimeBySunrises(
  date: Date,
  sunrises: string[],
  sunsets: string[]
): boolean {
  const targetYear = date.getFullYear();
  const targetMonth = date.getMonth();
  const targetDay = date.getDate();

  const index = sunrises.findIndex((sunrise) => {
    const d = new Date(sunrise);

    return (
      d.getFullYear() === targetYear &&
      d.getMonth() === targetMonth &&
      d.getDate() === targetDay
    );
  });

  if (index === -1) {
    // Não encontrou dados para esse dia.
    // Escolha o comportamento desejado.
    return true;
  }

  const sunrise = new Date(sunrises[index]);
  const sunset = new Date(sunsets[index]);

  return date >= sunrise && date < sunset;
}

/**
 * How far `current.time` sits between sunrise and sunset, clamped to
 * [0, 1]. Used to place the marker on the sunrise→sunset track. Pinned to
 * 0 or 1 outside daylight hours rather than extrapolated, since "how far
 * past sunset" isn't a meaningful position on a track that represents the
 * daylight span.
 */
export function getSunProgress(currentTime: string, sunrise: string, sunset: string): number {
  const now = new Date(currentTime).getTime();
  const rise = new Date(sunrise).getTime();
  const set = new Date(sunset).getTime();
  if (set <= rise) return 0;
  return Math.min(1, Math.max(0, (now - rise) / (set - rise)));
}

function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toLocaleUpperCase() + text.slice(1);
}