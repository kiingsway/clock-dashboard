import { DateTime } from "luxon";
import { getMoonPosition, getPosition } from "suncalc";
import { CelestialBody, SunPathPoint } from "./types";

const RAD_TO_DEG = 180 / Math.PI;

export const getSunElevation = (date: DateTime, latitude: number, longitude: number): number =>
  getPosition(date.toJSDate(), latitude, longitude).altitude * RAD_TO_DEG;

export const getMoonElevation = (date: DateTime, latitude: number, longitude: number): number =>
  getMoonPosition(date.toJSDate(), latitude, longitude).altitude * RAD_TO_DEG;

export const getElevation = (body: CelestialBody, date: DateTime, latitude: number, longitude: number): number =>
  body === 'moon'
    ? getMoonElevation(date, latitude, longitude)
    : getSunElevation(date, latitude, longitude);

/** Amostra a elevação do sol/lua entre `start` e `end` a cada `stepMinutes`. */
export default function buildSunPathData(
  body: CelestialBody,
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
      elevation: getElevation(body, date, latitude, longitude),
    };
  });
}
