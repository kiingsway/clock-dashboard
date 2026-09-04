import { useNow } from '@/contexts/NowContext';
import { getCurrentIndex } from '@/utils/formatters/getValueByArray';
import { DateTime } from 'luxon';
import styles from './PrecipitationChart.module.scss';
import { useTranslation } from 'react-i18next';
import { IWeather } from '@/types/weather.types';
import useAppSettings from '@/contexts/AppSettingsContext';
import { ResponsiveContainer } from 'recharts';
import PrecipStackedAreaChart from './PrecipitationAreaChart';
import { IPrecipChartData } from '@/types/chart.types';
import { RAIN_ALERT_HOURS } from '@/constants/settings';
import { formatClock } from '@/utils/formatters/formatClock';

export type TPrecipAreas = "rain" | "showers" | "snowfall";
export const precipitationAreas: TPrecipAreas[] = ["snowfall", "rain", "showers"];

interface Props {
  weather: IWeather;
}

export default function PrecipitationChart({ weather: { current, hourly } }: Props) {
  const { i18n: { language } } = useTranslation();
  const { get: { precipHoursRange, is12hour } } = useAppSettings();
  const { now } = useNow();

  const startIndex = getCurrentIndex(now, hourly.time);
  const endIndex = Math.min(startIndex + precipHoursRange, hourly.time.length);

  const data: IPrecipChartData[] = hourly.time.slice(startIndex, endIndex).map((time, i) => {

    const index = startIndex + i;
    const date = DateTime.fromISO(time);
    const key = date.toMillis() ?? i;

    const hour = formatClock({ date, language, short: true, hour12: is12hour });
    const windGusts = hourly.wind_gusts_10m[index] ?? 0;

    if (i === 0) return {
      key,
      hour,
      weatherCode: current.weather_code ?? -1,
      temp: current.temperature_2m,
      isDay: current.is_day === 1,
      rain: current.rain,
      showers: current.showers,
      snowfall: current.snowfall,
      windGusts,
    };

    return {
      key,
      hour,
      weatherCode: hourly.weather_code[index] ?? -1,
      temp: hourly.temperature_2m[index],
      isDay: hourly.is_day[index] === 1,
      rain: hourly.rain[index] ?? 0,
      showers: hourly.showers[index] ?? 0,
      snowfall: hourly.snowfall[index] ?? 0,
      windGusts: hourly.wind_gusts_10m[index] ?? 0,
    };
  });

  const lastPrecipitationIndex = data.findLastIndex(item => precipitationAreas.some(area => item[area] > 0));

  if (lastPrecipitationIndex < 0) return null;

  const onDebugClick = () => console.info('Chart Data', { times: hourly.time, data, timeIndex: startIndex, precipHoursRange });

  const { MIN, MAX } = RAIN_ALERT_HOURS;
  const filteredData = lastPrecipitationIndex === -1 ? [] : data.slice(0, Math.min(Math.max(lastPrecipitationIndex + 1, MIN), MAX));

  return (
    <div onDoubleClick={onDebugClick} className={styles.main}>
      <ResponsiveContainer width="100%" height={100}>
        <PrecipStackedAreaChart data={filteredData} hoursAhead={filteredData.length} />
      </ResponsiveContainer>
    </div>
  );
}