import { useMemo } from "react";
import { DateTime } from "luxon";
import { useTranslation } from "react-i18next";
import { useNow } from "@/contexts/NowContext";
import buildSunWindow, { buildFullDayWindow } from "./buildSunWindow";
import buildSunPathData, { getSunElevation } from "./buildSunPathData";
import buildWeatherGradientStops from "./buildWeatherGradientStops";
import dynamic from "next/dynamic";
import SunEventLabel from "./components/SunEventLabel";
import { GradientStop, SunDaily, SunHourly } from "./types";
import styles from './EventChartProgress.module.scss';

// recharts fica fora do bundle inicial; o placeholder tem a mesma altura do gráfico.
const SunPathChart = dynamic(() => import("./components/SunPathChart"), {
  loading: () => <div className={styles.chart} />,
});

interface BaseProps {
  daily: SunDaily;
  hourly: SunHourly;
  timezone: string;
  latitude: number;
  longitude: number;
  isAppFocused?: boolean;
}

/** Só o período atual: dia (sunrise -> sunset) ou noite (sunset -> sunrise). */
interface PeriodProps {
  fullDay?: false;
  isDay: boolean;
  date?: never;
}

/** Dia inteiro (00:00 -> 24:00) de `date`. */
interface FullDayProps {
  fullDay: true;
  date: DateTime;
  isDay?: never;
}

type Props = BaseProps & (PeriodProps | FullDayProps);

const nearestStopColor = (stops: GradientStop[], offset: number): string | undefined =>
  stops.reduce<GradientStop | undefined>((closest, stop) =>
    !closest || Math.abs(stop.offset - offset) < Math.abs(closest.offset - offset) ? stop : closest,
    undefined,
  )?.color;

export default function EventChartProgress({ daily, hourly, isDay, fullDay, date, timezone, latitude, longitude, isAppFocused = false }: Props) {
  const { t } = useTranslation();
  const { now } = useNow();

  const { start, end, from, to } = useMemo(
    () => fullDay && date
      ? buildFullDayWindow({ daily, date, timezone, latitude, longitude })
      : buildSunWindow({ daily, now, isDay: Boolean(isDay), timezone, latitude, longitude }),
    [fullDay, date, daily, now, isDay, timezone, latitude, longitude],
  );

  const data = useMemo(
    () => buildSunPathData(from, to, latitude, longitude),
    [from, to, latitude, longitude],
  );

  const stops = useMemo(
    () => buildWeatherGradientStops({ hourly, start: from, end: to, timezone, t }),
    [hourly, from, to, timezone, t],
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
      elevation: getSunElevation(now, latitude, longitude),
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
