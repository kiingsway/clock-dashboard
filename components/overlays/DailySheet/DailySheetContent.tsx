import MiniCard from '@/components/ui/MiniCard';
import HourlyList from '@/components/ui/weather/HourlyList';
import MoonProgressBar from '@/components/ui/weather/MoonProgressBar';
import SunProgressBar from '@/components/ui/weather/SunProgressBar';
import { Fragment, useMemo } from 'react';
import styles from './DailySheet.module.scss';
import { IWeather } from '@/types/weather.types';
import { useNow } from '@/contexts/NowContext';
import { getAccent } from '@/utils/weather/getAccentColor';
import { getSunWindow } from '@/utils/weather/getSunWindow';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import buildDailySheetInfo from './buildDailySheetInfo';
import WeatherIcon from '@/components/ui/weather/WeatherIcon';

interface Props {
  weather: IWeather;
  index: number;
}

export default function DailySheetContent({ weather, index }: Props) {
  const { t, i18n: { language: locale } } = useTranslation();
  const { now } = useNow();

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

  const accent = getAccent({ weatherCode, t });

  const dailySheetInfo = useMemo(() => buildDailySheetInfo(weather, indexDate, locale, t), [indexDate, locale, t, weather]);

  return (
    <div className={styles.main} style={{ ["--wc-accent" as string]: accent }}>
      {sunWindow && <SunProgressBar sunWindow={sunWindow} />}
      {dailySheetInfo.map(({ key, title, desc, icons }, index) => {

        const iconsProps = icons.length > 1
          ? icons.map((icon, i) => <WeatherIcon key={i} {...icon} size={60} />)
          : undefined;

        const iconProps = icons.length === 1
          ? <WeatherIcon {...icons[0]} size={60} />
          : undefined;

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
        );
      })}
    </div>
  );
}