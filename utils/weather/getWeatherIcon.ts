import { DateTime } from "luxon"
import getWeatherCategory from "./getWeatherCategory";
import getWeatherIconName from "./getWeatherIconName";
import getMoonInfo from "./getMoonInfo";
import { WeatherIconInfo } from "@/types/weather.types";
import { TFunction } from "i18next";
import { createIconUrl } from "@/constants/iconFiles";

interface Props {
  weatherCode: number;
  timezone: string;
  isDay?: boolean;
  now: DateTime
  date?: DateTime
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

  const category = getWeatherCategory(weatherCode, t)
  const weatherIconSrc = createIconUrl(getWeatherIconName(category, isDay));

  const moonInfo = lat && lon ? getMoonInfo({ now, lat, lon }) : undefined;

  let moon: undefined | { alt: string, src: string } = undefined;

  if (moonInfo) {
    moon = {
      alt: `${moonInfo.name} (${(moonInfo.phase * 100).toFixed(1)}%)`,
      src: moonInfo.iconSrc
    }
  }

  const hasMoon = !isDay && moonInfo?.isVisible && (weatherCode >= 0 && weatherCode <= 2);

  return {
    moon,
    weather: {
      alt: category.title,
      src: weatherIconSrc
    },
    current: {
      alt: `${category.title}${hasMoon && moon ? ` | Moon: ${moon.alt}` : ''}`,
      src: hasMoon && moon ? moon.src : weatherIconSrc
    }
  }
}
