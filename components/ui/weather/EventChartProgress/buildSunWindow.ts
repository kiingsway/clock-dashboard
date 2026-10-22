import { DateTime } from "luxon";
import { getTimes } from "suncalc";
import { ChartWindow, SunDaily, SunEventKind } from "./types";

interface BuildSunWindowProps {
  daily: SunDaily;
  now: DateTime;
  isDay: boolean;
  timezone: string;
  latitude: number;
  longitude: number;
}

const parseTimes = (times: string[], timezone: string): DateTime[] =>
  times
    .map(t => DateTime.fromISO(t, { zone: timezone }))
    .filter(dt => dt.isValid)
    .sort((a, b) => a.toMillis() - b.toMillis());

/** Fallback pelo suncalc quando o daily não cobre o dia necessário (ex.: sunset de ontem). */
const getSuncalcTime = (date: DateTime, kind: SunEventKind, latitude: number, longitude: number, timezone: string): DateTime | undefined => {
  const time = getTimes(date.set({ hour: 12 }).toJSDate(), latitude, longitude)[kind];
  // Regiões polares: o evento pode não existir naquele dia.
  if (!time || Number.isNaN(time.getTime())) return undefined;
  return DateTime.fromJSDate(time).setZone(timezone);
};

export default function buildSunWindow({ daily, now, isDay, timezone, latitude, longitude }: BuildSunWindowProps): ChartWindow {
  const startKind: SunEventKind = isDay ? 'sunrise' : 'sunset';
  const endKind: SunEventKind = isDay ? 'sunset' : 'sunrise';

  const starts = parseTimes(daily[startKind], timezone);
  const ends = parseTimes(daily[endKind], timezone);

  const start = starts.filter(dt => dt <= now).at(-1)
    ?? getSuncalcTime(now.minus({ days: 1 }), startKind, latitude, longitude, timezone)
    ?? now.startOf('day');

  const end = ends.find(dt => dt > start)
    ?? getSuncalcTime(start.plus({ days: 1 }), endKind, latitude, longitude, timezone)
    ?? start.plus({ days: 1 });

  return {
    start: { kind: startKind, time: start },
    end: { kind: endKind, time: end },
    from: start,
    to: end,
  };
}

interface BuildFullDayWindowProps {
  daily: SunDaily;
  date: DateTime;
  timezone: string;
  latitude: number;
  longitude: number;
}

export function buildFullDayWindow({ daily, date, timezone, latitude, longitude }: BuildFullDayWindowProps): ChartWindow {
  const from = date.setZone(timezone).startOf('day');
  const to = from.plus({ days: 1 });

  const findEvent = (kind: SunEventKind, fallback: DateTime): DateTime =>
    parseTimes(daily[kind], timezone).find(dt => dt.hasSame(from, 'day'))
    ?? getSuncalcTime(from, kind, latitude, longitude, timezone)
    ?? fallback;

  return {
    start: { kind: 'sunrise', time: findEvent('sunrise', from) },
    end: { kind: 'sunset', time: findEvent('sunset', to) },
    from,
    to,
  };
}
