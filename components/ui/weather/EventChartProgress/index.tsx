import { useMemo } from "react";
import dynamic from "next/dynamic";
import { DateTime } from "luxon";
import { useTranslation } from "react-i18next";
import { useNow } from "@/contexts/NowContext";
import buildSunWindow, { buildFullDayWindow } from "./buildSunWindow";
import buildMoonWindow, { buildMoonFullDayWindow } from "./buildMoonWindow";
import buildSunPathData, { getElevation } from "./buildSunPathData";
import buildWeatherGradientStops from "./buildWeatherGradientStops";
import buildMoonGradientStops from "./buildMoonGradientStops";
import SunEventLabel from "./components/SunEventLabel";
import { GradientStop, SunDaily, SunHourly } from "./types";
import styles from './EventChartProgress.module.scss';

// recharts fica fora do bundle inicial; o placeholder tem a mesma altura do gráfico.
const SunPathChart = dynamic(() => import("./components/SunPathChart"), {
  loading: () => <div className={styles.chart} />,
});

interface BaseProps {
  timezone: string;
  latitude: number;
  longitude: number;
  isAppFocused?: boolean;
}

/** Só o período atual (acima ou abaixo do horizonte). */
interface PeriodProps {
  fullDay?: false;
  date?: never;
}

/** Dia inteiro (00:00 -> 24:00) de `date`. */
interface FullDayProps {
  fullDay: true;
  date: DateTime;
}

/** Sol: cores pelo clima de cada hora; no modo período, `isDay` define dia ou noite. */
type SunProps = {
  body?: 'sun';
  daily: SunDaily;
  hourly: SunHourly;
} & ((PeriodProps & { isDay: boolean }) | (FullDayProps & { isDay?: never }));

/** Lua: tudo vem do suncalc; cores pela fase (MOON_COLORS). */
type MoonProps = {
  body: 'moon';
  daily?: never;
  hourly?: never;
  isDay?: never;
} & (PeriodProps | FullDayProps);

type Props = BaseProps & (SunProps | MoonProps);

const nearestStopColor = (stops: GradientStop[], offset: number): string | undefined =>
  stops.reduce<GradientStop | undefined>((closest, stop) =>
    !closest || Math.abs(stop.offset - offset) < Math.abs(closest.offset - offset) ? stop : closest,
    undefined,
  )?.color;

export default function EventChartProgress({ body = 'sun', daily, hourly, isDay, fullDay, date, timezone, latitude, longitude, isAppFocused = false }: Props) {
  const { t } = useTranslation();
  const { now } = useNow();

  const { start, end, from, to } = useMemo(() => {
    const base = { timezone, latitude, longitude };

    // `daily` sempre existe para o sol (garantido pelos tipos das props).
    if (body === 'sun' && daily) {
      return fullDay && date
        ? buildFullDayWindow({ ...base, daily, date })
        : buildSunWindow({ ...base, daily, now, isDay: Boolean(isDay) });
    }

    return fullDay && date
      ? buildMoonFullDayWindow({ ...base, date })
      : buildMoonWindow({ ...base, now });
  }, [body, daily, isDay, fullDay, date, now, timezone, latitude, longitude]);

  const data = useMemo(
    () => buildSunPathData(body, from, to, latitude, longitude),
    [body, from, to, latitude, longitude],
  );

  const stops = useMemo(
    () => body === 'sun' && hourly
      ? buildWeatherGradientStops({ hourly, start: from, end: to, timezone, t })
      : buildMoonGradientStops(from, to),
    [body, hourly, from, to, timezone, t],
  );

  const startMs = from.toMillis();
  const endMs = to.toMillis();
  const nowMs = now.toMillis();

  // Dia inteiro: só mostra a bolinha se `date` for hoje.
  const showMarker = fullDay
    ? from.hasSame(now.setZone(timezone), 'day')
    : nowMs >= startMs && nowMs <= endMs;

  const marker = showMarker
    ? {
      time: nowMs,
      elevation: getElevation(body, now, latitude, longitude),
      color: nearestStopColor(stops, (nowMs - startMs) / (endMs - startMs)) ?? 'var(--wc-accent)',
    }
    : undefined;

  return (
    <div className={styles.root}>
      <SunEventLabel event={start} isAppFocused={isAppFocused} />
      <SunPathChart
        data={data}
        stops={stops}
        start={startMs}
        end={endMs}
        marker={marker}
      />
      <SunEventLabel event={end} isAppFocused={isAppFocused} />
    </div>
  );
}
