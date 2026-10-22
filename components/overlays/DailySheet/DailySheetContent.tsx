import MiniCard from '@/components/ui/MiniCard';
import HourlyList from '@/components/ui/weather/HourlyList';
import { CSSProperties, Fragment, useMemo } from 'react';
import styles from './DailySheet.module.scss';
import { IWeather } from '@/types/weather.types';
import { useToday } from '@/contexts/NowContext';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import buildDailySheetInfo from './buildDailySheetInfo';
import WeatherIcon from '@/components/ui/weather/WeatherIcon';
import getWeatherCodeInfo from '@/utils/weather/getWeatherCodeInfo';
import EventChartProgress from '@/components/ui/weather/EventChartProgress';

interface Props {
  weather: IWeather;
  index: number;
  style?: CSSProperties;
}

export default function DailySheetContent({ weather, index, style: styleProp }: Props) {
  const { t, i18n: { language: locale } } = useTranslation();
  const today = useToday();

  const { daily, hourly, timezone } = weather;

  const iso = daily.time[index];
  const weatherCode = daily.weather_code[index];

  const indexDate = DateTime.fromISO(iso, { zone: timezone });

  const { accent } = getWeatherCodeInfo(weatherCode, true, t);

  const dailySheetInfo = useMemo(() => buildDailySheetInfo(weather, indexDate, locale, t), [indexDate, locale, t, weather]);

  const style = {
    ...styleProp,
    "--wc-accent": accent,
  } as CSSProperties;

  return (
    <div className={styles.main} style={style}>

      <EventChartProgress
        fullDay
        date={indexDate}
        daily={daily}
        hourly={hourly}
        timezone={weather?.timezone ?? today.zoneName ?? ""}
        latitude={weather?.latitude ?? 0}
        longitude={weather?.longitude ?? 0}
      />

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
              <EventChartProgress
                fullDay
                body='moon'
                date={indexDate}
                timezone={weather?.timezone ?? today.zoneName ?? ""}
                latitude={weather?.latitude ?? 0}
                longitude={weather?.longitude ?? 0}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}