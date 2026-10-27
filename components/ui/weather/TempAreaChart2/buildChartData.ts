import { IWeather } from '@/types/weather.types';
import { getCurrentIndex } from '@/utils/formatters/getValueByArray';
import { getWeatherCategoryName } from '@/utils/weather/getWeatherCodeInfo';
import { DateTime } from 'luxon';
import { ISunEventChart, IWeatherDataChart } from './types';

const r = (n: number): number => Math.round(n);

/** Menos que isso não forma um gráfico */
export const MIN_CHART_HOURS = 6;

export interface ChartData {
  weather: IWeatherDataChart[];
  weatherExtra: IWeatherDataChart[];
  sunEvent: ISunEventChart[];
  lowestTemp: number;
  highestTemp: number;
  nowX: number;
}

const MIDNIGHT = 'T00:00';

/**
 * Perto dos polos o Open-Meteo devolve horários "falsos" de nascer/pôr do sol:
 * - noite polar: nascer e pôr às 00:00 do mesmo dia (sunrise === sunset)
 * - dia polar: nascer às 00:00 e pôr às 00:00 do dia seguinte (24h de sol)
 * Nesses dias não há evento de verdade para desenhar.
 */
function isPolarDay(sunrise: string | undefined, sunset: string | undefined, zone: string): boolean {
  if (!sunrise || !sunset) return true;
  if (sunrise === sunset) return true;
  if (!sunrise.endsWith(MIDNIGHT) || !sunset.endsWith(MIDNIGHT)) return false;

  const hours = DateTime.fromISO(sunset, { zone }).diff(DateTime.fromISO(sunrise, { zone }), 'hours').hours;
  return hours >= 24;
}

export default function buildChartData(weather: IWeather, now: DateTime, hoursAhead: number): ChartData | null {

  const {
    timezone,
    daily: {
      time: dailyTime,
      sunrise,
      sunset,
    },
    hourly: {
      time: hourlyTime,
      weather_code,
      temperature_2m,
      apparent_temperature,
      rain,
      showers,
      snowfall,
      is_day,
      wind_gusts_10m,
    },
  } = weather;

  // As horas do Open-Meteo estão no fuso do local da previsão; compara o "agora" nesse mesmo fuso
  const localNow = now.setZone(timezone);
  const startIndex = getCurrentIndex(localNow, hourlyTime);
  if (startIndex < 0) return null;

  const chartHours = Math.max(hoursAhead, MIN_CHART_HOURS);
  const endIndex = Math.min(
    startIndex + (chartHours - 1),
    hourlyTime.length - 1
  );

  let lowestTemp = Infinity;
  let highestTemp = -Infinity;

  const weatherItems: IWeatherDataChart[] = [];
  const weatherExtra: IWeatherDataChart[] = [];
  const sunEventItems: ISunEventChart[] = [];

  const buildWeatherItem = (i: number): IWeatherDataChart | null => {
    const time = hourlyTime[i];

    if (!time) {
      console.error('Hourly Time not found', {
        hourlyTime,
        index: i,
      });
      return null;
    }

    const weatherCode = weather_code[i];
    const isDay = is_day[i] === 1;
    const temp = r(temperature_2m[i]);
    const feelsLike = r(apparent_temperature[i]);
    const category = getWeatherCategoryName(weatherCode);

    const code = (() => {
      if (i === startIndex) return weatherCode;

      const prevWeatherCode = weather_code[i - 1];
      const prevcat = getWeatherCategoryName(prevWeatherCode);

      if (weatherCode !== prevWeatherCode && category !== prevcat) {
        return weatherCode;
      }

      return undefined;
    })();

    const xLabel = DateTime
      .fromISO(time, { zone: timezone })
      .toFormat('HH');

    return {
      x: i - startIndex,
      xLabel,
      time,
      category,
      weatherCode,
      code,
      temp,
      feelsLike,
      isDay,
      rain: rain[i],
      showers: showers[i],
      snowfall: snowfall[i],
      gusts: wind_gusts_10m[i],
    };
  };

  // Dados principais
  for (let i = startIndex; i <= endIndex; i++) {
    const item = buildWeatherItem(i);

    if (!item) continue;

    lowestTemp = Math.min(lowestTemp, item.temp, item.feelsLike);
    highestTemp = Math.max(highestTemp, item.temp, item.feelsLike);

    weatherItems.push(item);
  }

  if (weatherItems.length < 2) return null;

  // Dois horários extras após o último item principal
  for (
    let i = endIndex + 1;
    i <= Math.min(endIndex + 2, hourlyTime.length - 1);
    i++
  ) {
    const item = buildWeatherItem(i);

    if (!item) continue;

    weatherExtra.push(item);
  }

  const startTodayIndex = Math.max(getCurrentIndex(localNow, dailyTime), 0);
  const endTodayIndex = Math.min(
    startTodayIndex + Math.ceil(chartHours / 24) + 1,
    dailyTime.length - 1
  );

  const chartStartTime = DateTime.fromISO(
    hourlyTime[startIndex],
    { zone: timezone }
  );

  for (let i = startTodayIndex; i <= endTodayIndex; i++) {
    if (isPolarDay(sunrise[i], sunset[i], timezone)) continue;

    const events: ISunEventChart[] = [
      { time: sunrise[i], event: 'sunrise' as const },
      { time: sunset[i], event: 'sunset' as const },
    ].map(event => {
      const eventTime = DateTime.fromISO(
        event.time,
        { zone: timezone }
      );

      return {
        x: eventTime.diff(chartStartTime, 'hours').hours,
        ...event,
      };
    });

    sunEventItems.push(...events);
  }

  const nowX = now.diff(chartStartTime, 'hours').hours;

  return {
    weather: weatherItems,
    weatherExtra,
    sunEvent: sunEventItems,
    lowestTemp,
    highestTemp,
    nowX,
  };
}
