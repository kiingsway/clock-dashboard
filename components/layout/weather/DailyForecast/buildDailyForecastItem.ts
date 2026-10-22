import { IWeather } from "@/types/weather.types";
import { IDailyData } from "@/types/weatherInfo.types";
import { getCurrentIndex } from "@/utils/formatters/getValueByArray";
import { roundValues } from "@/utils/formatters/mathDateFormatters";
import getForecastDateLabel from "@/utils/weather/getForecastDateLabel";
import getWeatherCodeInfo from "@/utils/weather/getWeatherCodeInfo";
import { TFunction } from "i18next";
import { DateTime } from "luxon";

interface Props {
  weather: IWeather;
  today: DateTime;
  locale: string;
  t: TFunction
  /** Começa a lista em ontem em vez de hoje (a API já retorna 1 dia passado). */
  includeYesterday?: boolean;
}

export default function buildDailyForecastItem({ weather, today, locale, t, includeYesterday = false }: Props): IDailyData[] {

  const { timezone: zone, daily, daily_units: { temperature_2m_max: tempUnit } } = weather;

  const todayIndex = getCurrentIndex(today, daily.time);
  const startIndex = Math.max(0, todayIndex - (includeYesterday ? 1 : 0));

  const datetimes = daily.time.slice(startIndex, daily.time.length);

  const [weekMin, weekMax] = roundValues(
    Math.min(...datetimes.map((_, i) => daily.temperature_2m_min[startIndex + i])),
    Math.max(...datetimes.map((_, i) => daily.temperature_2m_max[startIndex + i]))
  );

  const dailyItems: IDailyData[] = datetimes.map((time, i) => {

    const index = startIndex + i;
    const timedate = DateTime.fromISO(time, { zone });

    const dayName = getForecastDateLabel(today, timedate, locale, t);

    const weatherCode = daily.weather_code[index];
    const tempMin = Math.round(daily.temperature_2m_min[index]);
    const tempMax = Math.round(daily.temperature_2m_max[index]);

    const { accent } = getWeatherCodeInfo(weatherCode, true, t);

    const temperatureRange = weekMax - weekMin || 1;
    const start = ((tempMin - weekMin) / temperatureRange) * 100;
    const end = ((tempMax - tempMin) / temperatureRange) * 100;

    const range = {
      left: `${start}%`,
      width: `${Math.max(end, 6)}%`,
    };

    return {
      key: timedate.toISODate() || index,
      dayName,
      weatherCode,
      tempMin,
      tempMax,
      tempUnit,
      accent,
      range,
      index,
    };
  });

  return dailyItems;
}