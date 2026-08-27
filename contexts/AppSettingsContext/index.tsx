'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useState,
  type ReactNode,
} from 'react';

import { useTranslation } from 'react-i18next';

import { AppSettings, UseAppSettings } from '@/types/app.types';
import { STORAGE_KEY } from '@/constants/keys';
import { ALERT_RADIUS_KM, DEFAULT_SETTINGS, RAIN_ALERT_HOURS, SUNWINDOW_BEFORE_MINUTES } from '@/constants/settings';
import { TLocation } from '@/types/location.types';

import loadSettings from './loadSettings';
import persistSettings from './persistSettings';
import { getLocationToWeather } from '@/utils/location/getLocationToWeather';
import { LOCATION_OPTIONS } from '@/constants/locations';

const AppSettingsContext = createContext<UseAppSettings | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export function AppSettingsProvider({ children }: Props) {
  const { t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const loadedSettings = loadSettings();

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSettings({
      ...DEFAULT_SETTINGS,
      ...loadedSettings,
    });

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    persistSettings(settings);
  }, [settings, isLoaded]);

  /*
   * Sincronização entre abas.
   */
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (
        event.key !== STORAGE_KEY.SETTINGS ||
        !event.newValue
      ) {
        return;
      }

      try {
        const parsed = JSON.parse(event.newValue) as Partial<AppSettings>;

        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (error) {
        console.error(
          'Falha ao sincronizar configurações entre abas:',
          error
        );
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(
        'storage',
        handleStorageChange
      );
    };
  }, []);

  const setLocation = useCallback((value: TLocation) => {
    const location = LOCATION_OPTIONS.includes(value as TLocation)
      ? (value as TLocation)
      : DEFAULT_SETTINGS.location;

    setSettings((prev) => ({
      ...prev,
      location,
    }));
  }, []);

  const setAlertRadiusKm = useCallback((value: number) => {
    const { MIN, MAX } = ALERT_RADIUS_KM;
    const alertRadiusKm = Math.max(MIN, Math.min(MAX, value ?? DEFAULT_SETTINGS.alertRadiusKm));
    setSettings((prev) => ({
      ...prev,
      alertRadiusKm,
    }));
  }, []);

  const setPrecipHoursRange = useCallback((value: number) => {
    const { MIN, MAX } = RAIN_ALERT_HOURS;
    const precipHoursRange = Math.max(MIN, Math.min(MAX, value ?? DEFAULT_SETTINGS.precipHoursRange));
    setSettings((prev) => ({
      ...prev,
      precipHoursRange,
    }));
  }, []);

  const setSunAlertThresholdMinutes = useCallback((value: number) => {
    const { MIN, MAX } = SUNWINDOW_BEFORE_MINUTES;
    const sunAlertThresholdMinutes = Math.max(MIN, Math.min(MAX, value ?? DEFAULT_SETTINGS.sunAlertThresholdMinutes));
    setSettings((prev) => ({
      ...prev,
      sunAlertThresholdMinutes,
    }));
  }, []);

  const setShowFeelsLikeWhenEqual = useCallback((value: boolean) => {
    const showFeelsLikeWhenEqual = typeof value === 'boolean' ? value : DEFAULT_SETTINGS.showFeelsLikeWhenEqual;
    setSettings((prev) => ({
      ...prev,
      showFeelsLikeWhenEqual,
    }));
  }, []);

  const setShowMinMaxPeakBadge = useCallback((value: boolean) => {
    const showMinMaxPeakBadge = typeof value === 'boolean' ? value : DEFAULT_SETTINGS.showMinMaxPeakBadge;
    setSettings((prev) => ({
      ...prev,
      showMinMaxPeakBadge,
    }));
  }, []);

  const setFocusCurrentWeatherOnLaunch = useCallback((value: boolean) => {
    const focusCurrentWeatherOnLaunch = typeof value === 'boolean' ? value : DEFAULT_SETTINGS.focusCurrentWeatherOnLaunch;
    setSettings((prev) => ({
      ...prev,
      focusCurrentWeatherOnLaunch,
    }));
  }, []);

  const resetSettings = useCallback(() => setSettings(DEFAULT_SETTINGS), []);

  const locations = useMemo(() => getLocationToWeather(t), [t]);

  const value = useMemo<UseAppSettings>(
    () => ({
      isLoaded,
      resetSettings,
      weatherLocation: locations[settings.location],
      get: settings,
      set: {
        location: setLocation,
        alertRadiusKm: setAlertRadiusKm,
        precipHoursRange: setPrecipHoursRange,
        sunAlertThresholdMinutes: setSunAlertThresholdMinutes,
        showFeelsLikeWhenEqual: setShowFeelsLikeWhenEqual,
        showMinMaxPeakBadge: setShowMinMaxPeakBadge,
        focusCurrentWeatherOnLaunch: setFocusCurrentWeatherOnLaunch,
      },
    }),
    [
      isLoaded,
      settings,
      locations,
      setLocation,
      setAlertRadiusKm,
      setPrecipHoursRange,
      setSunAlertThresholdMinutes,
      setShowFeelsLikeWhenEqual,
      setShowMinMaxPeakBadge,
      setFocusCurrentWeatherOnLaunch,
      resetSettings,
    ]
  );

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings(): UseAppSettings {
  const context = useContext(AppSettingsContext);

  if (!context) throw new Error('useAppSettings must be used inside AppSettingsProvider');

  return context;
}