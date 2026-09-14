import { RAINBOW_COLORS } from "./colors";

const NO_UV_INDEX_LEVEL = {
  value: 0, label: 'noUvIndex', color: 'red'
} as const;

export const UV_INDEX_LEVELS = [
  { value: 0, label: 'low', color: RAINBOW_COLORS[0] },
  { value: 3, label: 'moderate', color: RAINBOW_COLORS[2] },
  { value: 6, label: 'high', color: RAINBOW_COLORS[3] },
  { value: 9, label: 'veryHigh', color: RAINBOW_COLORS[4] },
  { value: 11, label: 'extreme', color: RAINBOW_COLORS[5] },
] as const;

export const getUvIndexLevel = (uvIndex: number, isDay?: boolean) => {
  if (!isDay) return NO_UV_INDEX_LEVEL;
  return [...UV_INDEX_LEVELS].reverse().find(level => uvIndex >= level.value) ?? NO_UV_INDEX_LEVEL;
};