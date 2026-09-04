import { DateTime } from "luxon";

/**
 * Formats a duration in seconds into a human-readable string.
 *
 * Output rules:
 * - Under 60s: shows seconds (e.g., "12s")
 * - Under 1h: shows minutes and remaining seconds (e.g., "1m 12s")
 * - 1h or more: shows hours and remaining minutes (e.g., "1h 12m")
 *
 * @param totalSeconds - The duration in seconds to format
 * @returns A formatted string representation of the duration
 */
export function formatDuration(totalSeconds: number): string {
  if (totalSeconds < 60) return `${totalSeconds}s`;

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  if (hours === 0) return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;

  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}

interface FormatDateTimeOptions {
  date: Date | string | number;
  language: string; // Ex: 'pt', 'en', 'fr', 'es', 'ko' ou vindo do i18n.language
  timezone?: string; // Ex: 'America/Toronto', 'Asia/Seoul'
}

export function formatDateTime({ date, language, timezone }: FormatDateTimeOptions): string {
  const d = new Date(date);

  return new Intl.DateTimeFormat(language, {
    dateStyle: "medium", // 'full' | 'long' | 'medium' | 'short'
    timeStyle: "short",  // 'full' | 'long' | 'medium' | 'short'
    timeZone: timezone,
  }).format(d);
}

type D = DateTime<boolean> | undefined

/**
 * Returns the progress of `now` between two dates, from 0 to 1.
 *
 * @param dateBefore - The start date of the interval.
 * @param dateAfter - The end date of the interval.
 * @param now - The date used to calculate the current progress.
 * @returns A value from 0 to 1, where 0 is the start and 1 is the end.
 */
export function getProgressBetweenDates(dateBefore: D, dateAfter: D, now: DateTime) {
  if (!dateBefore?.isValid || !dateAfter?.isValid) return 0;

  if (now.toMillis() >= dateAfter.toMillis()) return 1;
  if (now.toMillis() <= dateBefore.toMillis()) return 0;

  const elapsed = now.diff(dateBefore, "milliseconds").milliseconds;
  const duration = dateAfter.diff(dateBefore, "milliseconds").milliseconds;

  return elapsed / duration;
}

export const isValidDateTime = (date: DateTime | undefined): date is DateTime<true> => Boolean(date?.isValid);
