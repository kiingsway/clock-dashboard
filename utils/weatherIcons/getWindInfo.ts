import { IDaily, IHourly, IWeather } from "@/types/weather.types"
import { ICON_BASE_URI } from "./iconFiles"
import { DateTime } from "luxon"
import { getCurrentHourlyValue, getTodayDailyValue } from "../getValueFromDate"
import getBeaufortScale from "../getBeaufortScale"
import { getCompassDirection } from "../getCompassDirection"
import { hexToRgb, lerp } from "../formatters"

export default function getWindInfo(weather?: IWeather) {

  if (!weather) return undefined

  const { daily, hourly, timezone } = weather

  const windSpeedMean = getTodayDailyValue(daily.time, daily.wind_speed_10m_mean, timezone)
  const windGustsMean = getTodayDailyValue(daily.time, daily.wind_gusts_10m_mean, timezone)

  const windDirection = getCurrentHourlyValue(hourly.time, hourly.wind_direction_10m, timezone)
  const windGusts = getCurrentHourlyValue(hourly.time, hourly.wind_gusts_10m, timezone)
  const windSpeed = getCurrentHourlyValue(hourly.time, hourly.wind_speed_10m, timezone)

  const windGustsDesc = getWindGustDescription(windGusts)
  const windGustsMeanDesc = getWindGustDescription(windGustsMean)

  const hasDaily = !windSpeedMean || !windGustsMean || !windGustsMeanDesc

  const windDirectionCompass = windDirection ? getCompassDirection(windDirection) : undefined
  const beaufort = typeof windSpeed === 'number' ? getBeaufortScale(windSpeed).level : undefined

  return {
    daily: hasDaily ? undefined : {
      speed: windSpeedMean,
      gusts: windGustsMean,
      gustsColor: getWindGustColor(windGustsMean),
      desc: windGustsMeanDesc
    },
    hourly: {
      direction: {
        name: windDirectionCompass?.name,
        src: `${ICON_BASE_URI}wind-direction-${windDirectionCompass?.abbreviation.toLowerCase()}.svg`
      },
      beaufortSrc: beaufort ? `${ICON_BASE_URI}wind-beaufort-${beaufort}.svg` : undefined,
      gusts: windGusts,
      gustsColor: getWindGustColor(windGusts),
      speed: windSpeed,
      desc: windGustsDesc
    }
  }
}

const getWindGustDescription = (gust?: number) => {
  if (typeof gust !== 'number') return undefined
  if (gust < 20) return "Vento calmo. Sem impacto significativo.";
  if (gust < 40) return "Vento moderado. Cuidado ao ar livre.";
  if (gust < 60) return "Vento forte. Possíveis impactos.";
  if (gust < 80) return "Vento muito forte. Evite áreas expostas.";
  return "Vento extremo. Risco de danos e quedas.";
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