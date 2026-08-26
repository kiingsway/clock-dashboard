import { IWeatherCurrent, WeatherCategory, WeatherCategoryName } from "@/types/weather.types";
import getWeatherCategory from "./getWeatherCategory";
import { TFunction } from "i18next";
import { DEFAULT_COLOR, WEATHER_ACCENT_COLORS } from "@/constants/colors";

interface WeatherCodeProps {
  weatherCode: number;
  t: TFunction;

  category?: never;
  categoryName?: never;
}

interface CategoryProps {
  category: WeatherCategory;

  t?: never;
  weatherCode?: never;
  categoryName?: never;
}

interface CategoryNameProps {
  categoryName: WeatherCategoryName;

  t?: never;
  weatherCode?: never;
  category?: never;
}

interface InitialProps {
  isDay?: IWeatherCurrent["is_day"] | boolean;
}

type GetAccentProps = (WeatherCodeProps | CategoryProps | CategoryNameProps) & InitialProps;

export function getAccent({ isDay = true, categoryName: cName, category, weatherCode, t }: GetAccentProps): string {
  const categoryName = (() => {
    if (typeof weatherCode === 'number' && t) return getWeatherCategory(weatherCode, t).name;
    return category?.name || cName;
  })();

  if (!categoryName) return DEFAULT_COLOR.WEATHER;
  const isDayBool = isDay === true || isDay === 1;
  return getAccentColor(categoryName, isDayBool);
}

/**
 * A dim, dark-room-safe accent color per weather category, used for the
 * ambient glow behind the current-weather icon. Day/night shifts a few of
 * these (clear, fog) since the mood genuinely changes; the rest stay stable.
 */
export default function getAccentColor(categoryName: WeatherCategoryName, isDay: boolean): string {
  const color = WEATHER_ACCENT_COLORS[categoryName] ?? WEATHER_ACCENT_COLORS.unknown;

  if (typeof color === "string") return color;

  return isDay ? color.day : color.night;
}