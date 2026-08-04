import { STORAGE_KEY } from "@/constants/keys";
import { AppSettings } from "@/types/app.types";

export default function persistSettings(settings: AppSettings): void {
  try {
    window.localStorage.setItem(STORAGE_KEY.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Falha ao salvar configurações no localStorage:', error);
  }
}