import { useTranslation } from 'react-i18next';
import HourlyCard from '../HourlyCard';
import styles from './HourlyList.module.scss';
import { formatHourLabel } from '@/utils/formatters/dateFormatters';
import { RainGauge } from '../RainGauge';
import WeatherIcon from '../WeatherIcon';
import { DateTime } from 'luxon';
import { getAccent } from '@/utils/weather/getAccentColor';
import { getRainColor } from '@/utils/weather/getRainIntensityLabel';
import getWeatherCategory from '@/utils/weather/getWeatherCategory';
import { isXMinBefore } from '@/utils/formatters/mathDateFormatters';

interface Props {
  // date: DateTime
  startIndex: number;
  times: string[];
  weatherCodes: number[];
  temps: number[];
  tempUnit: string;
  feelsLikes: number[];
  feelsLikeUnit: string;
  precipitations: number[];
  isDays: number[];
  latitude: number
  longitude: number
  timezone: string;
  hoursToShow?: number;
}

export default function HourlyList({
  // date,
  startIndex,
  times,
  weatherCodes,
  isDays,
  temps,
  tempUnit,
  feelsLikes,
  feelsLikeUnit,
  precipitations,
  latitude,
  longitude,
  timezone,
  hoursToShow = 24,
}: Props) {
  const { t, i18n: { language: locale } } = useTranslation();
  // const targetDate = date.setZone(timezone).startOf('day');

  const now = DateTime.now().setZone(timezone);

  // const startIndex = times.findIndex((time) => {
  //   const dateTime = DateTime.fromISO(time, { zone: timezone });

  //   return dateTime.hasSame(targetDate, 'day');
  // });

  const indexes =
    startIndex === -1
      ? []
      : Array.from(
        {
          length: Math.min(
            hoursToShow || times.length,
            times.length - startIndex
          ),
        },
        (_, index) => startIndex + index
      );

  const onDebugClick = (): void => console.log('Hourly List: ', {
    startIndex,
    rawTimes: times,
    dateTimes: times.map(time => DateTime.fromISO(time).toFormat('dd/LL/yy HH:mm'))
  })

  return (
    <ul className={styles.scroller} onDoubleClick={onDebugClick}>
      {indexes.map((index) => {
        const time = times[index];

        const dateTime = DateTime.fromISO(time, { zone: timezone, });

        const weatherCode = weatherCodes[index];
        const temp = Math.round(temps[index]);
        const feelsLike = Math.round(feelsLikes[index]);
        const precip = precipitations[index];
        const isDay = isDays[index] === 1;

        const category = getWeatherCategory(weatherCode);
        const accent = getAccent({ category, isDay });
        const accentPeak = getRainColor(precip);

        return (
          <HourlyCard
            key={time}
            as="li"
            hour={isXMinBefore(now, dateTime, 15)
              ? t('now')
              : formatHourLabel(dateTime, locale)}
            hourTooltip={dateTime.toFormat('dd/LL/yyyy HH:mm')}
            temp={temp}
            tempUnit={tempUnit}
            feelsLike={feelsLike}
            feelsLikeUnit={feelsLikeUnit}
            accent={accent}
            accentPeak={accentPeak}
            desc={<RainGauge mm={precip} />}
            icon={
              <WeatherIcon
                weatherCode={weatherCode}
                date={dateTime}
                isDay={isDay}
                lat={latitude}
                lon={longitude}
                size={34}
              />
            }
          />
        );
      })}
    </ul>
  );
}
