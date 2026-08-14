import { ICON_BASE_URI } from "@/constants/iconFiles";
import { IWeather } from "@/types/weather.types";
import { BeaufortLevel } from "@/types/weatherInfo.types";
import { getCurrentValue } from "../formatters/getValueByArray";
import getBeaufortScale from "../geo/getBeaufortScale";
import { getCompassDirection } from "../geo/getCompassDirection";
import { DateTime } from "luxon";
import { hexToRgb, lerp } from "../formatters/textFormatters";
import { TFunction } from "i18next";

interface WindDirection {
  name: string;
  src: string;
}

interface WindMetric {
  direction?: WindDirection;
  gusts: string;
  gustsColor: string | undefined;
  gustsDesc: string | undefined;
  speed: string;
  speedColor: string | undefined;
  speedDesc: string | undefined;
  beaufort: undefined | {
    src: string;
    value: BeaufortLevel;
    duration: number;
  };
}

export interface WindData {
  now: WindMetric;
  day: WindMetric;
}

export default function getWindInfo(weather: IWeather, date: DateTime, t: TFunction): WindData {

  const { daily, hourly } = weather;

  const windGustsNow = getCurrentValue({ date, time: hourly.time, values: hourly.wind_gusts_10m });
  const windGustsDay = getCurrentValue({ date, time: daily.time, values: daily.wind_gusts_10m_mean });

  const windSpeedNow = getCurrentValue({ date, time: hourly.time, values: hourly.wind_speed_10m });
  const windSpeedDay = getCurrentValue({ date, time: daily.time, values: daily.wind_speed_10m_mean });

  const windDirectionNow = getCurrentValue({ date, time: hourly.time, values: hourly.wind_direction_10m });
  const windDirectionDay = getCurrentValue({ date, time: daily.time, values: daily.wind_direction_10m_dominant });

  const windCompassNow = windDirectionNow ? getCompassDirection(windDirectionNow) : undefined;
  const windCompassDay = windDirectionDay ? getCompassDirection(windDirectionDay) : undefined;

  const windSpeedNowSummary = windSpeedNow && windSpeedDay && windCompassNow ?
    getWindSummary({ currentSpeed: windSpeedNow, averageSpeed: windSpeedDay, direction: t(`compass.${windCompassNow.name}`) }, t)
    : undefined

  const windGustsNowSummary = windGustsNow && windGustsDay && windCompassNow ?
    getWindSummary({ currentSpeed: windGustsNow, averageSpeed: windGustsDay, direction: t(`compass.${windCompassNow.name}`) }, t)
    : undefined

  const beaufortNow = getBeaufortInfo(windSpeedNow)
  const beaufortDay = getBeaufortInfo(windSpeedDay)

  return {
    now: {
      direction: !windCompassNow ? undefined : {
        name: t(`compass.${windCompassNow.name}`),
        src: `${ICON_BASE_URI}wind-direction-${windCompassNow.abbreviation.toLowerCase()}.svg`
      },

      gusts: windGustsNow + weather.hourly_units.wind_gusts_10m,
      gustsColor: windColor(windGustsNow, 'gusts'),
      gustsDesc: windGustsNowSummary,

      speed: windSpeedNow + weather.hourly_units.wind_speed_10m,
      speedColor: windColor(windSpeedNow, 'speed'),
      speedDesc: windSpeedNowSummary,
      beaufort: beaufortNow,
    },


    day: {
      direction: !windCompassDay ? undefined : {
        name: t(`compass.${windCompassDay.name}`),
        src: `${ICON_BASE_URI}wind-direction-${windCompassDay.abbreviation.toLowerCase()}.svg`
      },

      gusts: windGustsDay + weather.daily_units.wind_gusts_10m_mean,
      gustsColor: windColor(windGustsDay, 'gusts'),
      gustsDesc: undefined,

      speed: windSpeedDay + weather.daily_units.wind_speed_10m_mean,
      speedColor: windColor(windSpeedDay, 'speed'),
      speedDesc: undefined,
      beaufort: beaufortDay,
    },
  };
}

const getBeaufortInfo = (windSpeed: number | undefined) => {
  if (typeof windSpeed !== 'number') return undefined

  const value = getBeaufortScale(windSpeed).level;
  const src = `${ICON_BASE_URI}wind-beaufort-${value}.svg`
  const duration = getWindGustAnimationDuration(windSpeed)

  return { src, value, duration }
}

/**
 * Calcula a cor exata da rajada de vento (km/h) de forma contínua.
 */
export function getWindGustColor(gustKmH?: number): string | undefined {
  if (!gustKmH) return undefined
  const g = Math.max(0, Math.min(100, gustKmH)); // Travado em 100+ km/h para o teto da cor

  const stops = [
    { value: 0, hex: "#E0F2F1" }, // Calmo / Sem rajadas (Verde água muito claro)
    { value: 20, hex: "#FFF9C4" }, // Brisa leve (Amarelo bem suave)
    { value: 40, hex: "#FFE082" }, // Rajada moderada (Amarelo ouro)
    { value: 60, hex: "#FFB74D" }, // Rajada forte / Atenção (Laranja)
    { value: 80, hex: "#FF8A65" }, // Ventania severa (Laranja escuro / Vermelho)
    { value: 100, hex: "#CFD8DC" }  // Tempestade / Crítico (Cinza tempestade fechado)
  ];

  let lower = stops[0];
  let upper = stops[stops.length - 1];

  for (let i = 0; i < stops.length - 1; i++) {
    if (g >= stops[i].value && g <= stops[i + 1].value) {
      lower = stops[i];
      upper = stops[i + 1];
      break;
    }
  }

  const range = upper.value - lower.value;
  const factor = range === 0 ? 0 : (g - lower.value) / range;

  const c1 = hexToRgb(lower.hex);
  const c2 = hexToRgb(upper.hex);

  const R = lerp(c1.r, c2.r, factor);
  const G = lerp(c1.g, c2.g, factor);
  const B = lerp(c1.b, c2.b, factor);

  return `rgb(${R}, ${G}, ${B})`;
}

function getWindGustAnimationDuration(windGust: number): number {
  const MIN_GUST = 0;
  const MAX_GUST = 100;

  const MIN_DURATION = 1.5; // 100 km/h
  const MAX_DURATION = 15;  // 0 km/h

  const gust = Math.min(Math.max(windGust, MIN_GUST), MAX_GUST);

  const t = (gust - MIN_GUST) / (MAX_GUST - MIN_GUST);

  return MAX_DURATION - t * (MAX_DURATION - MIN_DURATION);
}

type WindType = "speed" | "gusts";

/**
 * Retorna uma cor baseada no impacto/percepção do vento para o ser humano.
 *
 * "speed"  → velocidade sustentada do vento.
 * "gusts"  → rajadas de vento, com limites mais altos.
 *
 * As faixas de rajadas são mais tolerantes porque uma rajada é
 * momentânea, enquanto a velocidade sustentada afeta continuamente
 * o conforto e as atividades ao ar livre.
 */
function windColor(windKmH?: number, type: WindType = "speed"): string | undefined {
  if (windKmH == null || !Number.isFinite(windKmH)) return undefined;

  const stops = type === "speed" ?
    [
      { value: 0, hex: "#E0F2F1" },   // Calmo
      { value: 10, hex: "#D9F99D" },  // Brisa leve
      { value: 20, hex: "#FFF59D" },  // Perceptível
      { value: 30, hex: "#FFD180" },  // Incômodo
      { value: 40, hex: "#FFAB91" },  // Forte
      { value: 55, hex: "#FF7043" },  // Muito forte
      { value: 70, hex: "#D32F2F" },  // Severo
      { value: 90, hex: "#6A1B9A" },  // Extremo
    ]
    : [
      { value: 0, hex: "#E0F2F1" },   // Sem rajadas relevantes
      { value: 20, hex: "#D9F99D" },  // Leve
      { value: 40, hex: "#FFF59D" },  // Perceptível
      { value: 60, hex: "#FFD180" },  // Moderada
      { value: 80, hex: "#FFAB91" },  // Forte
      { value: 100, hex: "#FF7043" }, // Muito forte
      { value: 120, hex: "#D32F2F" }, // Severa
      { value: 140, hex: "#6A1B9A" }, // Extrema
    ];

  const max = stops[stops.length - 1].value;
  const value = Math.max(0, Math.min(max, windKmH));

  let lower = stops[0];
  let upper = stops[stops.length - 1];

  for (let i = 0; i < stops.length - 1; i++) {
    if (value >= stops[i].value && value <= stops[i + 1].value) {
      lower = stops[i];
      upper = stops[i + 1];
      break;
    }
  }

  const range = upper.value - lower.value;
  const factor =
    range === 0
      ? 0
      : (value - lower.value) / range;

  const c1 = hexToRgb(lower.hex);
  const c2 = hexToRgb(upper.hex);

  const R = Math.round(lerp(c1.r, c2.r, factor));
  const G = Math.round(lerp(c1.g, c2.g, factor));
  const B = Math.round(lerp(c1.b, c2.b, factor));

  return `rgb(${R}, ${G}, ${B})`;
}

interface WindSummaryData {
  currentSpeed: number;
  averageSpeed: number;
  direction: string;
}

export function getWindSummary({ currentSpeed, averageSpeed, direction }: WindSummaryData, t: TFunction): string {
  let impact: string;

  if (currentSpeed < 10) {
    impact = t("windTextes.impact.calm");
  } else if (currentSpeed < 20) {
    impact = t("windTextes.impact.light");
  } else if (currentSpeed < 30) {
    impact = t("windTextes.impact.moderate");
  } else if (currentSpeed < 50) {
    impact = t("windTextes.impact.strong");
  } else {
    impact = t("windTextes.impact.veryStrong");
  }

  return t("windTextes.summary", {
    current: `${currentSpeed}km/h`,
    average: `${averageSpeed}km/h`,
    direction,
    impact,
  });
}