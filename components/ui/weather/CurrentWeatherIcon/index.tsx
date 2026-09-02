import styles from './CurrentWeatherIcon.module.scss';
import { SunWindow } from '@/types/sun.types';
import { IWeather } from '@/types/weather.types';
import { isXMinBefore } from '@/utils/formatters/mathDateFormatters';
import WeatherIcon, { WeatherIconProps } from '../WeatherIcon';
import { Tooltip } from '../../Tooltip';
import { useNow } from '@/contexts/NowContext';
import { useTranslation } from 'react-i18next';
import useAppSettings from '@/contexts/AppSettingsContext';
import getWeatherCodeInfo from '@/utils/weather/getWeatherCodeInfo';

interface Props {
  weatherCode: number;
  sunWindow?: SunWindow;
  weather: IWeather | undefined
  isDay: boolean;
  size?: number;
}

export default function CurrentWeatherIcon({ weatherCode, sunWindow, isDay, weather, size = 160 }: Props) {
  const { now } = useNow();
  const { t } = useTranslation();
  const { get: { sunAlertThresholdMinutes } } = useAppSettings();

  const weatherCategory = getWeatherCodeInfo(weatherCode, true, t);

  const isBeforeSunRiseSet = !sunWindow ? false : isXMinBefore(now, sunWindow.end, sunAlertThresholdMinutes);

  const weatherIconProps: WeatherIconProps = {
    size,
    ...(weatherCategory.name === 'clear' && isBeforeSunRiseSet && sunWindow ? {
      category: sunWindow.endKind,

    } : weather ? {
      isDay,
      weatherCode,
      timezone: weather.timezone,
      lat: weather.latitude,
      lon: weather.longitude,

    } : weatherCode < 0 ? {
      weatherCode,

    } : {
      category: 'error'
    })
  };

  return (
    <div className={styles.iconStage}>
      <div className={styles.glow} aria-hidden="true" />
      <Tooltip content={weatherCategory.title}>
        <WeatherIcon {...weatherIconProps} />
      </Tooltip>
    </div>
  );
}
