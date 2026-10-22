import { DateTime } from "luxon";
import { getMoonIllumination } from "suncalc";
import { MOON_COLORS } from "@/constants/colors";
import { getGradientColor } from "@/utils/weather/getColors";
import { GradientStop } from "./types";

/** Cor da fase da lua (0..1 -> 0..100 do MOON_COLORS) naquele momento. */
export const getMoonPhaseColor = (date: DateTime): string =>
  getGradientColor(getMoonIllumination(date.toJSDate()).phase * 100, MOON_COLORS);

/** Uma parada de cor por hora entre `start` (0) e `end` (1), conforme a fase da lua. */
export default function buildMoonGradientStops(start: DateTime, end: DateTime): GradientStop[] {
  const totalHours = end.diff(start, 'hours').hours;
  if (!(totalHours > 0)) return [];

  const steps = Math.ceil(totalHours);

  return Array.from({ length: steps + 1 }, (_, i) => {
    const date = i === steps ? end : start.plus({ hours: i });
    return {
      offset: date.diff(start, 'hours').hours / totalHours,
      color: getMoonPhaseColor(date),
    };
  });
}
