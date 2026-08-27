import { TABS } from "@/constants/tabs";
import { TLocation, IWeatherLocationItem } from "./location.types";

export type TTabs = keyof typeof TABS;

export type ImageInfo = { alt: string, src: string };

export interface AppSettings {
  location: TLocation;
  alertRadiusKm: number;
  precipHoursRange: number;
  sunAlertThresholdMinutes: number; // Define com quantos minutos de antecedência os ícones de nascer ou pôr do sol devem ser exibidos antes do evento ocorrer. (sunWindowIconBeforeMinutes)
  showFeelsLikeWhenEqual: boolean; // Exibe a sensação térmica mesmo quando o seu valor for igual à temperatura atual. Se desativado, oculta o campo nessa condição. (showFeelsLikeIfEqualsTemp)
  showMinMaxPeakBadge: boolean; // Exibe os rótulos "MIN" ou "MAX" caso a temperatura atual atinja exatamente a mínima ou a máxima prevista para o dia. (showMinMaxOnTempRange)
  focusCurrentWeatherOnLaunch: boolean; // Define se o aplicativo deve abrir com a seção do clima atual em destaque por padrão. (startFocused)
}

export interface UseAppSettings {
  set: {
    location: (value: TLocation) => void;
    alertRadiusKm: (value: number) => void;
    precipHoursRange: (value: number) => void;
    sunAlertThresholdMinutes: (value: number) => void;
    showFeelsLikeWhenEqual: (value: boolean) => void;
    showMinMaxPeakBadge: (value: boolean) => void;
    focusCurrentWeatherOnLaunch: (value: boolean) => void;
  };
  get: AppSettings;
  weatherLocation: IWeatherLocationItem;
  resetSettings: () => void;
  isLoaded: boolean;
}

export type IColorValueGradient = {
  readonly value: number;
  readonly hex: string;
};