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

export interface IUVIcon {
  alt: string;
  src: string;
  desc: string;
  uv?: number;
  iconDuration?: number;
}

interface WindMetric {
  direction?: {
    name: string;
    src: string;
  };
  gusts: {
    value: number;
    unit: string;
    color: string | undefined;
    desc: string | undefined;
  };
  speed: {
    value: number;
    unit: string;
    color: string | undefined;
    desc: string | undefined;
  };
  beaufort: undefined | {
    src: string;
    value: BeaufortLevel;
    duration: number;
  };
}

export interface IWindInfo {
  now: WindMetric;
  day: WindMetric;
};

export type BeaufortLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface BeaufortResult {
  level: BeaufortLevel;
  description: string;
}

export interface IVisibilityInfo {
  value: number;
  title: string;
  color: string;
  desc: string;
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