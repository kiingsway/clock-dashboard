import { DateTime } from "luxon";

export function getCurrentHourlyValue<T>(
  time: string[],
  values: T[],
  timezone: string
): T | undefined {
  const now = DateTime.now().setZone(timezone);

  let closestIndex = -1;
  let smallestDiff = Infinity;

  time.forEach((item, index) => {
    const date = DateTime.fromISO(item, { zone: timezone });
    const diff = Math.abs(date.diff(now).as("milliseconds"));

    if (diff < smallestDiff) {
      smallestDiff = diff;
      closestIndex = index;
    }
  });

  return closestIndex === -1
    ? undefined
    : values[closestIndex];
}

export function getTodayDailyValue<T>(
  time: string[],
  values: T[],
  timezone: string
): T | undefined {
  const today = DateTime.now()
    .setZone(timezone)
    .toISODate();

  const index = time.findIndex(date => date === today);

  return index === -1
    ? undefined
    : values[index];
}