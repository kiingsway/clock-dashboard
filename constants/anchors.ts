import { IColorRange } from "@/types/colors.types";

export const DAYLIGHT_HOURS: IColorRange = {
  min: 0,
  med: 12,
  max: 18,
} as const;

export const DEW_POINT_VALUES: IColorRange = {
  min: 0,
  med: 12,
  max: 24,
} as const;

export const HUMIDITY_PERCENTAGE: IColorRange = {
  min: 0,
  med: 30,
  max: 100,
} as const;