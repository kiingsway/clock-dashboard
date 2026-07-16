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
  is_day: number[];
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
  | "unknown"
  | "error"
  | "loading";

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
export interface WeatherAlertData {
  id: string;
  alert_type: string;
  alert_name_en: string;
  alert_short_name_en: string;
  alert_text_en: string;
  /** Environment Canada's risk colour, e.g. "Red" / "Orange" / "Yellow" / "Grey". */
  risk_colour_en: string;
  confidence_en: string;
  impact_en: string;
  status_en: string;
  /** ISO 8601 — when the event itself is expected to end. */
  event_end_datetime: string;
}

export interface IWeatherAlert {
  type: string
  properties: WeatherAlertData
  geometry: {
    type: string
    coordinates: number[][][]
  }
  id: string
}