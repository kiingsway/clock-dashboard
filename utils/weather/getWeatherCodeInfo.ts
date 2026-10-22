import { WEATHER_ACCENT_COLORS } from '@/constants/colors';
import { getIconUrl } from '@/constants/iconFiles';
import WEATHER_ICONS from '@/constants/icons';
import { DayNNight } from '@/types/colors.types';
import { WeatherCategoryName } from '@/types/weather.types';
import { TFunction } from 'i18next';

interface IWeatherCodeInfo {
  code: number;
  name: WeatherCategoryName;
  title: string;
  accent: string;
  iconSrc: string;
}

/** WMO weather code (plus -1 = error, -2 = loading) → weather category. */
const CATEGORY_BY_CODE: Record<number, WeatherCategoryName> = {
  ...Object.fromEntries([0, 1].map(code => [code, 'clear'])),
  2: 'partlyCloudy',
  3: 'cloudy',
  4: 'smoke',
  5: 'haze',
  27: 'hail',
  ...Object.fromEntries([40, 41, 42, 44, 46, 48].map(code => [code, 'lightFog'])),
  ...Object.fromEntries([43, 45, 47, 49].map(code => [code, 'fog'])),
  ...Object.fromEntries([51, 53, 55].map(code => [code, 'drizzle'])),
  ...Object.fromEntries([56, 57].map(code => [code, 'freezingDrizzle'])),
  ...Object.fromEntries([61, 63].map(code => [code, 'rain'])),
  65: 'heavyRain',
  ...Object.fromEntries([66, 67].map(code => [code, 'freezingRain'])),
  ...Object.fromEntries([71, 73, 77].map(code => [code, 'snow'])),
  75: 'heavySnow',
  ...Object.fromEntries([80, 81, 82].map(code => [code, 'showers'])),
  83: 'sleet',
  84: 'heavySleet',
  ...Object.fromEntries([85, 86, 87, 88].map(code => [code, 'snowShowers'])),
  95: 'thunderstorm',
  96: 'moderateHail',
  99: 'heavyHail',
  [-1]: 'error',
  [-2]: 'loading',
};

const pickDayNight = (item: string | DayNNight, isDay: boolean): string =>
  typeof item === 'string' ? item : isDay ? item.day : item.night;

/** Accent color of a weather category (day/night variant when it has one). */
export function getCategoryAccent(name: WeatherCategoryName, isDay = true): string {
  return pickDayNight(WEATHER_ACCENT_COLORS[name] ?? WEATHER_ACCENT_COLORS.unknown, isDay);
}

/** Meteocons icon name of a weather category (day/night variant when it has one). */
export function getCategoryIconName(name: WeatherCategoryName, isDay = true): string {
  return pickDayNight(WEATHER_ICONS[name] ?? WEATHER_ICONS.unknown, isDay);
}

export default function getWeatherCodeInfo(code: number | undefined, isDay: boolean, t: TFunction): IWeatherCodeInfo {
  const name: WeatherCategoryName = typeof code === 'number'
    ? CATEGORY_BY_CODE[code] ?? 'unknown'
    : 'unknown';

  return {
    code: typeof code === 'number' ? code : -99,
    name,
    title: t(`weatherCategoryNames.${name}`),
    accent: getCategoryAccent(name, isDay),
    iconSrc: getIconUrl(getCategoryIconName(name, isDay)),
  };
}
