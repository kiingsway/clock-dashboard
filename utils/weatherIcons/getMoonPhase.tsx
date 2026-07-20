import { getMoonIllumination, getMoonPosition, getMoonTimes } from "suncalc";
import { ICON_BASE_URI } from "./iconFiles";
import { ReactNode } from "react";
import { DateTime } from "luxon";

interface IMoonInfo {
  title: string;
  icon: ReactNode;
}

interface IMoonPhase extends IMoonInfo {
  phase: number
  isVisible: boolean | undefined
  iconSrc: string
  moonrise?: DateTime
  moonset?: DateTime
}

const MOON_PHASES: Record<string, IMoonInfo> = {
  new: {
    title: "New Moon",
    icon: "moon-new",
  },
  waxingCrescent: {
    title: "Waxing Crescent",
    icon: "moon-waxing-crescent",
  },
  firstQuarter: {
    title: "First Quarter",
    icon: "moon-first-quarter",
  },
  waxingGibbous: {
    title: "Waxing Gibbous",
    icon: "moon-waxing-gibbous",
  },
  full: {
    title: "Full Moon",
    icon: "moon-full",
  },
  waningGibbous: {
    title: "Waning Gibbous",
    icon: "moon-waning-gibbous",
  },
  lastQuarter: {
    title: "Last Quarter",
    icon: "moon-last-quarter",
  },
  waningCrescent: {
    title: "Waning Crescent",
    icon: "moon-waning-crescent",
  },
} as const;

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

  if (phase < 0.03 || phase > 0.97) {
    moon = MOON_PHASES.new;
  } else if (phase < 0.22) {
    moon = MOON_PHASES.waxingCrescent;
  } else if (phase < 0.28) {
    moon = MOON_PHASES.firstQuarter;
  } else if (phase < 0.47) {
    moon = MOON_PHASES.waxingGibbous;
  } else if (phase < 0.53) {
    moon = MOON_PHASES.full;
  } else if (phase < 0.72) {
    moon = MOON_PHASES.waningGibbous;
  } else if (phase < 0.78) {
    moon = MOON_PHASES.lastQuarter;
  } else {
    moon = MOON_PHASES.waningCrescent;
  }

  const icon = (
    <img
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

  const isVisible = lat && lon ? isMoonVisible(lat, lon, date) : undefined;

  const moonTimes = lat && lon ? getMoonTimes(date.toJSDate(), lat, lon) : undefined;

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