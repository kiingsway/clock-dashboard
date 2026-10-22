import { DateTime } from "luxon";
import { getMoonTimes } from "suncalc";
import { getMoonNameIconPhase } from "@/utils/weather/getMoonInfo";
import { getMoonElevation } from "./buildSunPathData";
import { ChartEvent, ChartWindow, MoonEventKind } from "./types";

interface MoonBaseProps {
  timezone: string;
  latitude: number;
  longitude: number;
}

interface MoonTime {
  kind: MoonEventKind;
  time: DateTime;
}

/** Quantos dias para cada lado são consultados no suncalc (a lua atrasa ~50 min/dia). */
const SEARCH_DAYS = 3;

/** Moonrises/moonsets ordenados ao redor de `center`, já no timezone. */
const collectMoonTimes = (center: DateTime, { timezone, latitude, longitude }: MoonBaseProps): MoonTime[] => {
  const base = center.setZone(timezone).startOf('day');

  const times = Array.from({ length: SEARCH_DAYS * 2 + 1 }, (_, i) => base.plus({ days: i - SEARCH_DAYS }))
    .flatMap(day => {
      const { rise, set } = getMoonTimes(day.set({ hour: 12 }).toJSDate(), latitude, longitude);
      return [
        { kind: 'moonrise' as const, date: rise },
        { kind: 'moonset' as const, date: set },
      ];
    })
    .flatMap(({ kind, date }) => {
      if (!date || Number.isNaN(date.getTime())) return [];
      return [{ kind, time: DateTime.fromJSDate(date).setZone(timezone) }];
    })
    .sort((a, b) => a.time.toMillis() - b.time.toMillis());

  // Dias vizinhos podem devolver o mesmo evento: remove duplicados (mesmo minuto).
  return times.filter((item, i) =>
    times.findIndex(other => other.kind === item.kind && Math.abs(other.time.diff(item.time, 'minutes').minutes) < 1) === i,
  );
};

/**
 * Evento com o ícone da fase da lua no horário dele (ou em `fallbackDate`, sem horário).
 * `referenceDay`: se o evento for de outro dia, marca para exibir a data.
 */
const toChartEvent = (kind: MoonEventKind, time: DateTime | undefined, fallbackDate: DateTime, referenceDay?: DateTime): ChartEvent => ({
  kind,
  time,
  iconName: getMoonNameIconPhase((time ?? fallbackDate).toJSDate())?.iconName,
  showDate: Boolean(time && referenceDay && !time.hasSame(referenceDay, 'day')),
});

interface BuildMoonWindowProps extends MoonBaseProps {
  now: DateTime;
}

/** Lua acima do horizonte: moonrise -> moonset. Abaixo: moonset -> moonrise. */
export default function buildMoonWindow({ now, ...base }: BuildMoonWindowProps): ChartWindow {
  const isUp = getMoonElevation(now, base.latitude, base.longitude) > 0;

  const startKind: MoonEventKind = isUp ? 'moonrise' : 'moonset';
  const endKind: MoonEventKind = isUp ? 'moonset' : 'moonrise';

  const times = collectMoonTimes(now, base);
  const today = now.setZone(base.timezone);

  const start = times.filter(m => m.kind === startKind && m.time <= now).at(-1)?.time;
  const from = start ?? now.minus({ hours: 12 });

  const end = times.find(m => m.kind === endKind && m.time > from)?.time;
  const to = end ?? from.plus({ days: 1 });

  return {
    start: toChartEvent(startKind, start, from, today),
    end: toChartEvent(endKind, end, to, today),
    from,
    to,
  };
}

interface BuildMoonFullDayWindowProps extends MoonBaseProps {
  date: DateTime;
}

/**
 * 00:00 -> 24:00 de `date`, com moonrise/moonset do dia nas laterais em ordem
 * cronológica (o moonset pode vir antes do moonrise). Se um deles não acontece
 * naquele dia, fica sem horário ("--:--").
 */
export function buildMoonFullDayWindow({ date, ...base }: BuildMoonFullDayWindowProps): ChartWindow {
  const from = date.setZone(base.timezone).startOf('day');
  const to = from.plus({ days: 1 });

  const times = collectMoonTimes(from, base);
  const inDay = (kind: MoonEventKind) => times.find(m => m.kind === kind && m.time >= from && m.time < to)?.time;

  const rise = toChartEvent('moonrise', inDay('moonrise'), from);
  const set = toChartEvent('moonset', inDay('moonset'), to);

  const setFirst = Boolean(rise.time && set.time && set.time < rise.time);

  return {
    start: setFirst ? set : rise,
    end: setFirst ? rise : set,
    from,
    to,
  };
}
