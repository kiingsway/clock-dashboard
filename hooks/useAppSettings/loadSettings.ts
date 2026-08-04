import { STORAGE_KEY } from "@/constants/keys";
import { LOCATION_OPTIONS } from "@/constants/locations";
import { DEFAULT_SETTINGS } from "@/constants/settings";
import { AppSettings } from "@/types/app.types";
import { TLocation } from "@/types/location.types";

/**
 * Carrega as configurações salvas no localStorage.
 * Faz validação básica dos valores para evitar estados inválidos
 * (ex: localStorage corrompido ou editado manualmente).
 */
export default function loadSettings(): AppSettings {
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;

    const parsed = JSON.parse(raw) as Partial<AppSettings>;

    const location = LOCATION_OPTIONS.includes(parsed.location as TLocation)
      ? (parsed.location as TLocation)
      : DEFAULT_SETTINGS.location;

    const alertRadiusKm =
      typeof parsed.alertRadiusKm === "number" &&
        Number.isFinite(parsed.alertRadiusKm) &&
        parsed.alertRadiusKm >= 5 &&
        parsed.alertRadiusKm <= 200
        ? parsed.alertRadiusKm
        : DEFAULT_SETTINGS.alertRadiusKm;

    return { location, alertRadiusKm };
  } catch (error) {
    console.error('Falha ao carregar configurações do localStorage:', error);
    return DEFAULT_SETTINGS;
  }
}