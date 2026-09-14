import { TABS } from "@/constants/tabs";
import { TLocation, IWeatherLocationItem } from "./location.types";
import { AQIScale } from "./aqi.types";

export type TTabs = keyof typeof TABS;

export type ImageInfo = { alt: string, src: string };

export interface AppSettings {
  location: TLocation; // Localização selecionada do clima.
  alertRadiusKm: number; // Define área em km para busca de alertas de clima (apenas Canadá)
  precipHoursRange: number; // Define quantas horas de antecedencia para mostrar proxima precipitação
  sunAlertThresholdMinutes: number; // Define com quantos minutos de antecedência os ícones de nascer ou pôr do sol devem ser exibidos antes do evento ocorrer. (sunWindowIconBeforeMinutes)
  showFeelsLikeWhenEqual: boolean; // Exibe a sensação térmica mesmo quando o seu valor for igual à temperatura atual. Se desativado, oculta o campo nessa condição. (showFeelsLikeIfEqualsTemp)
  showMinMaxPeakBadge: boolean; // Exibe os rótulos "MIN" ou "MAX" caso a temperatura atual atinja exatamente a mínima ou a máxima prevista para o dia. (showMinMaxOnTempRange)
  focusCurrentWeatherOnLaunch: boolean; // Define se o aplicativo deve abrir com a seção do clima atual em destaque por padrão. (startFocused)
  is12hour: boolean; // Define se é 12 (true) ou 24 horas (false).
  aqiScale: AQIScale; // Define se o air quality index é padrão europeu ou americano.
  useBottomSheet: boolean; // 'true' define se janelas serão exibidas em Bottom Sheet (pode causar lag), 'false' usa Modal.
}

export interface SaveAppSettings {
  location: (value: TLocation) => void;
  alertRadiusKm: (value: number) => void;
  precipHoursRange: (value: number) => void;
  sunAlertThresholdMinutes: (value: number) => void;
  showFeelsLikeWhenEqual: (value: boolean) => void;
  showMinMaxPeakBadge: (value: boolean) => void;
  focusCurrentWeatherOnLaunch: (value: boolean) => void;
  is12hour: (value: boolean) => void;
  aqiScale: (value: AQIScale) => void;
  useBottomSheet: (value: boolean) => void;
}

export interface UseAppSettings {
  set: SaveAppSettings;
  get: AppSettings;
  weatherLocation: IWeatherLocationItem;
  resetSettings: () => void;
  isLoaded: boolean;
}