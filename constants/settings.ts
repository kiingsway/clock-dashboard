import { AppSettings, HourlyForecastView } from "@/types/app.types";
import { AQIScale } from "@/types/aqi.types";

export const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'pt', label: 'Português' },
  { value: 'es', label: 'Español' },
  { value: 'ko', label: '한국어' },
] as const;

export const AQI_SCALES: AQIScale[] = ['european', 'us'] as const;

export const HOURLY_FORECAST_VIEWS: HourlyForecastView[] = ['cards', 'chart'] as const;

export const DEFAULT_SETTINGS: AppSettings = {
  location: {
    name: "Toronto",
    countryCode: "CA",
    latitude: 43.70643,
    longitude: -79.39864,
    population: 2794356,
    timezone: "America/Toronto",
    geonameId: 0,
  },
  alertRadiusKm: 10,
  precipHoursRange: 12,
  sunAlertThresholdMinutes: 50, // Minutes before Sunrise/Sunset to show sunrise/sunset icon.
  showFeelsLikeWhenEqual: false, // Show Feels Like on Current Weather if equals temperature.
  showMinMaxPeakBadge: true, // Show "MIN" or "MAX" when the current temperature equals min ou max.
  focusCurrentWeatherOnLaunch: false, // Whether current weather is focused or not.
  hourlyForecastInFocus: false, // Show HourlyForecast inside the focus group (below precipitation chart).
  is12hour: false,
  aqiScale: AQI_SCALES[0],
  useBottomSheet: true,
  hourlyForecastView: HOURLY_FORECAST_VIEWS[0],
};

export const ALERT_RADIUS_KM = {
  MIN: 5,
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