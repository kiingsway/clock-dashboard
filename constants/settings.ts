import { AppSettings } from "@/types/app.types";

export const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'pt', label: 'Português' },
  { value: 'es', label: 'Español' },
  { value: 'ko', label: '한국어' },
] as const;

export const DEFAULT_SETTINGS: AppSettings = {
  location: 'America/Toronto',
  alertRadiusKm: 10,
  precipHoursRange: 12,
  sunAlertThresholdMinutes: 50, // Minutes before Sunrise/Sunset to show sunrise/sunset icon.
  showFeelsLikeWhenEqual: false, // Show Feels Like on Current Weather if equals temperature.
  showMinMaxPeakBadge: true, // Show "MIN" or "MAX" when the current temperature equals min ou max.
  focusCurrentWeatherOnLaunch: false, // Whether current weather is focused or not.
};

export const ALERT_RADIUS_KM = {
  MIN: 10,
  MAX: 4000,
  STEP: 50,
};

export const RAIN_ALERT_HOURS = {
  MIN: 4,
  MAX: 24
};

export const SUNWINDOW_BEFORE_MINUTES = {
  MIN: 5,
  MAX: 90,
  STEP: 5,
};

export const VISIBILITY_METERS = {
  MIN: 1,
  MAX: 24140
};