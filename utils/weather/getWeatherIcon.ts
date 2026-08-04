import { DateTime } from "luxon"
import getWeatherCategory from "./getWeatherCategory";
import getMoonPhase from "./getMoonPhase";
import { getWeatherIconUrl } from "./getWeatherIconName";

interface Props {
  weatherCode: number;
  isDay?: boolean;
  date?: DateTime
  lat?: number;
  lon?: number;
}

export type WeatherIconInfo = Record<'moon' | 'weather' | 'current', { alt: string, src: string }>;

export default function getWeatherIcon({
  weatherCode,
  lat,
  lon,
  isDay = true,
  date = DateTime.now(),
}: Props): WeatherIconInfo {

  const category = getWeatherCategory(weatherCode)
  const weatherIconSrc = getWeatherIconUrl({ category, isDay })

  const moonPhase = getMoonPhase({ date, lat, lon })

  const hasMoon = !isDay && moonPhase.isVisible && (weatherCode >= 0 && weatherCode <= 2);

  const moonAlt = `${moonPhase.title} (${(moonPhase.phase * 100).toFixed(1)}%)`

  return {
    moon: {
      alt: moonAlt,
      src: moonPhase.iconSrc
    },
    weather: {
      alt: category.title,
      src: weatherIconSrc
    },
    current: {
      alt: `${category.title}${hasMoon ? ` | Moon: ${moonAlt}` : ''}`,
      src: hasMoon ? moonPhase.iconSrc : weatherIconSrc
    }
  }
}
