import ICON_FILES from "@/constants/iconFiles";
import { WeatherCategory } from "@/types/weather.types";

export default function getWeatherIconName(category: WeatherCategory, isDay: boolean): string {
  const unknownIcon = ICON_FILES.unknown;

  const map: Record<WeatherCategory['name'], string> = {
    clear: isDay ? ICON_FILES.clearDay : ICON_FILES.clearNight,
    partlyCloudy: isDay
      ? ICON_FILES.partlyCloudyDay
      : ICON_FILES.partlyCloudyNight,
    smoke: isDay ?
      ICON_FILES.smokeDay :
      ICON_FILES.smokeNight,
    cloudy: ICON_FILES.cloudy,
    haze: isDay
      ? ICON_FILES.hazeDay
      : ICON_FILES.hazeNight,
    fog: ICON_FILES.fog,
    lightFog: isDay ? ICON_FILES.fogDay : ICON_FILES.fogNight,
    drizzle: ICON_FILES.drizzle,
    freezingDrizzle: ICON_FILES.freezingDrizzle,
    rain: ICON_FILES.rain,
    freezingRain: ICON_FILES.freezingRain,
    snow: ICON_FILES.snow,
    snowShowers: isDay
      ? ICON_FILES.snowShowersDay
      : ICON_FILES.snowShowersNight,
    showers: ICON_FILES.showers,
    thunderstorm: ICON_FILES.thunderstorm,
    hail: ICON_FILES.hail,
    moderateHail: ICON_FILES.moderateHail,
    heavyHail: ICON_FILES.heavyHail,
    heavyRain: ICON_FILES.heavyRain,
    heavySnow: ICON_FILES.heavySnow,
    sleet: isDay ? ICON_FILES.sleetDay : ICON_FILES.sleetNight,
    heavySleet: isDay ? ICON_FILES.heavySleetDay : ICON_FILES.heavySleetNight,

    sunrise: ICON_FILES.sunrise,
    sunset: ICON_FILES.sunset,

    error: ICON_FILES.error,
    loading: ICON_FILES.loading,
    unknown: unknownIcon
  };

  return category ? map[category.name] : unknownIcon;
}