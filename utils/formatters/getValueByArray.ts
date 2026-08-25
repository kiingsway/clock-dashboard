import { DateTime } from "luxon";

export function getCurrentIndex(date: DateTime, time: string[]): number {
  const isHourlyTime = time[0].includes('T');
  const keyFormat = `yyyy-MM-dd${isHourlyTime ? 'THH:00' : ''}`;

  const current = date.startOf("hour");
  const currentKey = current.toFormat(keyFormat);

  return time.findIndex((t) => DateTime.fromISO(t).toFormat(keyFormat) === currentKey);
}