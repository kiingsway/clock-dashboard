import { IWeather } from "@/types/weather.types";
import { IDailyData } from "@/types/weatherInfo.types";
import { getCurrentIndex } from "@/utils/formatters/getValueByArray";
import { roundValues } from "@/utils/formatters/mathDateFormatters";
import { getAccent } from "@/utils/weather/getAccentColor";
import getForecastDateLabel from "@/utils/weather/getForecastDateLabel";
import { TFunction } from "i18next";
import { DateTime } from "luxon";

interface Props {
  weather: IWeather;
  today: DateTime;
  locale: string;
  t: TFunction
}

export default function buildDailyForecastItem({ weather, today, locale, t }: Props): IDailyData[] {

  const { timezone: zone, daily, daily_units: { temperature_2m_max: tempUnit } } = weather;

  const startIndex = getCurrentIndex(today, daily.time);

  const datetimes = daily.time.slice(startIndex, daily.time.length);

  const [weekMin, weekMax] = roundValues(
    Math.min(...datetimes.map((_, i) => daily.temperature_2m_min[startIndex + i])),
    Math.max(...datetimes.map((_, i) => daily.temperature_2m_max[startIndex + i]))
  );

  const dailyItems: IDailyData[] = datetimes.map((time, i) => {

    const dailyIndex = startIndex + i;
    const timedate = DateTime.fromISO(time, { zone });

    const dayName = getForecastDateLabel(today, timedate, locale, t);

    const weatherCode = daily.weather_code[dailyIndex];
    const tempMin = Math.round(daily.temperature_2m_min[dailyIndex]);
    const tempMax = Math.round(daily.temperature_2m_max[dailyIndex]);

    const accent = getAccent({ weatherCode, t });

    const temperatureRange = weekMax - weekMin || 1;
    const start = ((tempMin - weekMin) / temperatureRange) * 100;
    const end = ((tempMax - tempMin) / temperatureRange) * 100;

    const left = `${start}%`;
    const width = `${Math.max(end, 6)}%`;

    return {
      key: timedate.toISODate() || dailyIndex,
      dayName,
      weatherCode,
      tempMin,
      tempMax,
      tempUnit,
      accent,
      range: { left, width },
      index: dailyIndex,
    };
  });

  return dailyItems;
}