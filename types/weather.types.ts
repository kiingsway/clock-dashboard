/**
 * Types describing the shape of weather data consumed by the dashboard.
 * Modeled after the Open-Meteo forecast response, but intentionally
 * decoupled from any single provider so the fetch layer can be swapped
 * out later without touching the components.
 */

export interface IWeatherUnits {
  time: "iso8601";
  interval: "seconds";
  temperature_2m: "°C";
  apparent_temperature: "°C";
  precipitation: "mm";
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
  temperature_2m: "°C";
  precipitation: "mm";
  apparent_temperature: "°C";
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
  temperature_2m_max: "°C";
  temperature_2m_min: "°C";
  weather_code: "wmo code";
}

export interface IDaily {
  time: string[];
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

/** Alias kept for readability at call sites / future API layer. */
export type WeatherData = IWeather;

/** A single normalized hour, derived from IHourly for easy rendering. */
export interface IHourlyEntry {
  time: string;
  temperature: number;
  apparentTemperature: number;
  precipitation: number;
  weatherCode: number;
}

/** A single normalized day, derived from IDaily for easy rendering. */
export interface IDailyEntry {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  weatherCode: number;
}
