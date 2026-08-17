import { DateTime } from "luxon";

interface GetCurrentProps {
  date: DateTime;
  time: string[];
}

interface GetCurrentValueProps<T> extends GetCurrentProps {
  values: T[];
}

export function getCurrentValue<T>({ date, time, values }: GetCurrentValueProps<T>): T | undefined {

  const isHourlyTime = time[0].includes('T');
  const keyFormat = `yyyy-MM-dd${isHourlyTime ? 'THH:00' : ''}`;

  const current = date.startOf("hour");
  const currentKey = current.toFormat(keyFormat);

  const index = time.findIndex((t) => DateTime.fromISO(t).toFormat(keyFormat) === currentKey);

  return index >= 0 ? values[index] : undefined;
}

export function getCurrentIndex({ date, time }: GetCurrentProps): number {

  const isHourlyTime = time[0].includes('T');
  const keyFormat = `yyyy-MM-dd${isHourlyTime ? 'THH:00' : ''}`;

  const current = date.startOf("hour");
  const currentKey = current.toFormat(keyFormat);

  return time.findIndex((t) => DateTime.fromISO(t).toFormat(keyFormat) === currentKey);
}