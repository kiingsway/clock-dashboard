import { WeatherCategory, WeatherCategoryName } from "@/types/weather.types";
import { TFunction } from "i18next";

/**
 * Buckets a WMO weather code into a coarse category.
 * Shared by the icon picker and by `getAccentColor`, so the two always agree
 * on what a given code "means".
 */
export default function getWeatherCategory(weatherCode: number | undefined, t: TFunction): WeatherCategory {
  let name: WeatherCategoryName = "unknown";

  if (typeof weatherCode !== 'number') return { name, title: t(name) }

  if (weatherCode === 0 || weatherCode === 1) {
    name = "clear";
  } else if (weatherCode === 2) {
    name = "partlyCloudy";
  } else if (weatherCode === 3) {
    name = "cloudy";
  } else if (weatherCode === 4) {
    name = "smoke";
  } else if (weatherCode === 5) {
    name = "haze";
  } else if (weatherCode === 27) {
    name = "hail";
  } else if ([40, 41, 42, 44, 46, 48].includes(weatherCode)) {
    name = "lightFog";
  } else if ([43, 45, 47, 49].includes(weatherCode)) {
    name = "fog";
  } else if ([51, 53, 55].includes(weatherCode)) {
    name = "drizzle";
  } else if (weatherCode === 56 || weatherCode === 57) {
    name = "freezingDrizzle";
  } else if (weatherCode === 61 || weatherCode === 63) {
    name = "rain";
  } else if (weatherCode === 65) {
    name = "heavyRain";
  } else if (weatherCode === 66 || weatherCode === 67) {
    name = "freezingRain";
  } else if (weatherCode === 71 || weatherCode === 73 || weatherCode === 77) {
    name = "snow";
  } else if (weatherCode === 75) {
    name = "heavySnow";
  } else if ([80, 81, 82].includes(weatherCode)) {
    name = "showers";
  } else if (weatherCode === 83) {
    name = "sleet";
  } else if (weatherCode === 84) {
    name = "heavySleet";
  } else if ([85, 86, 87, 88].includes(weatherCode)) {
    name = "snowShowers";
  } else if (weatherCode === 95) {
    name = "thunderstorm";
  } else if (weatherCode === 96) {
    name = "moderateHail";
  } else if (weatherCode === 99) {
    name = "heavyHail";
  } else if (weatherCode === -1) {
    name = "error";
  } else if (weatherCode === -2) {
    name = "loading";
  } else {
    name = "unknown";
  }

  return { name, title: t(`weatherCategoryNames.${name}`) };
}

