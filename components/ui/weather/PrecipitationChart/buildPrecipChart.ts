import { IPrecipChartData } from '@/types/chart.types';
import { ICurrent, IHourly } from '@/types/weather.types';
import { formatClock } from '@/utils/formatters/formatClock';
import { getCurrentIndex } from '@/utils/formatters/getValueByArray';
import { DateTime } from 'luxon';
import { precipitationAreas } from '.';
import { RAIN_ALERT_HOURS } from '@/constants/settings';

export default function buildPrecipChart(current: ICurrent, hourly: IHourly, now: DateTime, { is12hour, language, precipHoursRange }: { precipHoursRange: number, language: string, is12hour: boolean }): { filteredData: IPrecipChartData[], lastPrecipitationIndex: number } {

  const startIndex = getCurrentIndex(now, hourly.time);
  const endIndex = Math.min(startIndex + precipHoursRange, hourly.time.length);

  const data = hourly.time.slice(startIndex, endIndex).map((time, i) => {

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
    } as IPrecipChartData;
  });

  const lastPrecipitationIndex = data.findLastIndex(item => precipitationAreas.some(area => item[area] > 0));

  const { MIN, MAX } = RAIN_ALERT_HOURS;
  const filteredData = lastPrecipitationIndex === -1 ? [] : data.slice(0, Math.min(Math.max(lastPrecipitationIndex + 1, MIN), MAX));

  return {
    filteredData,
    lastPrecipitationIndex
  };
}
