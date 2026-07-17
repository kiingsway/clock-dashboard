import { DateTime } from "luxon"
import { getWeatherIconFile } from "./getWeatherAnimatedIcon";
import getWeatherCategory from "./getWeatherCategory";
import { ICON_BASE_URI } from "./iconFiles";
import getMoonPhase from "./getMoonPhase";
import { splitCamelCase } from "../formatters";

interface Props {
  weatherCode: number;
  isDay: boolean;
  date: DateTime
  lat?: number;
  lon?: number;
}

type WeatherIconInfo = Record<'moon' | 'weather' | 'current', { alt: string, src: string }>;

export default function getWeatherIcon({ weatherCode, isDay, date, lat, lon }: Props): WeatherIconInfo {

  const category = getWeatherCategory(weatherCode)
  const currentWeatherIcon = getWeatherIconFile(category, isDay)
  const weatherIconSrc = `${ICON_BASE_URI}${currentWeatherIcon}.svg`
  const weatherTitle = splitCamelCase(category)

  const moonPhase = getMoonPhase({ date, lat, lon })

  const hasMoon = !isDay && moonPhase.isVisible && (weatherCode >= 0 && weatherCode <= 2);

  const moonAlt = `${moonPhase.title} (${(moonPhase.phase * 100).toFixed(1)}%)`

  return {
    moon: {
      alt: moonAlt,
      src: moonPhase.iconSrc
    },
    weather: {
      alt: weatherTitle,
      src: weatherIconSrc
    },
    current: {
      alt: `${weatherTitle}${hasMoon ? ` | Moon: ${moonAlt}` : ''}`,
      src: hasMoon ? moonPhase.iconSrc : weatherIconSrc
    }
  }
}
