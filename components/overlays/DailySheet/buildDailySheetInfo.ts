import { IWeather } from "@/types/weather.types";
import { IDailySheetInfo } from "@/types/weatherInfo.types";
import { getCurrentIndex } from "@/utils/formatters/getValueByArray";
import buildDaylightDescription from "@/utils/weather/buildDescriptions/daylight";
import buildDewPointDescription from "@/utils/weather/buildDescriptions/dewPoint";
import buildFeelsLikeDescription from "@/utils/weather/buildDescriptions/feelsLike";
import buildHumidityDescription from "@/utils/weather/buildDescriptions/humidity";
import buildMoonDescription from "@/utils/weather/buildDescriptions/moon";
import buildRainDescription from "@/utils/weather/buildDescriptions/rain";
import buildSunshineDescription from "@/utils/weather/buildDescriptions/sunshine";
import buildUVDescription from "@/utils/weather/buildDescriptions/uvIndex";
import buildVisibilityDescription from "@/utils/weather/buildDescriptions/visibility";
import buildWindDescription from "@/utils/weather/buildDescriptions/wind";
import getWeatherCategory from "@/utils/weather/getWeatherCategory";
import { TFunction } from "i18next";
import { DateTime } from "luxon";

export default function buildDailySheetInfo(weather: IWeather, date: DateTime, locale: string, t: TFunction): IDailySheetInfo[] {

  const { timezone, daily, daily_moon, daily_units: {
    temperature_2m_max: tempUnit,
    visibility_mean: visibilityUnit,
    relative_humidity_2m_mean: humidityUnit,
    dew_point_2m_mean: dewPointUnit,
    wind_gusts_10m_mean: windUnit,
  } } = weather;

  const todayIndex = getCurrentIndex(date, daily.time);

  const weatherCode = daily.weather_code[todayIndex];
  const feelsLike = daily.apparent_temperature_mean[todayIndex];
  const tempMax = daily.temperature_2m_max[todayIndex];
  const tempMean = daily.temperature_2m_mean[todayIndex];
  const tempMin = daily.temperature_2m_min[todayIndex];
  const precipMM = daily.precipitation_sum[todayIndex];
  const precipChance = daily.precipitation_probability_max[todayIndex];
  const rainHours = daily.precipitation_hours[todayIndex];
  const uvIndex = daily.uv_index_max[todayIndex];
  const visibility = daily.visibility_mean[todayIndex];
  const humidity = daily.relative_humidity_2m_mean[todayIndex];
  const dewPoint = daily.dew_point_2m_mean[todayIndex];
  const daylight = daily.daylight_duration[todayIndex];
  const sunshine = daily.sunshine_duration[todayIndex];
  const windSpeed = daily.wind_speed_10m_mean[todayIndex];
  const windGusts = daily.wind_gusts_10m_mean[todayIndex];
  const windDirection = daily.wind_direction_10m_dominant[todayIndex];
  const moonDaily = daily_moon.find(m => m.date === date.toISODate());

  const weatherCategory = getWeatherCategory(weatherCode, t);

  const feelsLikeDesc = buildFeelsLikeDescription(tempMean, feelsLike, t);
  const rainDesc = buildRainDescription(rainHours, precipMM, precipChance, t);
  const uvDesc = buildUVDescription(uvIndex, true, t);
  const moonDesc = buildMoonDescription(moonDaily, timezone, t);
  const visibilityDescription = buildVisibilityDescription(visibility, visibilityUnit, locale, true, t);
  const humidityDescription = buildHumidityDescription(humidity, humidityUnit, t);
  const dewPointDescription = buildDewPointDescription(dewPoint, dewPointUnit, t);
  const daylightDescription = buildDaylightDescription(daylight, t);
  const sunshineDescription = buildSunshineDescription(sunshine, t);
  const windDescription = buildWindDescription(windSpeed, windGusts, windDirection, windUnit, t);

  return [
    {
      key: "weather",
      title: weatherCategory.title,
      desc: `${t('maxMin')}: ${Math.round(tempMax)}${tempUnit} / ${Math.round(tempMin)}${tempUnit}`,
      icons: [{ category: weatherCategory.name }]
    },
    { key: 'feelsLike', ...feelsLikeDesc },
    { key: 'rain', ...rainDesc },
    { key: 'uvIndex', ...uvDesc },
    { key: 'moon', ...moonDesc },
    { key: 'visibility', ...visibilityDescription, },
    { key: 'wind', ...windDescription },
    { key: 'humidity', ...humidityDescription },
    { key: 'dewPoint', ...dewPointDescription },
    { key: 'daylight', ...daylightDescription },
    { key: 'sunshine', ...sunshineDescription },
  ];
}
