export type CanadaAlertType =
  | "warning"
  | "watch"
  | "advisory"
  | "statement";

export type CanadaRiskColour =
  | "yellow"
  | "orange"
  | "red"
  | "grey";

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
  alert_code: string;
  alert_type: CanadaAlertType;
  alert_name_en: string;
  alert_short_name_en: string;
  alert_text_en: string;
  feature_name_en: string;
  /** Environment Canada's risk colour, e.g. "Red" / "Orange" / "Yellow" / "Grey". */
  risk_colour_en: CanadaRiskColour;
  confidence_en: string;
  impact_en: string;
  status_en: string;
  /** ISO 8601 — when the event itself is expected to end. */
  event_end_datetime: string;
  province: string;
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