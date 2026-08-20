import { TABS } from "@/constants/tabs";
import { TLocation, IWeatherLocationItem } from "./location.types";
import { WeatherIconProps } from "@/components/ui/weather/WeatherIcon";

export type TTabs = keyof typeof TABS;

export type ImageInfo = { alt: string, src: string };

export interface AppSettings {
  location: TLocation;
  alertRadiusKm: number;
  precipHoursRange: number;
}

export interface UseAppSettings {
  set: {
    location: (location: TLocation) => void;
    alertRadiusKm: (alertRadiusKm: number) => void;
    precipHoursRange: (precipHoursRange: number) => void;
  };
  get: AppSettings;
  weatherLocation: IWeatherLocationItem;
  resetSettings: () => void;
}

export interface DetailItem {
  key: string;
  icon: WeatherIconProps;
  label: string;
  value: string | number;
  title?: string;
}

export type IColorValueGradient = {
  readonly value: number;
  readonly hex: string;
};