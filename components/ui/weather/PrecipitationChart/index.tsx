import { useNow } from '@/contexts/NowContext';
import styles from './PrecipitationChart.module.scss';
import { useTranslation } from 'react-i18next';
import { IWeather } from '@/types/weather.types';
import useAppSettings from '@/contexts/AppSettingsContext';
import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import buildPrecipChart from './buildPrecipChart';

const CHART_HEIGHT = 100;

// recharts é pesado e o gráfico só aparece quando há precipitação prevista.
const PrecipStackedAreaChart = dynamic(() => import('./PrecipitationAreaChart'), {
  loading: () => <div style={{ height: CHART_HEIGHT }} />,
});

export type TPrecipAreas = "rain" | "showers" | "snowfall";
export const precipitationAreas: TPrecipAreas[] = ["snowfall", "rain", "showers"];

interface Props {
  weather: IWeather;
}

export default function PrecipitationChart({ weather: { current, hourly } }: Props) {
  const { i18n: { language } } = useTranslation();
  const { get: { precipHoursRange, is12hour } } = useAppSettings();
  const { now } = useNow();

  const { filteredData, lastPrecipitationIndex } = useMemo(() => buildPrecipChart(current, hourly, now, { is12hour, language, precipHoursRange }), [current, hourly, is12hour, language, now, precipHoursRange]);

  if (lastPrecipitationIndex < 0) return null;

  const onDebugClick = () => console.info('Chart Data', { times: hourly.time, filteredData, precipHoursRange });

  return (
    <div onDoubleClick={onDebugClick} className={styles.main}>
      <PrecipStackedAreaChart data={filteredData} hoursAhead={filteredData.length} height={CHART_HEIGHT} />
    </div>
  );
}