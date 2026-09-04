import { STORAGE_KEY } from "@/constants/keys";
import { LOCATION_OPTIONS } from "@/constants/locations";
import { ALERT_RADIUS_KM, DEFAULT_SETTINGS, RAIN_ALERT_HOURS, SUNWINDOW_BEFORE_MINUTES } from "@/constants/settings";
import { AppSettings } from "@/types/app.types";
import { TLocation } from "@/types/location.types";

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
 * Carrega as configurações salvas no localStorage.
 * Faz validação básica dos valores para evitar estados inválidos
 * (ex: localStorage corrompido ou editado manualmente).
 */
export default function loadSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;

    const parsed = JSON.parse(raw) as Partial<AppSettings>;

    const location = LOCATION_OPTIONS.includes(parsed.location as TLocation)
      ? (parsed.location as TLocation)
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
      'is12hour'
    ] as const;

    const [
      showFeelsLikeWhenEqual,
      showMinMaxPeakBadge,
      focusCurrentWeatherOnLaunch,
      is12hour
    ] = booleanKeys.map(key => getValidBoolean(parsed[key], DEFAULT_SETTINGS[key]));

    return { location, alertRadiusKm, precipHoursRange, showFeelsLikeWhenEqual, showMinMaxPeakBadge, focusCurrentWeatherOnLaunch, sunAlertThresholdMinutes, is12hour };

  } catch (error) {
    console.error('Falha ao carregar configurações do localStorage:', error);
    return DEFAULT_SETTINGS;
  }
}