import { SupportedLocale } from "@/types/weather.types";

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
export function formatLongDate(date: Date, locale: string, timeZone?: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    timeZone,
  }).format(date);
}

/** Full weekday name, capitalized ("Sexta-feira" / "Friday"). */
export function formatWeekdayLong(date: Date, locale: string, timeZone?: string): string {
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "long", timeZone }).format(date);
  return capitalize(weekday);
}

/** Short weekday name for compact rows ("qui" / "Thu"). */
export function formatWeekdayShort(date: Date, locale: string, timeZone?: string): string {
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "short", timeZone }).format(date);
  return capitalize(weekday.replace(".", ""));
}

/**
 * Hour label for the hourly strip ("14h" / "2 PM"). Built manually rather
 * than left to `Intl`'s locale defaults, whose "h" suffix for pt-BR varies
 * across ICU/browser versions — this keeps the output consistent everywhere.
 */
export function formatHourLabel(date: Date, locale: string, timeZone?: string): string {
  const hour24 = Number(
    new Intl.DateTimeFormat("en-GB", { hour: "2-digit", hour12: false, timeZone }).format(date)
  );

  // Normaliza o locale caso venha com região (ex: "pt-BR" -> "pt")
  const lang = locale.split('-')[0];

  switch (lang) {
    case 'pt':
      return `${hour24}h`;

    case 'fr':
      return `${hour24} h`;

    case 'es':
      return `${hour24}:00`; // Espanhol geralmente usa o formato 24h completo

    case 'ko': {
      const period = hour24 < 12 ? "오전" : "오후";
      const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
      return `${period} ${hour12}시`;
    }

    case 'en':
    default: {
      const period = hour24 < 12 ? "AM" : "PM";
      const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
      return `${hour12} ${period}`;
    }
  }
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

export interface SunWindow {
  start: Date;
  end: Date;
  startKind: "sunrise" | "sunset";
  endKind: "sunrise" | "sunset";
  /** 0–1 position of `currentTime` between `start` and `end`. */
  progress: number;
}

/**
 * Works out which stretch of the sun cycle "now" is in, and how far through
 * it we are — so the track always shows a *forward* span:
 *  - during the day: sunrise → today's sunset
 *  - during the night: sunset → tomorrow's sunrise
 *  - in the early hours before today's sunrise: last night's sunset → today's sunrise
 *
 * `sunriseTimes` / `sunsetTimes` only need today's entry to work; a second
 * entry (tomorrow) makes the after-sunset case exact instead of a ±24h
 * estimate, and there's no equivalent "yesterday" entry available from the
 * API, so the before-sunrise case always estimates from today's sunset.
 */
export function getSunWindow(currentTime: string, sunriseTimes: string[], sunsetTimes: string[]): SunWindow {
  const DAY_MS = 86_400_000;
  const now = new Date(currentTime).getTime();
  // const now = new Date(currentTime).getTime() - 2 * 60 * 60 * 1000;
  const todaySunrise = new Date(sunriseTimes[0]).getTime();
  const todaySunset = new Date(sunsetTimes[0]).getTime();

  if (now < todaySunrise) {
    // Still dark before today's sunrise — no "yesterday" entry is available,
    // so last night's sunset is estimated as 24h before today's sunset.
    return buildSunWindow(now, todaySunset - DAY_MS, todaySunrise, "sunset", "sunrise");
  }

  if (now <= todaySunset) {
    return buildSunWindow(now, todaySunrise, todaySunset, "sunrise", "sunset");
  }

  const tomorrowSunrise = sunriseTimes.length > 1 ? new Date(sunriseTimes[1]).getTime() : todaySunrise + DAY_MS;
  return buildSunWindow(now, todaySunset, tomorrowSunrise, "sunset", "sunrise");
}

function buildSunWindow(
  now: number,
  start: number,
  end: number,
  startKind: "sunrise" | "sunset",
  endKind: "sunrise" | "sunset"
): SunWindow {
  const progress = end <= start ? 0 : Math.min(1, Math.max(0, (now - start) / (end - start)));
  return { start: new Date(start), end: new Date(end), startKind, endKind, progress };
}

function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toLocaleUpperCase() + text.slice(1);
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

export function formatIsoTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();

  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const pad = (num: number): string => String(num).padStart(2, '0');

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  if (isToday) {
    return `${hours}:${minutes}`;
  }

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export const APP_INFO = {
  version: process.env.NEXT_PUBLIC_APP_VERSION!,
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",
};