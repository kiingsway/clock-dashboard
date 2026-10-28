import { STORAGE_KEY } from "@/constants/keys";
import { ALERT_RADIUS_KM, DEFAULT_SETTINGS, HOURLY_FORECAST_VIEWS, RAIN_ALERT_HOURS, SUNWINDOW_BEFORE_MINUTES } from "@/constants/settings";
import { AppSettings, HourlyForecastView } from "@/types/app.types";
import { AQIScale } from "@/types/aqi.types";
import isValidLocationObject from "@/utils/locations/isValidLocationObject";

const getValidNumber = (value: unknown, range: { MIN: number; MAX: number }, defaultValue: number): number => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return defaultValue;

  return Math.min(range.MAX, Math.max(range.MIN, value));
};

const getValidBoolean = (value: unknown, defaultValue: boolean): boolean => {
  return typeof value === 'boolean'
    ? value
    : defaultValue;
};

/**
 * Converte o JSON salvo em configurações válidas.
 * Faz validação básica dos valores para evitar estados inválidos
 * (ex: localStorage corrompido ou editado manualmente).
 * Lança erro se o JSON for inválido.
 */
export function parseSettings(raw: string): AppSettings {
  const parsed = JSON.parse(raw) as Partial<AppSettings> | null;

  if (!parsed || typeof parsed !== 'object') return DEFAULT_SETTINGS;

  const location = 'location' in parsed && isValidLocationObject(parsed.location)
    ? parsed.location
    : DEFAULT_SETTINGS.location;

  const numberKeys = [
    { key: 'alertRadiusKm', range: ALERT_RADIUS_KM },
    { key: 'precipHoursRange', range: RAIN_ALERT_HOURS },
    { key: 'sunAlertThresholdMinutes', range: SUNWINDOW_BEFORE_MINUTES },
  ] as const;

  const [
    alertRadiusKm,
    precipHoursRange,
    sunAlertThresholdMinutes
  ] = numberKeys.map(({ key, range }) => getValidNumber(parsed[key], range, DEFAULT_SETTINGS[key]));

  const booleanKeys = [
    'showFeelsLikeWhenEqual',
    'showMinMaxPeakBadge',
    'focusCurrentWeatherOnLaunch',
    'hourlyForecastInFocus',
    'is12hour',
    'useBottomSheet',
  ] as const;

  const [
    showFeelsLikeWhenEqual,
    showMinMaxPeakBadge,
    focusCurrentWeatherOnLaunch,
    hourlyForecastInFocus,
    is12hour,
    useBottomSheet,
  ] =booleanKeys.map(key => getValidBoolean(parsed[key], DEFAULT_SETTINGS[key]));

  const aqiScales: AQIScale[] = ['european', 'us'];
  const aqiScale = aqiScales.includes(parsed.aqiScale as AQIScale)
    ? (parsed.aqiScale as AQIScale)
    : DEFAULT_SETTINGS.aqiScale;

  const hourlyForecastView = HOURLY_FORECAST_VIEWS.includes(parsed.hourlyForecastView as HourlyForecastView)
    ? (parsed.hourlyForecastView as HourlyForecastView)
    : DEFAULT_SETTINGS.hourlyForecastView;

  return { location, alertRadiusKm, precipHoursRange, showFeelsLikeWhenEqual, showMinMaxPeakBadge, focusCurrentWeatherOnLaunch, hourlyForecastInFocus, sunAlertThresholdMinutes, is12hour, aqiScale, useBottomSheet, hourlyForecastView };
}

/**
 * Carrega as configurações salvas no localStorage.
 */
export default function loadSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;

    return parseSettings(raw);
  } catch (error) {
    console.error('Falha ao carregar configurações do localStorage:', error);
    return DEFAULT_SETTINGS;
  }
}
