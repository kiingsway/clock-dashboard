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

const getCategoryDef = (item: string | DayNNight, isDay: boolean) => typeof item === 'string' ? item : isDay ? item.day : item.night;

export default function getWeatherCodeInfo(code: number | undefined, isDay: boolean, t: TFunction): IWeatherCodeInfo {
  let name: WeatherCategoryName = "unknown";

  let accent = getCategoryDef(WEATHER_ACCENT_COLORS[name], isDay);

  let iconSrc = getIconUrl(getCategoryDef(WEATHER_ICONS[name], isDay));

  if (typeof code !== 'number') return {
    code: -99,
    name,
    title: t(`weatherCategoryNames.${name}`),
    accent,
    iconSrc,
  };

  if ([0, 1].includes(code)) {
    name = "clear";
  } else if (code === 2) {
    name = "partlyCloudy";
  } else if (code === 3) {
    name = "cloudy";
  } else if (code === 4) {
    name = "smoke";
  } else if (code === 5) {
    name = "haze";
  } else if (code === 27) {
    name = "hail";
  } else if ([40, 41, 42, 44, 46, 48].includes(code)) {
    name = "lightFog";
  } else if ([43, 45, 47, 49].includes(code)) {
    name = "fog";
  } else if ([51, 53, 55].includes(code)) {
    name = "drizzle";
  } else if ([56, 57].includes(code)) {
    name = "freezingDrizzle";
  } else if ([61, 63].includes(code)) {
    name = "rain";
  } else if (code === 65) {
    name = "heavyRain";
  } else if ([66, 67].includes(code)) {
    name = "freezingRain";
  } else if ([71, 73, 77].includes(code)) {
    name = "snow";
  } else if (code === 75) {
    name = "heavySnow";
  } else if ([80, 81, 82].includes(code)) {
    name = "showers";
  } else if (code === 83) {
    name = "sleet";
  } else if (code === 84) {
    name = "heavySleet";
  } else if ([85, 86, 87, 88].includes(code)) {
    name = "snowShowers";
  } else if (code === 95) {
    name = "thunderstorm";
  } else if (code === 96) {
    name = "moderateHail";
  } else if (code === 99) {
    name = "heavyHail";
  } else if (code === -1) {
    name = "error";
  } else if (code === -2) {
    name = "loading";
  } else {
    name = "unknown";
  }

  accent = getCategoryDef(WEATHER_ACCENT_COLORS[name], isDay);

  iconSrc = getIconUrl(getCategoryDef(WEATHER_ICONS[name], isDay));

  return {
    code,
    name,
    title: t(`weatherCategoryNames.${name}`),
    accent,
    iconSrc
  };
}
