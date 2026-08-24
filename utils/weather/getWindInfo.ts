import { IWeather } from "@/types/weather.types";
import { getCurrentIndex } from "../formatters/getValueByArray";
import getBeaufortScale from "../geo/getBeaufortScale";
import { getCompassDirection } from "../geo/getCompassDirection";
import { DateTime } from "luxon";
import { TFunction } from "i18next";
import { IWindInfo } from "@/types/weatherInfo.types";
import { getWindColor } from "./getColors";
import { createIconUrl } from "@/constants/iconFiles";

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

  const windCompassNow = windDirectionNow ? getCompassDirection(windDirectionNow, t) : undefined;
  const windCompassDay = windDirectionDay ? getCompassDirection(windDirectionDay, t) : undefined;

  const windSpeedNowSummary = windSpeedNow && windSpeedDay && windCompassNow ?
    getWindSummary({ currentSpeed: windSpeedNow, averageSpeed: windSpeedDay, direction: windCompassNow.title }, t)
    : undefined

  const windGustsNowSummary = windGustsNow && windGustsDay && windCompassNow ?
    getWindSummary({ currentSpeed: windGustsNow, averageSpeed: windGustsDay, direction: windCompassNow.title }, t)
    : undefined

  const beaufortNow = getBeaufortInfo(windSpeedNow)
  const beaufortDay = getBeaufortInfo(windSpeedDay)

  return {
    now: {
      beaufort: beaufortNow,
      direction: !windCompassNow ? undefined : {
        name: windCompassNow.title,
        src: windCompassNow.iconSrc
      },
      gusts: {
        value: windGustsNow,
        unit: weather.hourly_units.wind_gusts_10m,
        color: getWindColor(windGustsNow, 'gusts'),
        desc: windGustsNowSummary
      },
      speed: {
        value: windSpeedNow,
        unit: weather.hourly_units.wind_speed_10m,
        color: getWindColor(windSpeedNow, 'speed'),
        desc: windSpeedNowSummary,
      },
    },
    day: {
      beaufort: beaufortDay,
      direction: !windCompassDay ? undefined : {
        name: windCompassDay.title,
        src: windCompassDay.iconSrc
      },
      gusts: {
        value: windGustsDay,
        unit: weather.daily_units.wind_gusts_10m_mean,
        color: getWindColor(windGustsDay, 'gusts'),
        desc: undefined
      },
      speed: {
        value: windSpeedDay,
        unit: weather.daily_units.wind_speed_10m_mean,
        color: getWindColor(windSpeedDay, 'speed'),
        desc: undefined,
      },
    },
  };
}

export const getBeaufortInfo = (windSpeed: number | undefined) => {
  if (typeof windSpeed !== 'number') return undefined

  const value = getBeaufortScale(windSpeed).level;
  const src = createIconUrl(`wind-beaufort-${value}`);
  const duration = getWindGustAnimationDuration(windSpeed)

  return { src, value, duration }
}

export function getWindGustAnimationDuration(windGust: number): number {
  const MIN_GUST = 0;
  const MAX_GUST = 100;

  const MIN_DURATION = 1.5; // 100 km/h
  const MAX_DURATION = 15;  // 0 km/h

  const gust = Math.min(Math.max(windGust, MIN_GUST), MAX_GUST);

  const t = (gust - MIN_GUST) / (MAX_GUST - MIN_GUST);

  return MAX_DURATION - t * (MAX_DURATION - MIN_DURATION);
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

export function getWindSummary2(speed: number, gusts: number, windGustsUnit: string, compass: string, t: TFunction): string {
  let impact: string;

  if (speed < 10) {
    impact = t("windTextes.impact.calm");
  } else if (speed < 20) {
    impact = t("windTextes.impact.light");
  } else if (speed < 30) {
    impact = t("windTextes.impact.moderate");
  } else if (speed < 50) {
    impact = t("windTextes.impact.strong");
  } else {
    impact = t("windTextes.impact.veryStrong");
  }

  return `${t('windGusts')}: ${gusts} ${windGustsUnit}. ${t('wind')} ${t(compass)}. ${impact}`;
}