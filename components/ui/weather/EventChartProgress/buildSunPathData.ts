import { DateTime } from "luxon";
import { getPosition } from "suncalc";
import { SunPathPoint } from "./types";

const RAD_TO_DEG = 180 / Math.PI;

export const getSunElevation = (date: DateTime, latitude: number, longitude: number): number =>
  getPosition(date.toJSDate(), latitude, longitude).altitude * RAD_TO_DEG;

/** Amostra a elevação do sol entre `start` e `end` a cada `stepMinutes`. */
export default function buildSunPathData(
  start: DateTime,
  end: DateTime,
  latitude: number,
  longitude: number,
  stepMinutes = 5,
): SunPathPoint[] {
  const totalMinutes = end.diff(start, 'minutes').minutes;
  if (!(totalMinutes > 0)) return [];

  const steps = Math.ceil(totalMinutes / stepMinutes);

  return Array.from({ length: steps + 1 }, (_, i) => {
    const date = i === steps ? end : start.plus({ minutes: i * stepMinutes });
    return {
      time: date.toMillis(),
      elevation: getSunElevation(date, latitude, longitude),
    };
  });
}
