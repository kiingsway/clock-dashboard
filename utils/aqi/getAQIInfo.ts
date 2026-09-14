import { BASIC_API_LEVES } from "@/constants/aqi";
import { RAINBOW_COLORS } from "@/constants/colors";
import { AQIScale } from "@/types/aqi.types";
import { TFunction } from "i18next";

// const AQI_NEUTRAL_COLOR = "#9FA9B5"; // Cinza um pouco mais presente e saturado
// export const AQI_COLORS = [
//   "#62E078",
//   "#B5EA3A",
//   "#FFDA33",
//   "#FFA352",
//   "#FF5C5C",
//   "#C45CEB",
// ] as const;

const AQI_NEUTRAL_COLOR = "#B8B8B8"; // Cinza um pouco mais presente e saturado
export const AQI_COLORS = [
  RAINBOW_COLORS[0],
  RAINBOW_COLORS[1],
  RAINBOW_COLORS[2],
  RAINBOW_COLORS[3],
  RAINBOW_COLORS[4],
  RAINBOW_COLORS[5],
] as const;

export const AQI_BREAKPOINTS = {
  aqi: {
    european: [20, 40, 60, 80, 100],
    us: [50, 100, 150, 200, 300],
  },

  pm2_5: {
    european: [5, 15, 50, 90, 140],
    us: [9, 35.4, 55.4, 125.4, 225.4],
  },

  pm10: {
    european: [15, 45, 120, 195, 270],
    us: [55, 155, 255, 355, 425],
  },

  ozone: {
    european: [60, 100, 120, 160, 180],
    us: [
      107.8, // 55 ppb
      137.2, // 70 ppb
      166.6, // 85 ppb
      205.8, // 105 ppb
      392.0, // 200 ppb
    ],
  },

  nitrogen_dioxide: {
    european: [10, 25, 60, 100, 150],
    us: [
      101.52,  // 54 ppb
      188,     // 100 ppb
      676.8,   // 360 ppb
      1222,    // 650 ppb
      2350,    // 1250 ppb
    ],
  },

  sulphur_dioxide: {
    european: [20, 40, 125, 190, 275],
    us: [
      91.7,    // 35 ppb
      196.5,   // 75 ppb
      484.7,   // 185 ppb
      799.1,   // 305 ppb
      1585.1,  // 605 ppb
      2633.1,  // 1005 ppb
    ],
  },

  carbon_monoxide: {
    european: null,
    us: [
      5060,   // 4.4 ppm  — Good
      10810,  // 9.4 ppm  — Moderate
      14260,  // 12.4 ppm — Unhealthy for Sensitive Groups
      17710,  // 15.4 ppm — Unhealthy
      34960,  // 30.4 ppm — Very Unhealthy
      57960,  // 50.4 ppm — Hazardous
    ],
  },

  dust: {
    european: null,
    us: null,
  },
} as const;

const NO_INFO = { level: undefined, color: AQI_NEUTRAL_COLOR, desc: undefined, };

export default function getAQIInfo(value: number, type: AQIScale, pollutant: keyof typeof AQI_BREAKPOINTS, t: TFunction) {
  const breakpoints = AQI_BREAKPOINTS?.[pollutant]?.[type];
  if (!breakpoints?.length) return NO_INFO;

  const index = breakpoints.findIndex((breakpoint) => value <= breakpoint);

  const levelIndex = index === -1 ? 5 : index;

  const levelKey = BASIC_API_LEVES[levelIndex];
  const scaleKey = type === 'european' ? 'eu' : 'us';
  const level = t(`aqiTextes.level.${scaleKey}.${levelKey}`);

  const color = AQI_COLORS?.[levelIndex] ?? AQI_NEUTRAL_COLOR;

  const desc = t(`aqiTextes.desc.${pollutant}.${scaleKey}.${levelKey}`);

  return { level, color, desc };
}