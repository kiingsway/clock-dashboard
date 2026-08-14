import { DateTime } from 'luxon';
import styles from './CurrentWeatherIcon.module.scss';
import getWeatherCategory from '@/utils/weather/getWeatherCategory';
import { SunWindow } from '@/types/sun.types';
import { IWeather, IWeatherCurrent } from '@/types/weather.types';
import { isXMinBefore } from '@/utils/formatters/mathDateFormatters';
import WeatherIcon, { WeatherIconProps } from '../WeatherIcon';

interface Props {
  current: IWeatherCurrent;
  sunWindow?: SunWindow;
  weather: IWeather | undefined
  isDay: boolean;
  now: Date
  size?: number;
}

export default function CurrentWeatherIcon({ current, sunWindow, now, isDay, weather, size = 160 }: Props) {

  const weatherCategory = getWeatherCategory(current.weather_code);
  const isBeforeSunRiseSet = !sunWindow ? false : isXMinBefore(DateTime.fromJSDate(now), sunWindow.end, 30);

  const weatherIconProps: WeatherIconProps = {
    size,
    ...(weatherCategory.name === 'clear' && isBeforeSunRiseSet && sunWindow ? {
      category: sunWindow.endKind,

    } : weather ? {
      isDay,
      weatherCode: current.weather_code,
      timezone: weather.timezone,
      lat: weather.latitude,
      lon: weather.longitude,

    } : current.weather_code < 0 ? {
      weatherCode: current.weather_code,

    } : {
      category: 'error'
    })
  }

  return (
    <div className={styles.iconStage}>
      <div className={styles.glow} aria-hidden="true" />
      <WeatherIcon {...weatherIconProps} />
    </div>
  )
}
