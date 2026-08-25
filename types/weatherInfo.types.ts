import { WeatherIconProps } from "@/components/ui/weather/WeatherIcon";
import { Key, ReactNode } from "react";

export interface NameIcon {
  name: string;
  icon: string;
}

export interface IMoonInfo extends Omit<NameIcon, 'icon'> {
  name: string;
  phase: number;
  icon: ReactNode;
  iconSrc: string;
  iconName: string;
  isVisible: boolean;
}

export interface IDailyData {
  key: Key;
  dayName: string;
  weatherCode: number;
  tempMin: number;
  tempMax: number;
  tempUnit: string;
  index: number;
  accent: string;
  range: { left: string, width: string };
}

export interface DailySheetItemDesc {
  title: string;
  desc: string;
  icons: WeatherIconProps[];
  textColor?: string;
}

export interface IDailySheetInfo {
  key: Key;
  title: string;
  desc: string;
  icons: WeatherIconProps[];
}