import { DateTime } from "luxon";

/**
 * "até 18:00" if `endTime` falls on the same day as `now`, otherwise
 * "até seg 18:00" — enough to tell at a glance whether an alert wraps
 * into tomorrow without a full date.
 */
export default function formatAlertUntil(
  endTime: string | DateTime,
  now: DateTime,
  locale: string,
  timeZone?: string
): string {
  const end = typeof endTime === 'string' ? DateTime.fromISO(endTime, { zone: timeZone }) : endTime;
  const current = now.setZone(timeZone);

  const sameDay = end.hasSame(current, "day");

  const time = end.toFormat("HH:mm");

  return sameDay
    ? time
    : `${end.setLocale(locale).toFormat("ccc")} ${time}`;
}