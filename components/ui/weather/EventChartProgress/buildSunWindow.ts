import { DateTime } from "luxon";
import { getTimes } from "suncalc";
import { getSunElevation } from "./buildSunPathData";
import { ChartEvent, ChartWindow, SunDaily, SunEventKind } from "./types";

interface SunBaseProps {
  /** Opcional: só fornece o horário exibido nos rótulos (Open-Meteo). Não decide nada no gráfico. */
  daily?: SunDaily;
  timezone: string;
  latitude: number;
  longitude: number;
}

interface SunTime {
  kind: SunEventKind;
  time: DateTime;
}

const SUN_KINDS: SunEventKind[] = ['sunrise', 'sunset'];

const getSuncalcTime = (date: DateTime, kind: SunEventKind, latitude: number, longitude: number, timezone: string): DateTime | undefined => {
  const time = getTimes(date.set({ hour: 12 }).toJSDate(), latitude, longitude)[kind];
  // Regiões polares: o evento pode não existir naquele dia.
  if (!time || Number.isNaN(time.getTime())) return undefined;
  return DateTime.fromJSDate(time).setZone(timezone);
};

/** Nasceres/pores do suncalc de ontem, hoje e amanhã, ordenados. */
const collectSunTimes = (now: DateTime, { timezone, latitude, longitude }: SunBaseProps): SunTime[] => {
  const today = now.setZone(timezone).startOf('day');

  return [-1, 0, 1]
    .flatMap(offset => SUN_KINDS.flatMap(kind => {
      const time = getSuncalcTime(today.plus({ days: offset }), kind, latitude, longitude, timezone);
      return time ? [{ kind, time }] : [];
    }))
    .sort((a, b) => a.time.toMillis() - b.time.toMillis());
};

/** Horário do Open-Meteo para o mesmo evento no mesmo dia (só para exibir). */
const findDailyTime = (daily: SunDaily | undefined, kind: SunEventKind, time: DateTime, timezone: string): DateTime | undefined =>
  daily?.[kind]
    ?.map(t => DateTime.fromISO(t, { zone: timezone }))
    .find(dt => dt.isValid && dt.hasSame(time.setZone(timezone), 'day'));

/**
 * Rótulo do evento: horário do Open-Meteo do mesmo dia do evento do suncalc.
 * Sem Open-Meteo (ainda carregando) ou sem evento no dia, fica "--:--".
 */
const toChartEvent = (kind: SunEventKind, suncalcTime: DateTime | undefined, { daily, timezone }: SunBaseProps): ChartEvent => ({
  kind,
  time: suncalcTime && findDailyTime(daily, kind, suncalcTime, timezone),
});

interface BuildSunWindowProps extends SunBaseProps {
  now: DateTime;
}

/**
 * Período atual, todo pelo suncalc: último evento até `now` -> próximo evento do
 * tipo oposto. Nascer -> pôr (dia) ou pôr -> nascer (noite). Assim `now` sempre
 * fica dentro da janela, mesmo sem clima carregado ou com `is_day` defasado.
 */
export default function buildSunWindow({ now, ...base }: BuildSunWindowProps): ChartWindow {
  const times = collectSunTimes(now, base);

  const last = times.filter(s => s.time <= now).at(-1);

  // Regiões polares: sem evento recente, decide pela elevação do sol.
  const startKind: SunEventKind = last?.kind ?? (getSunElevation(now, base.latitude, base.longitude) > 0 ? 'sunrise' : 'sunset');
  const endKind: SunEventKind = startKind === 'sunrise' ? 'sunset' : 'sunrise';

  const end = times.find(s => s.kind === endKind && s.time > now)?.time;

  const from = last?.time ?? now.setZone(base.timezone).startOf('day');
  const to = end ?? from.plus({ days: 1 });

  return {
    start: toChartEvent(startKind, last?.time, base),
    end: toChartEvent(endKind, end, base),
    from,
    to,
  };
}

interface BuildFullDayWindowProps extends SunBaseProps {
  date: DateTime;
}

/** 00:00 -> 24:00 de `date`, com nascer/pôr do suncalc nas laterais (horário exibido do Open-Meteo). */
export function buildFullDayWindow({ date, ...base }: BuildFullDayWindowProps): ChartWindow {
  const from = date.setZone(base.timezone).startOf('day');
  const to = from.plus({ days: 1 });

  const event = (kind: SunEventKind) =>
    toChartEvent(kind, getSuncalcTime(from, kind, base.latitude, base.longitude, base.timezone), base);

  return {
    start: event('sunrise'),
    end: event('sunset'),
    from,
    to,
  };
}
