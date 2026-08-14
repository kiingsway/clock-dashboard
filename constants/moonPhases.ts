import { NameIcon } from "@/types/weatherInfo.types";

const MOON_PHASES: Record<string, NameIcon> = {
  new: {
    name: "moonPhases.new",
    icon: "moon-new",
  },
  waxingCrescent: {
    name: "moonPhases.waxingCrescent",
    icon: "moon-waxing-crescent",
  },
  firstQuarter: {
    name: "moonPhases.firstQuarter",
    icon: "moon-first-quarter",
  },
  waxingGibbous: {
    name: "moonPhases.waxingGibbous",
    icon: "moon-waxing-gibbous",
  },
  full: {
    name: "moonPhases.full",
    icon: "moon-full",
  },
  waningGibbous: {
    name: "moonPhases.waningGibbous",
    icon: "moon-waning-gibbous",
  },
  lastQuarter: {
    name: "moonPhases.lastQuarter",
    icon: "moon-last-quarter",
  },
  waningCrescent: {
    name: "moonPhases.waningCrescent",
    icon: "moon-waning-crescent",
  },
} as const;

export default MOON_PHASES;