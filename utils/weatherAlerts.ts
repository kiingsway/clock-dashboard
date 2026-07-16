import { DateTime } from "luxon";
import type { SupportedLocale } from "../types/weather.types";

/**
 * Maps Environment Canada's `risk_colour_en` to an actual color. Falls back
 * to a neutral grey for anything unrecognized rather than guessing — an
 * alert with an odd/new colour name shouldn't silently render as red.
 */
export function getSeverityColor(riskColourEn: string): string {
  switch (riskColourEn?.trim().toLowerCase()) {
    case "red":
      return "#e5484d";
    case "orange":
      return "#f2994a";
    case "yellow":
      return "#f2c94c";
    case "green":
      return "#4caf72";
    case "grey":
    case "gray":
      return "#8b93a6";
    default:
      return "#8892a4";
  }
}

/**
 * "até 18:00" if `endTime` falls on the same day as `now`, otherwise
 * "até seg 18:00" — enough to tell at a glance whether an alert wraps
 * into tomorrow without a full date.
 */
export function formatAlertUntil(
  endTime: string,
  now: DateTime,
  locale: SupportedLocale,
  timeZone?: string
): string {
  const end = DateTime.fromISO(endTime, { zone: timeZone });
  const current = now.setZone(timeZone);

  const sameDay = end.hasSame(current, "day");

  const time = end.toFormat("HH:mm");

  return sameDay
    ? time
    : `${end.setLocale(locale).toFormat("ccc")} ${time}`;
}