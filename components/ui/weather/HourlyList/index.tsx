import { useTranslation } from 'react-i18next';
import HourlyCard from '../HourlyCard';
import styles from './HourlyList.module.scss';
import { getLocaleHour } from '@/utils/formatters/dateFormatters';
import { RainGauge } from '../RainGauge';
import WeatherIcon from '../WeatherIcon';
import { DateTime } from 'luxon';
import { getAccent } from '@/utils/weather/getAccentColor';
import { getRainColor } from '@/utils/weather/getRainIntensityLabel';
import getWeatherCategory from '@/utils/weather/getWeatherCategory';
import { useNow } from '@/contexts/NowContext';
import { IWeather } from '@/types/weather.types';

interface Props {
  startIndex: number;
  weather: IWeather;
  hoursToShow?: number;
}

export default function HourlyList({ startIndex, weather, hoursToShow = 24 }: Props) {
  const { t, i18n: { language: locale } } = useTranslation();
  const { now } = useNow();

  const {
    timezone, latitude, longitude,
    hourly: {
      time: times,
      weather_code: weatherCodes,
      temperature_2m: temps,
      apparent_temperature: feelsLikes,
      precipitation: precipitations,
      is_day: isDays
    },
    hourly_units: {
      temperature_2m: tempUnit,
      apparent_temperature: feelsLikeUnit
    }
  } = weather;

  const indexes = startIndex === -1 ? []
    : Array.from(
      {
        length: Math.min(
          hoursToShow || times.length,
          times.length - startIndex
        ),
      },
      (_, index) => startIndex + index
    );

  return (
    <ul className={styles.scroller}>
      {indexes.map((index) => {
        const indexDateString = times[index];

        const indexDate = DateTime.fromISO(indexDateString, { zone: timezone });

        const weatherCode = weatherCodes[index];
        const temp = Math.round(temps[index]);
        const feelsLike = Math.round(feelsLikes[index]);
        const precip = precipitations[index];
        const isDay = isDays[index] === 1;

        const category = getWeatherCategory(weatherCode);
        const accent = getAccent({ category, isDay });
        const accentPeak = getRainColor(precip);

        const difference = indexDate
          .startOf('day')
          .diff(now.startOf('day'), 'days')
          .days;
        const subhour = `+${difference}`;

        const minDiff = indexDate.diff(now, 'minutes').minutes;
        const within20Minutes = Math.abs(minDiff) <= 25;

        return (
          <HourlyCard
            key={indexDateString}
            as="li"
            hour={within20Minutes
              ? t('now')
              : getLocaleHour(indexDate, locale)}
            subhour={subhour}
            hideSubhour={difference < 1}
            hourTooltip={indexDate.toFormat('dd/LL/yyyy HH:mm')}
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
                isDay={isDay}
                lat={latitude}
                lon={longitude}
                size={40}
              />
            }
          />
        );
      })}
    </ul>
  );
}
