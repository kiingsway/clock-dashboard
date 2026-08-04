import { DateTime } from "luxon";

/**
 * Hour label for the hourly strip ("14h" / "2 PM").
 * Uses Luxon to preserve the provided IANA timezone.
 */
export function formatHourLabel(date: DateTime, locale: string): string {
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