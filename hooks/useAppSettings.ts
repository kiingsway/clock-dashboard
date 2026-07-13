import { TFunction } from 'i18next';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export type Location =
  | 'America/Toronto'
  | 'America/Sao_Paulo'
  | 'Asia/Seoul'
  | 'America/New_York'
  | 'America/Bogota'
  | 'America/Panama'
  | 'America/Vancouver'
  | 'Pacific/Guadalcanal';

export const LOCATION_OPTIONS: Location[] = [
  'America/Toronto',
  'America/Sao_Paulo',
  'Asia/Seoul',
  'America/New_York',
  'America/Bogota',
  'America/Panama',
  'America/Vancouver',
  'Pacific/Guadalcanal',
];

export interface WeatherLocationItem {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

/**
 * Mapa de timezone -> dados de clima (lat/lon).
 * Nem todo timezone tem uma cidade de referência para clima
 * (ex: Pacific/Guadalcanal), então o valor pode ser undefined.
 */
export function getLocationToWeather(t: TFunction): Record<Location, WeatherLocationItem> {
  return {
    "America/Toronto": {
      id: "Toronto",
      name: t("cities.Toronto"),
      lat: 43.6532,
      lon: -79.3832,
    },
    "America/Sao_Paulo": {
      id: "Sao_Paulo",
      name: t("cities.Sao_Paulo"),
      lat: -23.5505,
      lon: -46.6333,
    },
    "Asia/Seoul": {
      id: "Seoul",
      name: t("cities.Seoul"),
      lat: 37.5665,
      lon: 126.978,
    },
    "America/New_York": {
      id: "New_York",
      name: t("cities.New_York"),
      lat: 40.0583,
      lon: -74.4057,
    },
    "America/Bogota": {
      id: "Bogota",
      name: t("cities.Bogota"),
      lat: 4.711,
      lon: -74.0721,
    },
    "America/Panama": {
      id: "Panama_City",
      name: t("cities.Panama"),
      lat: 8.9824,
      lon: -79.5199,
    },
    "America/Vancouver": {
      id: "Vancouver",
      name: t("cities.Vancouver"),
      lat: 49.2827,
      lon: -123.1207,
    },
    "Pacific/Guadalcanal": {
      id: "Guadalcanal",
      name: t("cities.Honiara"),
      lat: -9.5427,
      lon: 160.2167,
    },
  };
}

export interface AppSettings {
  location: Location;
}

const STORAGE_KEY = 'app-settings';

const DEFAULT_SETTINGS: AppSettings = {
  location: 'America/New_York',
};

/**
 * Carrega as configurações salvas no localStorage.
 * Faz validação básica dos valores para evitar estados inválidos
 * (ex: localStorage corrompido ou editado manualmente).
 */
function loadSettings(): AppSettings {
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;

    const parsed = JSON.parse(raw) as Partial<AppSettings>;

    const location = LOCATION_OPTIONS.includes(parsed.location as Location)
      ? (parsed.location as Location)
      : DEFAULT_SETTINGS.location;

    return { location };
  } catch (error) {
    console.error('Falha ao carregar configurações do localStorage:', error);
    return DEFAULT_SETTINGS;
  }
}

function persistSettings(settings: AppSettings): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Falha ao salvar configurações no localStorage:', error);
  }
}

export interface UseAppSettingsReturn {
  settings: AppSettings;
  location: Location;
  weatherLocation: WeatherLocationItem;
  setLocation: (location: Location) => void;
  resetSettings: () => void;
}

/**
 * Hook para gerenciar as configurações do aplicativo, persistindo
 * automaticamente no localStorage. A configuração `location` guarda
 * o timezone selecionado, e os dados de clima (lat/lon) são derivados
 * dele através do mapa LOCATION_TO_WEATHER.
 *
 * @example
 * const { location, weatherLocation, setLocation } = useAppSettings();
 */
export function useAppSettings(): UseAppSettingsReturn {
  const { t } = useTranslation()
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // Sincroniza com o localStorage sempre que as configurações mudarem
  useEffect(() => {
    persistSettings(settings);
  }, [settings]);

  // Sincroniza entre abas/janelas diferentes
  useEffect(() => {
    setSettings(loadSettings());

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue) as AppSettings;
          setSettings(parsed);
        } catch (error) {
          console.error('Falha ao sincronizar configurações entre abas:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const setLocation = useCallback((location: Location) => {
    setSettings((prev) => ({ ...prev, location }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const locations = getLocationToWeather(t)

  return {
    settings,
    location: settings.location,
    weatherLocation: locations[settings.location],
    setLocation,
    resetSettings,
  };
}