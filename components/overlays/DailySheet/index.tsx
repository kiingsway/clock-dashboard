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

interface Props {
  weather: IWeather | undefined
  open: boolean;
  index: number | undefined;
  onClose: () => void;
}

export default function DailySheet({ weather, open, index, onClose }: Props) {
  const { t, i18n: { language: locale } } = useTranslation();
  const portalContainer = usePortalContainer();

  if (typeof index !== 'number' || !weather) return null;

  const { daily, timezone, latitude, longitude } = weather;

  const iso = daily.time[index];
  const feelsLike = daily.apparent_temperature_mean[index];
  const tempMean = daily.temperature_2m_mean[index];
  const tempMax = daily.temperature_2m_max[index];
  const tempMin = daily.temperature_2m_min[index];
  const precipHours = daily.precipitation_hours[index];
  const precipSum = daily.precipitation_sum[index];
  const precipChance = daily.precipitation_probability_max[index];

  const indexDate = DateTime.fromISO(iso, { zone: timezone });
  const indexDateWithCurrentTime = DateTime.now().set({
    year: indexDate.year,
    month: indexDate.month,
    day: indexDate.day,
  });

  const sunWindow = getSunWindow(daily.sunrise, daily.sunset, timezone, indexDateWithCurrentTime.toISO());

  const title = getForecastTitle(indexDate, locale);

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
      <div className={styles.main}>
        <SunProgressBar sunWindow={sunWindow} />

        <TempFeelsLikeWidget tempMin={tempMin} tempMax={tempMax} feelsLike={feelsLike} tempMean={tempMean} size={60} />
        <RainWidget precipMM={precipSum} chance={precipChance} hoursOfRain={precipHours} size={60} />
        <MoonWidget date={indexDate} lat={latitude} lon={longitude} size={60} miniCard />
        <UVIndexWidget date={indexDate} weather={weather} size={60} miniCard />
        <WindWidget date={indexDate} weather={weather} size={60} miniCard />
      </div>
    </BottomSheet>
  )
}

function getForecastTitle(date: DateTime, locale = "en-US"): string {
  const now = DateTime.now().setZone(date.zone);

  const isToday = date.hasSame(now, "day");
  const isTomorrow = date.hasSame(now.plus({ days: 1 }), "day");

  const formattedDate = date
    .setLocale(locale)
    .toFormat("cccc, LLLL d");

  if (isToday) return `Today — ${formattedDate}`;
  if (isTomorrow) return `Tomorrow — ${formattedDate}`;

  return formattedDate;
}