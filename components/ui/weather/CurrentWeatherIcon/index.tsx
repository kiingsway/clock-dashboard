import styles from './CurrentWeatherIcon.module.scss';
import getWeatherCategory from '@/utils/weather/getWeatherCategory';
import { SunWindow } from '@/types/sun.types';
import { IWeather } from '@/types/weather.types';
import { isXMinBefore } from '@/utils/formatters/mathDateFormatters';
import WeatherIcon, { WeatherIconProps } from '../WeatherIcon';
import { Tooltip } from '../../Tooltip';
import { useNow } from '@/contexts/NowContext';

interface Props {
  weatherCode: number;
  sunWindow?: SunWindow;
  weather: IWeather | undefined
  isDay: boolean;
  size?: number;
}

export default function CurrentWeatherIcon({ weatherCode, sunWindow, isDay, weather, size = 160 }: Props) {
  const { now } = useNow();

  const weatherCategory = getWeatherCategory(weatherCode);
  const isBeforeSunRiseSet = !sunWindow ? false : isXMinBefore(now, sunWindow.end, 30);

  const weatherIconProps: WeatherIconProps = {
    size,
    ...(weatherCategory.name === 'clear' && isBeforeSunRiseSet && sunWindow ? {
      category: sunWindow.endKind,

    } : weather ? {
      isDay,
      weatherCode: weatherCode,
      timezone: weather.timezone,
      lat: weather.latitude,
      lon: weather.longitude,

    } : weatherCode < 0 ? {
      weatherCode: weatherCode,

    } : {
      category: 'error'
    })
  }

  return (
    <div className={styles.iconStage}>
      <div className={styles.glow} aria-hidden="true" />
      <Tooltip content={weatherCategory.title}>
        <WeatherIcon {...weatherIconProps} />
      </Tooltip>
    </div>
  )
}
