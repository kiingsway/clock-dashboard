import { DateTime } from "luxon";
import { TFunction } from "i18next";
import { GradientStop, SunHourly } from "./types";
import getWeatherCodeInfo from "@/utils/weather/getWeatherCodeInfo";

interface BuildWeatherGradientStopsProps {
  hourly: SunHourly;
  start: DateTime;
  end: DateTime;
  timezone: string;
  t: TFunction;
}

/**
 * Uma parada de cor por hora (cor do clima daquela hora), posicionada
 * proporcionalmente entre `start` (0) e `end` (1). As horas vizinhas às bordas
 * também entram, presas em 0/1, para a cor das extremidades ficar correta.
 */
export default function buildWeatherGradientStops({ hourly, start, end, timezone, t }: BuildWeatherGradientStopsProps): GradientStop[] {
  const startMs = start.toMillis();
  const range = end.toMillis() - startMs;
  if (!(range > 0)) return [];

  const hourMs = 60 * 60 * 1000;

  const stops = hourly.time.flatMap((time, index) => {
    const date = DateTime.fromISO(time, { zone: timezone });
    if (!date.isValid) return [];

    const ms = date.toMillis();
    if (ms < startMs - hourMs || ms > startMs + range + hourMs) return [];

    const color = getWeatherCodeInfo(hourly.weather_code[index], hourly.is_day[index] === 1, t).accent;

    return [{ offset: (ms - startMs) / range, color }];
  });

  // Mantém só a última parada antes de 0 e a primeira depois de 1.
  const before = stops.filter(s => s.offset <= 0).at(-1);
  const after = stops.find(s => s.offset >= 1);
  const inside = stops.filter(s => s.offset > 0 && s.offset < 1);

  return [
    ...(before ? [{ ...before, offset: 0 }] : []),
    ...inside,
    ...(after ? [{ ...after, offset: 1 }] : []),
  ];
}
