/**
 * Types describing the Open-Meteo-style payload consumed by the weather clock app.
 * These mirror the shape the host app already fetches, so components take this
 * data as props and never fetch or convert it themselves.
 */

import { ImageInfo } from "./app.types";

export interface IWeatherUnits {
  time: "iso8601";
  interval: "seconds";
  temperature_2m: "°C" | "°F";
  apparent_temperature: "°C" | "°F";
  precipitation: "mm" | "inch";
  weather_code: "wmo code";
  rain: "mm";
  showers: "mm";
  snowfall: "cm";
}

export interface IWeatherCurrent {
  time: string;
  interval: number;
  temperature_2m: number;
  apparent_temperature: number;
  precipitation: number;
  weather_code: number;
  is_day: 0 | 1 | "";
  rain: number;
  showers: number;
  snowfall: number;
}

export interface IHourlyUnits {
  time: "iso8601";
  temperature_2m: "°C" | "°F";
  precipitation: "mm" | "inch";
  apparent_temperature: "°C" | "°F";
  weather_code: "wmo code";
  wind_speed_10m: "km/h";
  wind_direction_10m: "°";
  wind_gusts_10m: "km/h";
  visibility: "m"
  rain: "mm";
  showers: "mm";
  snowfall: "cm"
  relative_humidity_2m: "%";
  dew_point_2m: "°C";
  sunshine_duration: "s";
}

export interface IHourly {
  time: string[];
  temperature_2m: number[];
  precipitation: number[];
  apparent_temperature: number[];
  is_day: number[];
  weather_code: number[];
  wind_direction_10m: number[];
  wind_gusts_10m: number[];
  wind_speed_10m: number[];
  visibility: number[];
  uv_index: number[];
  rain: number[];
  showers: number[];
  snowfall: number[];
  relative_humidity_2m: number[];
  dew_point_2m: number[];
  sunshine_duration: number[];
}

export interface IDailyUnits {
  time: "iso8601";
  temperature_2m_max: "°C" | "°F";
  temperature_2m_min: "°C" | "°F";
  weather_code: "wmo code";
  wind_gusts_10m_mean: "km/h";
  wind_speed_10m_mean: "km/h";
  apparent_temperature_mean: "°C" | "°F";
  precipitation_sum: "mm";
  precipitation_hours: "h";
  precipitation_probability_max: "%";
  wind_direction_10m_dominant: "°"
  relative_humidity_2m_mean: "%"
  dew_point_2m_mean: "°C" | "°F";
  daylight_duration: "s";
  sunshine_duration: "s";
  visibility_mean: "m";
}

export interface IDaily {
  time: string[];
  sunrise: string[];
  sunset: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  weather_code: number[];
  uv_index_max: number[];
  wind_gusts_10m_mean: number[];
  wind_speed_10m_mean: number[];
  apparent_temperature_mean: number[];
  temperature_2m_mean: number[];
  precipitation_sum: number[];
  precipitation_hours: number[];
  precipitation_probability_max: number[];
  wind_direction_10m_dominant: number[];
  relative_humidity_2m_mean: number[];
  dew_point_2m_mean: number[];
  daylight_duration: number[];
  sunshine_duration: number[];
  visibility_mean: number[];
}

export interface IMoonDaily {
  name: string;
  iconName: string;
  date: string;
  moonrise: string | undefined;
  moonset: string | undefined;
  alwaysUp: boolean;
  alwaysDown: boolean;
  phase: number;
  isSwapped: boolean;
}

export interface IMoonDailyItemDate {
  name: string;
  date: string;
  iconName: string;
  phase: number;
}

export interface IMoonDailyItem {
  key: string;
  date: IMoonDailyItemDate;
  rise: IMoonDailyItemDate | undefined;
  set: IMoonDailyItemDate | undefined;
}

export interface IWeather {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: IWeatherUnits;
  current: IWeatherCurrent;
  hourly_units: IHourlyUnits;
  hourly: IHourly;
  daily_units: IDailyUnits;
  daily: IDaily;
  daily_moon: IMoonDailyItem[];
}

/** Grouped WMO weather-code buckets used for both icon selection and the ambient glow accent. */
export type WeatherCategoryName =
  | "clear"
  | "partlyCloudy"
  | "cloudy"
  | "smoke"
  | "haze"
  | "lightFog"
  | "fog"
  | "drizzle"
  | "freezingDrizzle"
  | "rain"
  | "freezingRain"
  | "snow"
  | "snowShowers"
  | "showers"
  | "thunderstorm"
  | "hail"
  | "moderateHail"
  | "heavyHail"
  | "heavyRain"
  | "heavySnow"
  | "sleet"
  | "heavySleet"

  | "sunrise"
  | "sunset"

  | "unknown"
  | "error"
  | "loading";

export interface WeatherCategory {
  name: WeatherCategoryName;
  title: string;
}

export interface WeatherIconInfo {
  moon: undefined | ImageInfo;
  weather: ImageInfo;
  current: ImageInfo;
}

export type WindType = "speed" | "gusts";

export type MoonPhaseIcon = { iconName: string | undefined; phase: number | undefined };