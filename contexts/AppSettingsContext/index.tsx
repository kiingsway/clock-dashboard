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
import { DEFAULT_SETTINGS } from '@/constants/settings';
import { TLocation } from '@/types/location.types';

import loadSettings from './loadSettings';
import persistSettings from './persistSettings';
import { getLocationToWeather } from '@/utils/location/getLocationToWeather';
import { MAX_RAIN_ALERT_HOURS, MIN_RAIN_ALERT_HOURS } from '@/constants/rainDescriptions';

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

  const setLocation = useCallback((location: TLocation) => {
    setSettings((prev) => ({
      ...prev,
      location,
    }));
  }, []);

  const setAlertRadiusKm = useCallback((alertRadiusKm: number) => {
    setSettings((prev) => ({
      ...prev,
      alertRadiusKm,
    }));
  }, []);

  const setPrecipHoursRange = useCallback((precipHoursRangeData: number) => {
    const precipHoursRange = Math.max(MIN_RAIN_ALERT_HOURS, Math.min((precipHoursRangeData ?? MIN_RAIN_ALERT_HOURS), MAX_RAIN_ALERT_HOURS));
    
    setSettings((prev) => ({
      ...prev,
      precipHoursRange,
    }));
  }, []);

  const resetSettings = useCallback(() => setSettings(DEFAULT_SETTINGS), []);

  const locations = useMemo(() => getLocationToWeather(t), [t]);

  const value = useMemo<UseAppSettings>(
    () => ({
      set: {
        location: setLocation,
        alertRadiusKm: setAlertRadiusKm,
        precipHoursRange: setPrecipHoursRange,
      },
      get: settings,
      weatherLocation: locations[settings.location],
      resetSettings,
    }),
    [setLocation, setAlertRadiusKm, setPrecipHoursRange, settings, locations, resetSettings]
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