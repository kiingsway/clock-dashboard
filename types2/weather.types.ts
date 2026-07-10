/**
 * Types describing the Open-Meteo-style payload consumed by the weather clock app.
 * These mirror the shape the host app already fetches, so components take this
 * data as props and never fetch or convert it themselves.
 */

export interface IWeatherUnits {
  time: "iso8601";
  interval: "seconds";
  temperature_2m: "°C" | "°F";
  apparent_temperature: "°C" | "°F";
  precipitation: "mm" | "inch";
  weather_code: "wmo code";
}

export interface IWeatherCurrent {
  time: string;
  interval: number;
  temperature_2m: number;
  apparent_temperature: number;
  precipitation: number;
  weather_code: number;
  is_day: 0 | 1 | "";
}

export interface IHourlyUnits {
  time: "iso8601";
  temperature_2m: "°C" | "°F";
  precipitation: "mm" | "inch";
  apparent_temperature: "°C" | "°F";
  weather_code: "wmo code";
}

export interface IHourly {
  time: string[];
  temperature_2m: number[];
  precipitation: number[];
  apparent_temperature: number[];
  weather_code: number[];
}

export interface IDailyUnits {
  time: "iso8601";
  temperature_2m_max: "°C" | "°F";
  temperature_2m_min: "°C" | "°F";
  weather_code: "wmo code";
}

export interface IDaily {
  time: string[];
  sunrise: string[];
  sunset: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  weather_code: number[];
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
}

/** Supported UI languages. Extend here if the host app adds more locales. */
export type SupportedLocale = "pt-BR" | "en-US";

/** Grouped WMO weather-code buckets used for both icon selection and the ambient glow accent. */
export type WeatherCategory =
  | "clear"
  | "cloudy"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "showers"
  | "thunderstorm"
  | "unknown";
