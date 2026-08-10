import { DateTime } from "luxon";
import { TFunction } from "i18next";
import { IWeather } from "@/types/weather.types";
import { DetailItem } from "@/types/app.types";
import { roundValues } from "../formatters/mathDateFormatters";

interface Params {
  daily: IWeather["daily"];
  units: IWeather["daily_units"];
  index: number;
  t: TFunction;
}

export function getForecastDetailItems({ daily, units, index, t }: Params): DetailItem[] {
  const [
    feelsLike,
    temp,
    uvIndex,
    windGusts,
    windSpeed,
    precipChance,
    precipSum,
    precipHours,
  ] = roundValues(
    daily.apparent_temperature_mean[index],
    daily.temperature_2m_mean[index],
    daily.uv_index_max[index],
    daily.wind_gusts_10m_mean[index],
    daily.wind_speed_10m_mean[index],
    daily.precipitation_probability_max[index],
    daily.precipitation_sum[index],
    daily.precipitation_hours[index]
  );

  const isFeelsWarmer = feelsLike > temp;

  const windUnit =
    units.wind_speed_10m_mean ??
    units.wind_gusts_10m_mean ??
    "km/h";

  return [
    {
      key: "feelsLike",
      title: `Mean Temp: ${temp}°C | Mean Feels Like: ${feelsLike}°C`,
      icon: {
        iconName: isFeelsWarmer
          ? "thermometer-mercury"
          : "thermometer-mercury-cold",
      },
      label: t("feelsLike"),
      value: `${feelsLike}${units.apparent_temperature_mean}`,
    },
    {
      key: "uvIndex",
      icon: { iconName: `uv-index-${uvIndex}` },
      label: t("uvIndex"),
      value: uvIndex,
    },
    {
      key: "sunrise",
      icon: { category: "sunrise" },
      label: t("sunrise"),
      value: DateTime.fromISO(daily.sunrise[index]).toFormat("HH:mm"),
    },
    {
      key: "sunset",
      icon: { category: "sunset" },
      label: t("sunset"),
      value: DateTime.fromISO(daily.sunset[index]).toFormat("HH:mm"),
    },
    {
      key: "precipChance",
      icon: { iconName: "raindrops" },
      label: t("precipitationTexts.chance"),
      value: `${precipChance}${units.precipitation_probability_max}`,
    },
    {
      key: "precipMax",
      icon: { iconName: "raindrop-measure" },
      label: t("precipitationTexts.max"),
      value: t("precipitationTexts.precipInHours", {
        precip: precipSum,
        precipUnit: units.precipitation_sum,
        hours: precipHours,
        hoursUnit: units.precipitation_hours,
      }),
    },
    {
      key: "windGusts",
      icon: { iconName: "wind" },
      label: t("windGusts"),
      value: `${windGusts} ${windUnit}`,
    },
    {
      key: "windSpeed",
      icon: { iconName: "wind" },
      label: t("windSpeed"),
      value: `${windSpeed} ${windUnit}`,
    },
  ];
}