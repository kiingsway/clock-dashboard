import { TCategoryDef } from "@/types/colors.types";
import ICON_FILES from "./iconFiles";

const WEATHER_ICONS: TCategoryDef = {
  clear: { day: ICON_FILES.clearDay, night: ICON_FILES.clearNight },
  partlyCloudy: { day: ICON_FILES.partlyCloudyDay, night: ICON_FILES.partlyCloudyNight },
  smoke: { day: ICON_FILES.smokeDay, night: ICON_FILES.smokeNight },
  cloudy: ICON_FILES.cloudy,
  haze: { day: ICON_FILES.hazeDay, night: ICON_FILES.hazeNight },
  fog: ICON_FILES.fog,
  lightFog: { day: ICON_FILES.fogDay, night: ICON_FILES.fogNight },
  drizzle: ICON_FILES.drizzle,
  freezingDrizzle: ICON_FILES.freezingDrizzle,
  rain: ICON_FILES.rain,
  freezingRain: ICON_FILES.freezingRain,
  snow: ICON_FILES.snow,
  snowShowers: { day: ICON_FILES.snowShowersDay, night: ICON_FILES.snowShowersNight },
  showers: ICON_FILES.showers,
  thunderstorm: ICON_FILES.thunderstorm,
  hail: ICON_FILES.hail,
  moderateHail: ICON_FILES.moderateHail,
  heavyHail: ICON_FILES.heavyHail,
  heavyRain: ICON_FILES.heavyRain,
  heavySnow: ICON_FILES.heavySnow,
  sleet: { day: ICON_FILES.sleetDay, night: ICON_FILES.sleetNight },
  heavySleet: { day: ICON_FILES.heavySleetDay, night: ICON_FILES.heavySleetNight },

  sunrise: ICON_FILES.sunrise,
  sunset: ICON_FILES.sunset,

  error: ICON_FILES.error,
  loading: ICON_FILES.loading,
  unknown: ICON_FILES.unknown
} as const;

export default WEATHER_ICONS;