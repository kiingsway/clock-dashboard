import { DateTime } from "luxon";

export function getCurrentIndex(date: DateTime, time: string[]): number {
  if (!date.isValid) throw new Error(`Invalid Date: ${date}`);

  const isHourlyTime = time[0].includes('T');
  const keyFormat = `yyyy-MM-dd${isHourlyTime ? "'T'HH:00" : ""}`;

  const current = date.startOf(isHourlyTime ? "hour" : "day");
  const currentKey = current.toFormat(keyFormat);

  return time.findIndex((t) => DateTime.fromISO(t).toFormat(keyFormat) === currentKey);
}