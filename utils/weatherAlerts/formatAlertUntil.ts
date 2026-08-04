import { DateTime } from "luxon";

/**
 * "até 18:00" if `endTime` falls on the same day as `now`, otherwise
 * "até seg 18:00" — enough to tell at a glance whether an alert wraps
 * into tomorrow without a full date.
 */
export default function formatAlertUntil(
  endTime: string,
  now: DateTime,
  locale: string,
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