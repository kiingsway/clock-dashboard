import { IColor, IColorDay, IGradientColor, IInterpolateColor } from "@/types/colors.types";

export const DEFAULT_COLOR: IColor = {
  WEATHER: "#6b7280",
  WHITE: "#e8ecf4"
};

export const WEATHER_ACCENT_COLORS: IColorDay = {
  clear: { day: "#f4b860", night: "#8695f0" },
  partlyCloudy: { day: "#e5be85", night: "#7f8cb8" },
  cloudy: "#8b93a6",
  smoke: "#8b93a6",
  haze: "#8b93a6",
  lightFog: { day: "#a7b8bd", night: "#7c8b95" },
  fog: { day: "#a7b8bd", night: "#7c8b95" },
  drizzle: "#6fc1e0",
  showers: "#6fc1e0",
  rain: "#4fa0e0",
  heavyRain: "#4fa0e0",
  freezingDrizzle: "#4dd0e1",
  freezingRain: "#4dd0e1",
  snow: "#cfe3f0",
  snowShowers: "#cfe3f0",
  sleet: "#cfe3f0",
  heavySnow: "#9fa8da",
  heavySleet: "#9fa8da",
  hail: "#9fa8da",
  thunderstorm: "#a98cf0",
  moderateHail: "#a98cf0",
  heavyHail: "#a98cf0",
  loading: "#4b5563",
  error: "#ef4444",
  unknown: DEFAULT_COLOR.WEATHER,
  sunrise: "#e5be85",
  sunset: "#f4b860"
} as const;

export const WIND_SPEED_COLORS: IGradientColor[] = [
  { value: 0, hex: "#E0F2F1" },   // Calmo
  { value: 10, hex: "#D9F99D" },  // Brisa leve
  { value: 20, hex: "#FFF59D" },  // Perceptível
  { value: 30, hex: "#FFD180" },  // Incômodo
  { value: 40, hex: "#FFAB91" },  // Forte
  { value: 55, hex: "#FF7043" },  // Muito forte
  { value: 70, hex: "#D32F2F" },  // Severo
  { value: 90, hex: "#6A1B9A" },  // Extremo
] as const;

export const WIND_GUSTS_COLORS: IGradientColor[] = [
  { value: 0, hex: "#E0F2F1" },   // Sem rajadas relevantes
  { value: 20, hex: "#D9F99D" },  // Leve
  { value: 40, hex: "#FFF59D" },  // Perceptível
  { value: 60, hex: "#FFD180" },  // Moderada
  { value: 80, hex: "#FFAB91" },  // Forte
  { value: 100, hex: "#FF7043" }, // Muito forte
  { value: 120, hex: "#D32F2F" }, // Severa
  { value: 140, hex: "#6A1B9A" }, // Extrema
] as const;

export const VISIBILITY_COLORS: IGradientColor[] = [
  { value: 0, hex: "#6E5033" }, // Crítico
  { value: 500, hex: "#9E7B56" }, // Névoa intensa
  { value: 1000, hex: "#C4A482" }, // Baixa
  { value: 2000, hex: "#D9C3A5" }, // Moderada
  { value: 5000, hex: "#EADCC9" }, // Boa
  { value: 10000, hex: "#F5F0E6" }  // Excelente
] as const;

export const HUMIDITY_COLORS: IInterpolateColor = {
  low: "#f59e0b",
  mid: DEFAULT_COLOR.WHITE,
  high: "#3b82f6",
} as const;

export const DEW_COLORS: IInterpolateColor = {
  low: '#a5f3fc',
  mid: DEFAULT_COLOR.WHITE,
  high: '#fca5a5',
} as const;

export const DAYLIGHT_COLORS: IInterpolateColor = {
  low: "#a98cf0",
  mid: DEFAULT_COLOR.WHITE,
  high: "#fef08a",
} as const;

export function getTemperatureMinMaxColors(tempMin: number = -10, tempMax: number = 30) {

  const range = Math.abs(tempMax - tempMin);

  // 0 = quase sem variação
  // 1 = variação de 10°C ou mais
  const intensity = Math.min(range / 10, 1);

  const minColor = `color-mix(
  in srgb,
  var(--wc-info) ${60 + intensity * 40}%,
  white
)`;

  const maxColor = `color-mix(
  in srgb,
  var(--wc-danger) ${60 + intensity * 40}%,
  white
)`;

  return { minColor, maxColor };
}