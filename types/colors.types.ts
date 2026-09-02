import { WeatherCategoryName } from "./weather.types";

export type IColor = Record<string, string>;

export type DayNNight = { day: string; night: string };
export type TCategoryDef = Record<WeatherCategoryName, string | DayNNight>

export interface IGradientColor {
  value: number;
  hex: string;
}

export interface IInterpolateColor {
  low: string;
  mid: string;
  high: string;
}

export interface IColorRange {
  min: number;
  med: number;
  max: number;
}