import { useTranslation } from 'react-i18next';
import HourlyCard from '../HourlyCard';
import styles from './HourlyList.module.scss';
import { DateTime } from 'luxon';
import { useNow } from '@/contexts/NowContext';
import { IWeather } from '@/types/weather.types';
import { getCurrentIndex } from '@/utils/formatters/getValueByArray';
import { useMemo } from 'react';
import buildHourlyListData from './buildHourlyListData';

interface Props {
  date: DateTime;
  weather: IWeather;
  hoursAhead?: number;
  kind: 'day' | 'now';
}

export default function HourlyList({ date, weather, hoursAhead = 24, kind = 'now' }: Props) {
  const { t, i18n: { language: locale } } = useTranslation();
  const { now } = useNow();

  const startIndex = getCurrentIndex({ date, time: weather.hourly.time }) + (kind === 'now' ? 1 : 0);

  const data = useMemo(() =>
    buildHourlyListData({ startIndex, weather, hoursAhead, kind, locale, now, t }),
    [hoursAhead, kind, locale, now, startIndex, t, weather]);

  return (
    <ul className={styles.scroller}>
      {data.map(cardProps => <HourlyCard key={cardProps.hourTooltip} {...cardProps} />)}
    </ul>
  );
}
