import { TCategoryDef, IGradientColor, IInterpolateColor } from "@/types/colors.types";

export const DEFAULT_COLOR = {
  WEATHER: "#6b7280",
  WHITE: "#e8ecf4"
} as const;

export const RAINBOW_COLORS = [
  "#6FC996",
  "#ACDC91",
  "#F3CD62",
  "#F29C62",
  "#E86F72",
  "#A477C2",
  "#E0F2F1",
  "#4F8FC4"
] as const;

const YELLOW_COLORS = [
  RAINBOW_COLORS[2],
  "#E8D97A",
  "#DDE19A",
  "#D8E8B8",
  RAINBOW_COLORS[6],
];

const BLUE_COLORS = [
  RAINBOW_COLORS[7],
  "#5B9BD5",
  "#72A8CC",
  "#9FC4D5",
  "#C0D8DB",
  RAINBOW_COLORS[6],
] as const;

export const WEATHER_ACCENT_COLORS: TCategoryDef = {
  clear: { day: "#F8B820", night: "#8695f0" },
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
  { value: 0, hex: YELLOW_COLORS[4] },   // Calmo
  { value: 10, hex: YELLOW_COLORS[3] },  // Brisa leve
  { value: 20, hex: YELLOW_COLORS[2] },  // Perceptível
  { value: 30, hex: YELLOW_COLORS[1] },  // Incômodo
  { value: 40, hex: RAINBOW_COLORS[2] },  // Forte
  { value: 55, hex: RAINBOW_COLORS[3] },  // Muito forte
  { value: 70, hex: RAINBOW_COLORS[4] },  // Severo
  { value: 90, hex: RAINBOW_COLORS[5] },  // Extremo
] as const;

export const WIND_GUSTS_COLORS: IGradientColor[] = [
  { value: 0, hex: YELLOW_COLORS[4] },   // Sem rajadas relevantes
  { value: 20, hex: YELLOW_COLORS[3] },  // Leve
  { value: 40, hex: YELLOW_COLORS[2] },  // Perceptível
  { value: 60, hex: YELLOW_COLORS[1] },  // Moderada
  { value: 80, hex: RAINBOW_COLORS[2] },  // Forte
  { value: 100, hex: RAINBOW_COLORS[3] }, // Muito forte
  { value: 120, hex: RAINBOW_COLORS[4] }, // Severa
  { value: 140, hex: RAINBOW_COLORS[5] }, // Extrema
] as const;

export const VISIBILITY_COLORS: IGradientColor[] = [
  { value: 0, hex: "#6E5033" }, // Crítico
  { value: 500, hex: "#9E7B56" }, // Névoa intensa
  { value: 1000, hex: "#C4A482" }, // Baixa
  { value: 2000, hex: "#D9C3A5" }, // Moderada
  { value: 5000, hex: "#EADCC9" }, // Boa
  { value: 10000, hex: "#F5F0E6" }  // Excelente
] as const;

export const MOON_COLORS: IGradientColor[] = [
  { value: Math.round((0 / 16) * 100), hex: "#24304A" },
  { value: Math.round((1 / 16) * 100), hex: "#405B86" },
  { value: Math.round((3 / 16) * 100), hex: "#5F78A3" },
  { value: Math.round((5 / 16) * 100), hex: "#8295B5" },
  { value: Math.round((7 / 16) * 100), hex: "#D8DDE5" },
  { value: Math.round((9 / 16) * 100), hex: "#8295B5" },
  { value: Math.round((11 / 16) * 100), hex: "#5F78A3" },
  { value: Math.round((13 / 16) * 100), hex: "#405B86" },
  { value: Math.round((15 / 16) * 100), hex: "#24304A" },
];

export const UVINDEX_COLORS: IGradientColor[] = [
  { value: 0, hex: RAINBOW_COLORS[0] },  // Verde — baixo
  { value: 3, hex: RAINBOW_COLORS[2] },  // Amarelo — moderado
  { value: 6, hex: RAINBOW_COLORS[3] },  // Laranja — alto
  { value: 9, hex: RAINBOW_COLORS[4] },  // Vermelho — muito alto
  { value: 11, hex: RAINBOW_COLORS[5] }, // Roxo — extremo
];

export const HUMIDITY_COLORS: IGradientColor[] = [
  { value: 0, hex: YELLOW_COLORS[0], },// Extremely dry
  { value: 20, hex: YELLOW_COLORS[1], },// Very dry
  { value: 30, hex: YELLOW_COLORS[3], },// Dry
  { value: 40, hex: YELLOW_COLORS[4], },// Comfortable
  { value: 60, hex: BLUE_COLORS[3], },// Slightly humid
  { value: 70, hex: BLUE_COLORS[2], },// Humid
  { value: 80, hex: BLUE_COLORS[1], },// Very humid
  { value: 90, hex: BLUE_COLORS[0], },// Extremely humid
] as const;

export const AQI_EU_COLORS: IGradientColor[] = [
  { value: 0, hex: "#B8E6C1", }, // Good
  { value: 20, hex: "#D8E9A8", }, // Fair
  { value: 40, hex: "#F3E6A3", }, // Moderate
  { value: 60, hex: "#F3C49B", }, // Poor
  { value: 80, hex: "#EFA6A6", }, // Very poor
  { value: 100, hex: "#CFA6D8", }, // Extremely poor
] as const;

export const AQI_USA_COLORS: IGradientColor[] = [
  { value: 0, hex: "#B8E6C1", }, // Good
  { value: 50, hex: "#D8E9A8", }, // Moderate
  { value: 100, hex: "#F3E6A3", }, // Unhealthy for sensitive groups
  { value: 150, hex: "#F3C49B", }, // Unhealthy
  { value: 200, hex: "#EFA6A6", }, // Very unhealthy
  { value: 300, hex: "#CFA6D8", }, // Hazardous
] as const;

export const DEW_COLORS: IInterpolateColor = {
  low: '#a5f3fc',
  // low: BLUE_COLORS[2],
  mid: RAINBOW_COLORS[6],
  high: RAINBOW_COLORS[4],
} as const;

export const DAYLIGHT_COLORS: IInterpolateColor = {
  low: RAINBOW_COLORS[5],
  mid: RAINBOW_COLORS[6],
  high: YELLOW_COLORS[0],
} as const;