import { AppSettings, UseAppSettings } from "@/types/app.types";
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import loadSettings from "./loadSettings";
import persistSettings from "./persistSettings";
import { STORAGE_KEY } from "@/constants/keys";
import { DEFAULT_SETTINGS } from "@/constants/settings";
import { TLocation } from "@/types/location.types";
import { getLocationToWeather } from "@/utils/location/getLocationToWeather";
import useBoolean from "../useBoolean";

/**
 * Hook para gerenciar as configurações do aplicativo, persistindo
 * automaticamente no localStorage. A configuração `location` guarda
 * o timezone selecionado, e os dados de clima (lat/lon) são derivados
 * dele através do mapa LOCATION_TO_WEATHER.
 *
 * @example
 * const { location, weatherLocation, setLocation } = useAppSettings();
 */
export function useAppSettings(): UseAppSettings {
  const { t } = useTranslation()
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoaded, { setTrue: setLoaded }] = useBoolean()

  /* 1. Carrega do localStorage só depois de montado no cliente */
  useEffect(() => {
    setSettings(loadSettings());
    setLoaded();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* 2. Só persiste depois que já carregou — evita sobrescrever com o default */
  useEffect(() => {
    if (!isLoaded) return;
    persistSettings(settings);
  }, [settings, isLoaded]);

  /* Sincronização entre abas */
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY.SETTINGS && event.newValue) {
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

  const setLocation = useCallback((location: TLocation) => {
    setSettings((prev) => ({ ...prev, location }));
  }, []);

  const setAlertRadiusKm = useCallback((alertRadiusKm: number) => {
    setSettings((prev) => ({ ...prev, alertRadiusKm }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const locations = getLocationToWeather(t)

  return {
    set: {
      location: setLocation,
      alertRadiusKm: setAlertRadiusKm
    },
    get: settings,
    weatherLocation: locations[settings.location],
    resetSettings,
  };
}