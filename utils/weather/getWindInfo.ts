import { ICON_BASE_URI } from "@/constants/iconFiles";
import { IWeather } from "@/types/weather.types";
import { getCurrentIndex } from "../formatters/getValueByArray";
import getBeaufortScale from "../geo/getBeaufortScale";
import { getCompassDirection } from "../geo/getCompassDirection";
import { DateTime } from "luxon";
import { hexToRgb, lerp } from "../formatters/textFormatters";
import { TFunction } from "i18next";
import { IWindInfo } from "@/types/weatherInfo.types";
import { WIND_SPEED_COLORS, WIND_GUSTS_COLORS } from "@/constants/wind";

export default function getWindInfo(weather: IWeather, date: DateTime, t: TFunction): IWindInfo {

  const { daily, hourly } = weather;

  const indexNow = getCurrentIndex({ date, time: hourly.time });
  const indexDay = getCurrentIndex({ date, time: daily.time });

  const windGustsNow = hourly.wind_gusts_10m[indexNow];
  const windGustsDay = daily.wind_gusts_10m_mean[indexDay];

  const windSpeedNow = hourly.wind_speed_10m[indexNow];
  const windSpeedDay = daily.wind_speed_10m_mean[indexDay];

  const windDirectionNow = hourly.wind_direction_10m[indexNow];
  const windDirectionDay = daily.wind_direction_10m_dominant[indexDay];

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
      beaufort: beaufortNow,
      direction: !windCompassNow ? undefined : {
        name: t(`compass.${windCompassNow.name}`),
        src: `${ICON_BASE_URI}wind-direction-${windCompassNow.abbreviation.toLowerCase()}.svg`
      },
      gusts: {
        value: windGustsNow,
        unit: weather.hourly_units.wind_gusts_10m,
        color: windColor(windGustsNow, 'gusts'),
        desc: windGustsNowSummary
      },
      speed: {
        value: windSpeedNow,
        unit: weather.hourly_units.wind_speed_10m,
        color: windColor(windSpeedNow, 'speed'),
        desc: windSpeedNowSummary,
      },
    },
    day: {
      beaufort: beaufortDay,
      direction: !windCompassDay ? undefined : {
        name: t(`compass.${windCompassDay.name}`),
        src: `${ICON_BASE_URI}wind-direction-${windCompassDay.abbreviation.toLowerCase()}.svg`
      },
      gusts: {
        value: windGustsDay,
        unit: weather.daily_units.wind_gusts_10m_mean,
        color: windColor(windGustsDay, 'gusts'),
        desc: undefined
      },
      speed: {
        value: windSpeedDay,
        unit: weather.daily_units.wind_speed_10m_mean,
        color: windColor(windSpeedDay, 'speed'),
        desc: undefined,
      },
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

  const stops = type === "speed" ? WIND_SPEED_COLORS : WIND_GUSTS_COLORS;

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

function getWindSummary({ currentSpeed, averageSpeed, direction }: WindSummaryData, t: TFunction): string {
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