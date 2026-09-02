import { getMoonTimes } from "suncalc";
import { DateTime } from "luxon";
import { IMoonDailyItem, IMoonDailyItemDate } from "@/types/weather.types";
import { isValidDateTime } from "@/utils/formatters/dateFormatters";
import getMoonNameIconPhase from "@/utils/weather/getMoonNameIconPhase";
import { TFunction } from "i18next";

interface GetMoonDaysParams {
  lat: number;
  lon: number;
  timezone: string;
  startDate: DateTime;
  days: number;
  t?: TFunction
}

type MoonDate = {
  date: DateTime<true> | undefined;
  kind: 'rise' | 'set';
};

const toDateTime = (
  date: Date | undefined,
  timezone?: string,
): DateTime<true> | undefined => {
  if (!date) return undefined;

  const dateTime = DateTime.fromJSDate(date).setZone(timezone);

  return dateTime.isValid ? dateTime : undefined;
};

const getDateRange = (
  date: DateTime,
  days: number,
): DateTime[] => {
  const start = date.startOf('day');

  return Array.from(
    { length: days + 2 },
    (_, index) => start.plus({ days: index - 1 }),
  );
};

const getDayMillis = (
  date: DateTime | undefined,
): number | undefined => {
  return date?.isValid
    ? date.startOf('day').toMillis()
    : undefined;
};

const getMoonEventDate = (
  date: DateTime,
  kind: MoonDate['kind'],
  moonDates: MoonDate[],
): DateTime<true> | undefined => {
  const findEvent = (targetDate: DateTime): DateTime<true> | undefined => {
    const targetMillis = getDayMillis(targetDate);

    if (targetMillis === undefined) return undefined;

    return moonDates.find(
      moonDate =>
        moonDate.kind === kind &&
        getDayMillis(moonDate.date) === targetMillis,
    )?.date;
  };

  // Moonrise may belong to the previous day.
  // Moonset may belong to the following day.
  const offset = kind === 'rise' ? -1 : 1;

  return (
    findEvent(date) ??
    findEvent(date.plus({ days: offset }))
  );
};

export default function getMoonDays({
  startDate,
  timezone,
  lat,
  lon,
  days,
  t,
}: GetMoonDaysParams): IMoonDailyItem[] {
  const additionalDates = getDateRange(startDate.setZone(timezone), days);

  const dates = additionalDates.slice(1, -1);

  const moonDates: MoonDate[] = additionalDates.flatMap(date => {
    const { rise, set } = getMoonTimes(date.toJSDate(), lat, lon);

    return [
      {
        date: toDateTime(rise, timezone),
        kind: 'rise' as const,
      },
      {
        date: toDateTime(set, timezone),
        kind: 'set' as const,
      },
    ];
  });

  return dates.map(date => {
    if (!isValidDateTime(date)) {
      throw new Error(`getMoonDays2. Invalid Date: "${date}"`);
    }

    const moonrise = getMoonEventDate(date, 'rise', moonDates);
    const moonset = getMoonEventDate(date, 'set', moonDates);

    return {
      key: date.toISO(),
      date: getMoonInfo(date, d => d.toISODate() ?? '-', t),
      rise: getMoonInfo(moonrise, d => d.toISO() ?? '-', t),
      set: getMoonInfo(moonset, d => d.toISO() ?? '-', t),
    } as IMoonDailyItem;
  });
}

const getMoonInfo = (date: DateTime<true> | undefined, toDate: (d: DateTime) => string, t?: TFunction): IMoonDailyItemDate | undefined => {
  if (!date) return undefined;
  const info = getMoonNameIconPhase(date, t);
  if (!info) return undefined;
  return {
    ...info,
    date: toDate(info.date),
  };
};
