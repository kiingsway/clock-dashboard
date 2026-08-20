import { DateTime } from "luxon";

/**
 * Hour label for the hourly strip ("14h" / "2 PM").
 * Uses Luxon to preserve the provided IANA timezone.
 */
export function getLocaleHour(date: DateTime, locale: string): string {
  const hour24 = date.hour;

  const lang = locale.split("-")[0];

  switch (lang) {
    case "pt":
      return `${hour24}h`;

    case "fr":
      return `${hour24} h`;

    case "es":
      return `${hour24}:00`;

    case "ko": {
      const period = hour24 < 12 ? "오전" : "오후";
      const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
      return `${period} ${hour12}시`;
    }

    case "en":
    default: {
      const period = hour24 < 12 ? "AM" : "PM";
      const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
      return `${hour12} ${period}`;
    }
  }
}

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
  const seconds = totalSeconds % 60;

  if (hours === 0) return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;

  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}