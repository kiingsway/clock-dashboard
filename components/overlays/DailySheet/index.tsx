import { BottomSheet } from '@/components/ui/BottomSheet';
import { usePortalContainer } from '@/hooks/usePortalContainer';
import { IWeather } from '@/types/weather.types';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import styles from './DailySheet.module.scss';
import { getSunWindow } from '@/utils/weather/getSunWindow';
import SunProgressBar from '@/components/ui/weather/SunProgressBar';
import HourlyList from '@/components/ui/weather/HourlyList';
import MoonProgressBar from '@/components/ui/weather/MoonProgressBar';
import { useNow } from '@/contexts/NowContext';
import { TFunction } from 'i18next';
import { capitalizeWords } from '@/utils/formatters/textFormatters';
import { getAccent } from '@/utils/weather/getAccentColor';
import { Fragment, JSX } from 'react';
import WeatherIcon from '@/components/ui/weather/WeatherIcon';
import MiniCard from '@/components/ui/MiniCard';
import buildDailySheetInfo from './buildDailySheetInfo';

interface Props {
  weather: IWeather | undefined
  open: boolean;
  index: number | undefined;
  onClose: () => void;
}

export default function DailySheet({ weather, open, index, onClose }: Props): JSX.Element | null {
  const { t, i18n: { language: locale } } = useTranslation();
  const { now } = useNow();
  const portalContainer = usePortalContainer();

  if (typeof index !== 'number' || !weather) return null;

  const { daily, timezone } = weather;

  const iso = daily.time[index];
  const weatherCode = daily.weather_code[index];

  const indexDate = DateTime.fromISO(iso, { zone: timezone });
  const indexDateWithCurrentTime = now.set({
    year: indexDate.year,
    month: indexDate.month,
    day: indexDate.day,
  });

  const isToday = indexDate.hasSame(now, "day");
  const sunDate = isToday ? indexDateWithCurrentTime : indexDate;

  const sunWindow = getSunWindow({
    sunriseTimes: daily.sunrise,
    sunsetTimes: daily.sunset,
    timezone,
    date: sunDate
  });

  const title = getForecastTitle(now, indexDate, locale, t);

  const accent = getAccent({ weatherCode, t });

  const dailySheetInfo = buildDailySheetInfo(weather, indexDate, locale, t);

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
      <div className={styles.main} style={{ ["--wc-accent" as string]: accent }}>
        {sunWindow && <SunProgressBar sunWindow={sunWindow} />}
        {dailySheetInfo.map(({ key, title, desc, icons }, index) => {

          const iconsProps = icons.length > 1
            ? icons.map((icon, i) => <WeatherIcon key={i} {...icon} size={60} />)
            : undefined;

          const iconProps = icons.length === 1
            ? <WeatherIcon {...icons[0]} size={60} />
            : undefined

          return (
            <Fragment key={key}>
              <MiniCard
                title={title}
                desc={desc}
                icons={iconsProps}
                icon={iconProps}
              />

              {index === 2 && (
                <HourlyList
                  date={indexDate}
                  weather={weather}
                  kind="day"
                />
              )}

              {index === 4 && (
                <MoonProgressBar
                  date={indexDate}
                  dailyMoon={weather.daily_moon}
                  timezone={weather.timezone}
                />
              )}
            </Fragment>
          )
        })}
      </div>
    </BottomSheet>
  )
}

function getForecastTitle(now: DateTime, date: DateTime, locale = "en-US", t: TFunction): string {
  const diffDays = Math.floor(date.startOf('day').diff(now.startOf('day'), "days").days);

  const isYesterday = diffDays === -1;
  const isToday = diffDays === 0;
  const isTomorrow = diffDays === 1;

  const formattedDate = date.setLocale(locale).toFormat("cccc, LLLL d");

  if (isYesterday) return `${capitalizeWords(t('yesterday'))} — ${formattedDate}`;
  if (isToday) return `${capitalizeWords(t('today'))} — ${formattedDate}`;
  if (isTomorrow) return `${capitalizeWords(t('tomorrow'))} — ${formattedDate}`;

  return formattedDate;
}