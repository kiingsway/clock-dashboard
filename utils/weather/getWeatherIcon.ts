import { DateTime } from "luxon"
import getWeatherCategory from "./getWeatherCategory";
import { getWeatherIconUrl } from "./getWeatherIconName";
import getMoonInfo from "./getMoonInfo";
import { WeatherIconInfo } from "@/types/weather.types";

interface Props {
  weatherCode: number;
  timezone: string;
  isDay?: boolean;
  now: DateTime
  date?: DateTime
  lat?: number;
  lon?: number;
}

export default function getWeatherIcon({
  weatherCode,
  lat,
  lon,
  isDay = true,
  now,
}: Props): WeatherIconInfo {

  const category = getWeatherCategory(weatherCode)
  const weatherIconSrc = getWeatherIconUrl({ category, isDay });

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
