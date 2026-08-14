import { BottomSheet } from '@/components/ui/BottomSheet';
import { usePortalContainer } from '@/hooks/usePortalContainer';
import { IWeather } from '@/types/weather.types';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import styles from './DailySheet.module.scss';
import { getSunWindow } from '@/utils/weather/getSunWindow';
import SunProgressBar from '@/components/ui/weather/SunProgressBar';
import MoonWidget from '@/components/ui/weather/widgets/MoonWidget';
import TempFeelsLikeWidget from '@/components/ui/weather/widgets/TempFeelsLikeWidget';
import RainWidget from '@/components/ui/weather/widgets/RainWidget';
import UVIndexWidget from '@/components/ui/weather/widgets/UVIndex';
import WindWidget from '@/components/ui/weather/widgets/WindWidget';
import CurrentWeatherWidget from '@/components/ui/weather/widgets/CurrentWeatherWidget';
import HourlyList from '@/components/ui/weather/HourlyList';
import MoonProgressBar from '@/components/ui/weather/MoonProgressBar';
import getMoonInfo from '@/utils/weather/getMoonInfo';
import { useNow } from '@/contexts/NowContext';
import { TFunction } from 'i18next';
import { capitalizeWords } from '@/utils/formatters/textFormatters';
import VisibilityWidget from '@/components/ui/weather/widgets/VisibilityWidget';

interface Props {
  weather: IWeather | undefined
  open: boolean;
  index: number | undefined;
  onClose: () => void;
}

export default function DailySheet({ weather, open, index, onClose }: Props) {
  const { t, i18n: { language: locale } } = useTranslation();
  const { now } = useNow();
  const portalContainer = usePortalContainer();

  if (typeof index !== 'number' || !weather) return null;

  const { daily, timezone } = weather;

  const iso = daily.time[index];
  const weatherCode = daily.weather_code[index];
  const feelsLike = daily.apparent_temperature_mean[index];
  const tempMean = daily.temperature_2m_mean[index];
  const tempMax = daily.temperature_2m_max[index];
  const tempMin = daily.temperature_2m_min[index];
  const precipHours = daily.precipitation_hours[index];
  const precipSum = daily.precipitation_sum[index];
  const precipChance = daily.precipitation_probability_max[index];

  const indexDate = DateTime.fromISO(iso, { zone: timezone });
  const indexDateWithCurrentTime = now.set({
    year: indexDate.year,
    month: indexDate.month,
    day: indexDate.day,
  });

  const isToday = indexDate.hasSame(now, "day");
  const sunDate = isToday ? indexDateWithCurrentTime : indexDate

  const sunWindow = getSunWindow({
    sunriseTimes: daily.sunrise,
    sunsetTimes: daily.sunset,
    timezone,
    date: sunDate
  });

  const title = getForecastTitle(now, indexDate, locale, t);

  const startIndex = weather.hourly.time.findIndex((time) => {
    const dateTime = DateTime.fromISO(time, { zone: timezone });
    return dateTime.hasSame(indexDate, 'day');
  });

  const moonInfo = getMoonInfo({
    now,
    date: indexDate,
    lat: weather.latitude,
    lon: weather.longitude,
    dailyMoon: weather.daily_moon,
  });

  return (
    <BottomSheet
      open={open && typeof index === 'number'}
      onClose={onClose}
      title={title}
      ariaLabel={t('close')}
      snapPoints={[0.7, 0.95]}
      initialSnap={0}
      dismissible
      container={portalContainer}
    >
      <div className={styles.main} style={{ marginBottom: 40 }}>
        {sunWindow && <SunProgressBar sunWindow={sunWindow} />}

        <CurrentWeatherWidget weatherCode={weatherCode} tempMin={tempMin} tempMax={tempMax} size={60} />
        <TempFeelsLikeWidget feelsLike={feelsLike} tempMean={tempMean} size={60} />
        <RainWidget precipMM={precipSum} chance={precipChance} hoursOfRain={precipHours} size={60} />

        <HourlyList
          startIndex={startIndex}
          times={weather.hourly.time}
          weatherCodes={weather.hourly.weather_code}
          temps={weather.hourly.temperature_2m}
          tempUnit={weather.hourly_units.temperature_2m}
          feelsLikes={weather.hourly.apparent_temperature}
          feelsLikeUnit={weather.hourly_units.apparent_temperature}
          precipitations={weather.hourly.precipitation}
          isDays={weather.hourly.is_day}
          latitude={weather.latitude}
          longitude={weather.longitude}
          timezone={weather.timezone}
        />

        <MoonWidget moonInfo={moonInfo} size={60} miniCard />
        <MoonProgressBar moonInfo={moonInfo} moonIconName={moonInfo.iconName} />

        <UVIndexWidget date={indexDate} weather={weather} size={60} miniCard kind='day' />
        <WindWidget date={indexDate} weather={weather} size={60} miniCard />

        <VisibilityWidget date={indexDate} weather={weather} size={60} miniCard />
      </div>
    </BottomSheet>
  )
}

function getForecastTitle(now: DateTime, date: DateTime, locale = "en-US", t: TFunction): string {
  const isToday = date.hasSame(now, "day");
  const isTomorrow = date.hasSame(now.plus({ days: 1 }), "day");

  const formattedDate = date
    .setLocale(locale)
    .toFormat("cccc, LLLL d");

  if (isToday) return `${capitalizeWords(t('today'))} — ${formattedDate}`;
  if (isTomorrow) return `${capitalizeWords(t('tomorrow'))} — ${formattedDate}`;

  return formattedDate;
}