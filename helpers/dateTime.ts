export type DayPart = "dawn" | "day" | "dusk" | "night";

/**
 * Formats a Date as a 24-hour "HH:mm" clock string.
 */
export function formatClock(date: Date): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function formatSmartDate(input: string | Date): string {
  const date = input instanceof Date ? input : new Date(input);

  const now = new Date();
  const isSameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const pad = (n: number) => String(n).padStart(2, "0");

  const hhmm = `${pad(date.getHours())}:${pad(date.getMinutes())}`;

  if (isSameDay) {
    return hhmm;
  }

  const ddmmyyyy = `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
  return `${ddmmyyyy} ${hhmm}`;
}


/**
 * Formats a Date as "weekday, day de month", using the browser locale
 * and deliberately omitting the year.
 */
export function formatDateNoYear(date: Date, locale?: string): { weekday: string, date: string } {
  const resolvedLocale = locale ?? navigator.language;
  const weekday = new Intl.DateTimeFormat(resolvedLocale, {
    weekday: "long",
  }).format(date);

  const d = new Intl.DateTimeFormat(resolvedLocale, {
    day: "numeric",
    month: "long",
  }).format(date);

  return { weekday, date: d };
}

/**
 * Formats an ISO hour string ("2026-07-09T14:00") as a short "HH:mm" label
 * for hourly forecast cards.
 */
export function formatHourLabel(isoTime: string, locale?: string): string {
  const resolvedLocale = locale ?? navigator.language;
  return new Intl.DateTimeFormat(resolvedLocale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(isoTime));
}

/**
 * Formats an ISO date string ("2026-07-09") as a short weekday label
 * ("qui", "Mon"...) for daily forecast cards.
 */
export function formatDayLabel(isoDate: string, locale?: string): string {
  const resolvedLocale = locale ?? navigator.language;
  return new Intl.DateTimeFormat(resolvedLocale, {
    weekday: "short",
  }).format(new Date(isoDate));
}

/**
 * Determines which hour the hourly forecast should start from, given the
 * current time. Minutes below 40 keep the current hour ("13:39" → starts
 * at 13h); 40 or above rolls over to the next hour ("13:40" → starts at
 * 14h).
 */
export function getHourlyStartThreshold(now: Date): Date {
  const threshold = new Date(now);
  threshold.setMinutes(0, 0, 0);

  if (now.getMinutes() >= 40) {
    threshold.setHours(threshold.getHours() + 1);
  }

  return threshold;
}

/**
 * Buckets a given hour (0-23) into a broad part of the day. Drives the
 * dashboard's ambient background — purely presentational, not meant to
 * reflect actual sunrise/sunset times.
 */
export function getDayPart(hour: number): DayPart {
  if (hour >= 5 && hour < 8) return "dawn";
  if (hour >= 8 && hour < 17) return "day";
  if (hour >= 17 && hour < 20) return "dusk";
  return "night";
}
