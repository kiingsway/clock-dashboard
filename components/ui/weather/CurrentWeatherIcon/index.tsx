import { DateTime } from 'luxon';
import styles from './CurrentWeatherIcon.module.scss';
import getWeatherCategory from '@/utils/weather/getWeatherCategory';
import { SunWindow } from '@/types/sun.types';
import { IWeather, IWeatherCurrent } from '@/types/weather.types';
import { isXMinBefore } from '@/utils/formatters/mathDateFormatters';
import WeatherIcon from '../WeatherIcon';

interface Props {
  current: IWeatherCurrent;
  sunWindow: SunWindow;
  weather: IWeather | undefined
  isDay: boolean;
  now: Date
  size?: number;
}

export default function CurrentWeatherIcon({ current, sunWindow, now, isDay, weather, size = 160 }: Props) {

  const weatherCategory = getWeatherCategory(current.weather_code);
  const isBeforeSunRiseSet = isXMinBefore(DateTime.fromJSDate(now), sunWindow.end, 30);

  return (
    <div className={styles.iconStage}>
      <div className={styles.glow} aria-hidden="true" />
      {weatherCategory.name === 'clear' && isBeforeSunRiseSet ? (
        <WeatherIcon
          category={sunWindow.endKind}
          size={size}
        />
      ) : (
        <WeatherIcon
          weatherCode={current.weather_code}
          date={DateTime.now()}
          isDay={isDay}
          lat={weather?.latitude}
          lon={weather?.longitude}
          size={size}
        />
      )}
    </div>
  )
}
