import { DateTime } from "luxon";
import { getMoonInfo } from "./getMoonInfo";
import { WeatherIconInfo } from "@/types/weather.types";
import { TFunction } from "i18next";
import getWeatherCodeInfo from "./getWeatherCodeInfo";

interface Props {
  weatherCode: number;
  isDay?: boolean;
  now: DateTime
  lat?: number;
  lon?: number;
  t: TFunction
}

export default function getWeatherIcon({
  weatherCode,
  lat,
  lon,
  isDay = true,
  now,
  t,
}: Props): WeatherIconInfo {

  const weatherCodeInfo = getWeatherCodeInfo(weatherCode, isDay, t);

  // typeof em vez de truthiness: latitude/longitude 0 são válidas.
  const moonInfo = typeof lat === 'number' && typeof lon === 'number'
    ? getMoonInfo(now, lat, lon)
    : undefined;

  let moon: undefined | { alt: string, src: string } = undefined;

  if (moonInfo) {
    moon = {
      alt: `${moonInfo.name} (${(moonInfo.phase * 100).toFixed(1)}%)`,
      src: moonInfo.iconSrc
    };
  }

  const hasMoon = !isDay && moonInfo?.isVisible && weatherCodeInfo.name === 'clear';

  return {
    moon,
    weather: {
      alt: weatherCodeInfo.title,
      src: weatherCodeInfo.iconSrc
    },
    current: {
      alt: `${weatherCodeInfo.title}${hasMoon && moon ? ` | Moon: ${moon.alt}` : ''}`,
      src: hasMoon && moon ? moon.src : weatherCodeInfo.iconSrc
    }
  };
}
