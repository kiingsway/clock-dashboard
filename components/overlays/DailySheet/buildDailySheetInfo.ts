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
import getWeatherCodeInfo from "@/utils/weather/getWeatherCodeInfo";
import { TFunction } from "i18next";
import { DateTime } from "luxon";

function safeBuild(t: TFunction, defaultTitle: string = 'Erro', builder: () => IDailySheetInfo): IDailySheetInfo {
  try {
    return builder();
  } catch (error) {
    console.error(`${t('error_building_item')} "${defaultTitle}":`, error);
    return {
      key: 'error',
      title: defaultTitle,
      desc: t('error_building_item'),
      icons: [{ category: 'error' }]
    } as IDailySheetInfo;
  }
}

export default function buildDailySheetInfo(weather: IWeather, date: DateTime, locale: string, t: TFunction): IDailySheetInfo[] {

  const { timezone, daily, daily_moon, daily_units: {
    temperature_2m_max: tempUnit,
    visibility_mean: visibilityUnit,
    relative_humidity_2m_mean: humidityUnit,
    dew_point_2m_mean: dewPointUnit,
    wind_gusts_10m_mean: windUnit,
  } } = weather;

  const todayIndex = getCurrentIndex(date, daily.time);

  return [
    safeBuild(t, t('weather'), () => {
      const weatherCode = daily.weather_code[todayIndex];
      const tempMax = daily.temperature_2m_max[todayIndex];
      const tempMin = daily.temperature_2m_min[todayIndex];

      const weatherCategory = getWeatherCodeInfo(weatherCode, true, t);

      return {
        key: "weather",
        title: weatherCategory.title,
        desc: `${t('maxMin')}: ${Math.round(tempMax)}${tempUnit} / ${Math.round(tempMin)}${tempUnit}`,
        icons: [{ category: weatherCategory.name }]
      };
    }),

    safeBuild(t, t('feelsLike'), () => {
      const feelsLike = daily.apparent_temperature_mean[todayIndex];
      const tempMean = daily.temperature_2m_mean[todayIndex];

      const feelsLikeDesc = buildFeelsLikeDescription(tempMean, feelsLike, t);

      return { key: 'feelsLike', ...feelsLikeDesc };
    }),

    safeBuild(t, t('rain'), () => {
      const precipMM = daily.precipitation_sum[todayIndex];
      const precipChance = daily.precipitation_probability_max[todayIndex];
      const rainHours = daily.precipitation_hours[todayIndex];

      const rainDesc = buildRainDescription(rainHours, precipMM, precipChance, t);

      return { key: 'rain', ...rainDesc };
    }),

    safeBuild(t, t('uvIndex'), () => {
      const uvIndex = daily.uv_index_max[todayIndex];

      const uvDesc = buildUVDescription(uvIndex, true, t);

      return { key: 'uvIndex', ...uvDesc };
    }),

    safeBuild(t, t('moon'), () => {
      const moonDesc = buildMoonDescription(daily_moon, date, timezone, t);

      return { key: 'moon', ...moonDesc };
    }),

    safeBuild(t, t('visibility'), () => {
      const visibility = daily.visibility_mean[todayIndex];

      const visibilityDescription = buildVisibilityDescription(visibility, visibilityUnit, locale, true, t);

      return { key: 'visibility', ...visibilityDescription, };
    }),

    safeBuild(t, t('wind'), () => {
      const windSpeed = daily.wind_speed_10m_mean[todayIndex];
      const windGusts = daily.wind_gusts_10m_mean[todayIndex];
      const windDirection = daily.wind_direction_10m_dominant[todayIndex];

      const windDescription = buildWindDescription(windSpeed, windGusts, windDirection, windUnit, t);

      return { key: 'wind', ...windDescription };
    }),

    safeBuild(t, t('humidity'), () => {
      const humidity = daily.relative_humidity_2m_mean[todayIndex];

      const humidityDescription = buildHumidityDescription(humidity, humidityUnit, t);

      return { key: 'humidity', ...humidityDescription };
    }),

    safeBuild(t, t('dewPoint'), () => {
      const dewPoint = daily.dew_point_2m_mean[todayIndex];

      const dewPointDescription = buildDewPointDescription(dewPoint, dewPointUnit, t);

      return { key: 'dewPoint', ...dewPointDescription };
    }),

    safeBuild(t, t('daylight'), () => {
      const daylight = daily.daylight_duration[todayIndex];

      const daylightDescription = buildDaylightDescription(daylight, t);

      return { key: 'daylight', ...daylightDescription };
    }),

    safeBuild(t, t('sunshine'), () => {
      const sunshine = daily.sunshine_duration[todayIndex];

      const sunshineDescription = buildSunshineDescription(sunshine, t);

      return { key: 'sunshine', ...sunshineDescription };
    }),
  ];
}