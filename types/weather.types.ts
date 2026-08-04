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
  wind_speed_10m: "km/h",
  wind_direction_10m: "°",
  wind_gusts_10m: "km/h",
  visibility: "m"
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

export interface SelectOption {
  value: string;
  label: string;
}

/**
 * Subset of `IWeatherAlert["alerts"][number]["properties"]` (Environment
 * Canada's weather-alerts API) that `WeatherAlertCard` actually reads.
 * You already have the full `IWeatherAlert` type — this isn't meant to
 * replace it, just to type the single `properties` object the card takes as
 * a prop. Your real object has more fields than this; TypeScript is fine
 * with that since it only checks that the ones listed here are present.
 */
export interface IWeatherAlertCanadaProps {
  id: string;
  alert_type: string;
  alert_name_en: string;
  alert_short_name_en: string;
  alert_text_en: string;
  feature_name_en: string;
  /** Environment Canada's risk colour, e.g. "Red" / "Orange" / "Yellow" / "Grey". */
  risk_colour_en: string;
  confidence_en: string;
  impact_en: string;
  status_en: string;
  /** ISO 8601 — when the event itself is expected to end. */
  event_end_datetime: string;
}

export interface IWeatherAlertCanada {
  id: string
  type: string
  properties: IWeatherAlertCanadaProps
  geometry: {
    type: string
    coordinates: number[][][]
  }
}

export type WeatherIconInfo = Record<'moon' | 'weather' | 'current', { alt: string, src: string }>;