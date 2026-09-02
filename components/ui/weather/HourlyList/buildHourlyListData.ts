import { IWeather } from '@/types/weather.types';
import { getLocaleHour, formatDateTime } from '@/utils/formatters/dateFormatters';
import { TFunction } from 'i18next';
import { DateTime } from 'luxon';
import { HourlyCardProps } from '../HourlyCard';
import { getRainColor } from '@/utils/weather/getColors';
import getWeatherCodeInfo from '@/utils/weather/getWeatherCodeInfo';

interface Props {
  weather: IWeather;
  startIndex: number;
  hoursAhead: number;
  kind: 'day' | 'now';
  now: DateTime;
  locale: string;
  t: TFunction
}

export default function buildHourlyListData({ startIndex, weather, hoursAhead, now, locale, kind, t }: Props): HourlyCardProps[] {

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
          hoursAhead || times.length,
          times.length - startIndex
        ),
      },
      (_, index) => startIndex + index
    );

  return indexes.map((index) => {
    const indexDateString = times[index];

    const indexDate = DateTime.fromISO(indexDateString, { zone: timezone });

    const weatherCode = weatherCodes[index];
    const temp = Math.round(temps[index]);
    const feelsLike = Math.round(feelsLikes[index]);
    const precipitation = precipitations[index];
    const isDay = isDays[index] === 1;

    const { accent, title: categoryTitle } = getWeatherCodeInfo(weatherCode, isDay, t);
    const accentPeak = getRainColor(precipitation);

    const minDiff = indexDate.diff(now, 'minutes').minutes;
    const daysDiff = kind === 'now' ? minDiff / 1440 : indexDate.startOf('day').diff(now.startOf('day'), 'days').days;

    const hour = Math.abs(minDiff) <= 25 ? t('now') : getLocaleHour(indexDate, locale);

    return {
      hour,
      subhour: `+${Math.floor(daysDiff)}`,
      hideSubhour: daysDiff < 1,
      hourTooltip: formatDateTime({ date: indexDate.toJSDate(), locale, timezone }),
      temp,
      tempUnit,
      feelsLike,
      feelsLikeUnit,
      accent,
      accentPeak,
      precipitation,
      icon: { weatherCode, isDay, lat: latitude, lon: longitude, title: categoryTitle },
    };
  });
}
