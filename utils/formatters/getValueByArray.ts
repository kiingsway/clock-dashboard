import { DateTime } from "luxon";

interface GetCurrentHourlyValueProps<T> {
  date: DateTime;
  time: string[];
  values: T[];
  timezone: string;
}

export function getCurrentHourlyValue<T>({ date, time, values, timezone }: GetCurrentHourlyValueProps<T>): T | undefined {
  const current = date.setZone(timezone).startOf("hour");
  const currentKey = current.toFormat('yyyy-MM-dd-HH');

  const index = time.findIndex((timeString) => {
    const date = DateTime.fromISO(timeString, { zone: timezone });

    return date.toFormat('yyyy-MM-dd-HH') === currentKey;
  });

  return index >= 0 ? values[index] : undefined;
}

export function getDailyValue<T>(date: DateTime, time: string[], values: T[], timezone: string): T | undefined {
  const today = date.setZone(timezone).toISODate();

  if (!Array.isArray(time) || !time?.length) return undefined;

  const index = time.findIndex(date => date === today);

  return index === -1 ? undefined : values[index];
}

export function getCurrentValue<T>({ date, time, values }: Omit<GetCurrentHourlyValueProps<T>, 'timezone'>): T | undefined {

  const isHourlyTime = time[0].includes('T');
  const keyFormat = `yyyy-MM-dd${isHourlyTime ? 'THH:00' : ''}`;

  const current = date.startOf("hour");
  const currentKey = current.toFormat(keyFormat);

  const index = time.findIndex((timeString) => {
    const date = DateTime.fromISO(timeString);

    return date.toFormat(keyFormat) === currentKey;
  });

  return index >= 0 ? values[index] : undefined;
}