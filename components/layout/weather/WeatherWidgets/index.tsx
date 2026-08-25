import { useMemo, type JSX } from 'react';
import styles from './WeatherWidgets.module.scss';
import { useNow } from '@/contexts/NowContext';
import { IWeather } from '@/types/weather.types';
import { DetailCard } from '@/components/ui/DetailCard/DetailCard';
import ZoneGaugeBar from '@/components/ui/ZoneGaugeBar';
import useBoolean from '@/hooks/useBoolean';
import { useTranslation } from 'react-i18next';
import buildWeatherWidgetsData, { TWeatherWidgetsDataItem } from './buildWeatherWidgetsData';

interface Props {
  weather: IWeather;
}

export default function WeatherWidgets({ weather }: Props): JSX.Element | null {
  const { i18n: { language: locale } } = useTranslation();
  const { now } = useNow();
  const { t } = useTranslation();

  const data = useMemo(() => buildWeatherWidgetsData(weather, now, locale, t), [locale, now, t, weather]);

  return (
    <div className={styles.main}>
      {data.map((detailProps, i) => <DetailCardRender key={i} data={detailProps} />)}
    </div>
  );
}

const DetailCardRender = ({ data }: { data: TWeatherWidgetsDataItem }) => {
  const [gaugeShowing, { toggle: toggleGauge }] = useBoolean();

  const onClick = () => data.zoneGauge ? toggleGauge() : undefined;

  return (
    <DetailCard {...data} onClick={onClick}>
      {gaugeShowing && data.zoneGauge && <ZoneGaugeBar {...data.zoneGauge} />}
    </DetailCard>
  );
};
