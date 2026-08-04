import { getMoonIllumination, getMoonPosition, getMoonTimes } from "suncalc";
import { DateTime } from "luxon";
import Image from "next/image";
import { IMoonPhase, IMoonInfo } from "@/types/weatherInfo.types";
import { ICON_BASE_URI } from "@/constants/iconFiles";
import MOON_PHASES from "@/constants/moonPhases";

function isMoonVisible(lat: number, lon: number, date: DateTime) {
  const { altitude } = getMoonPosition(date.toJSDate(), lat, lon);

  return altitude > 2;
}

interface MoonPhaseOptions {
  size?: number;
  date?: DateTime;
  lat?: number;
  lon?: number;
}

export default function getMoonPhase({
  size = 100,
  date = DateTime.now(),
  lat,
  lon,
}: MoonPhaseOptions = {}): IMoonPhase {
  const { phase } = getMoonIllumination(date.toJSDate());

  let moon: IMoonInfo;

  if (phase < 1 / 16 || phase >= 15 / 16) {
    moon = MOON_PHASES.new;
  } else if (phase < 3 / 16) {
    moon = MOON_PHASES.waxingCrescent;
  } else if (phase < 5 / 16) {
    moon = MOON_PHASES.firstQuarter;
  } else if (phase < 7 / 16) {
    moon = MOON_PHASES.waxingGibbous;
  } else if (phase < 9 / 16) {
    moon = MOON_PHASES.full;
  } else if (phase < 11 / 16) {
    moon = MOON_PHASES.waningGibbous;
  } else if (phase < 13 / 16) {
    moon = MOON_PHASES.lastQuarter;
  } else {
    moon = MOON_PHASES.waningCrescent;
  }

  const isVisible = lat && lon ? isMoonVisible(lat, lon, date) : undefined;

  const moonTimes = lat && lon ? getMoonTimes(date.toJSDate(), lat, lon) : undefined;

  const icon = (
    <Image
      src={`${ICON_BASE_URI}${moon.icon}.svg`}
      alt={moon.title}
      title={moon.title}
      loading="lazy"
      style={{
        width: `${size / 16}em`,
        height: `${size / 16}em`,
        display: "block"
      }}
    />
  )

  return {
    title: moon.title,
    phase,
    icon,
    moonrise: moonTimes?.rise ? DateTime.fromJSDate(moonTimes?.rise) : undefined,
    moonset: moonTimes?.set ? DateTime.fromJSDate(moonTimes?.set) : undefined,
    iconSrc: `${ICON_BASE_URI}${moon.icon}.svg`,
    isVisible,
  };
}