import { TABS } from "@/constants/tabs";
import { TLocation, IWeatherLocationItem } from "./location.types";

export type TTabs = keyof typeof TABS;

export interface AppSettings {
  location: TLocation;
  alertRadiusKm: number;
}

export interface UseAppSettings {
  set: {
    location: (location: TLocation) => void;
    alertRadiusKm: (alertRadiusKm: number) => void;
  };
  get: AppSettings;
  weatherLocation: IWeatherLocationItem;
  resetSettings: () => void;
}