import { IMoonInfo } from "@/types/weatherInfo.types";

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

export default MOON_PHASES;