import { DateTime } from "luxon";
import { getMoonIllumination } from "suncalc";
import { getMoonPhaseInfo } from "./getMoonInfo";

type MoonPhaseIcon = { iconName: string | undefined; phase: number | undefined };

export default function getMoonriseSetPhase(moonrise: DateTime | undefined, moonset: DateTime | undefined) {
  const phaseIconDefault: MoonPhaseIcon = { iconName: undefined, phase: undefined };
  let moonrisePhase: MoonPhaseIcon = phaseIconDefault;
  let moonsetPhase: MoonPhaseIcon = phaseIconDefault;

  if (moonrise?.isValid) {
    const { phase } = getMoonIllumination(moonrise.toJSDate());
    const { icon: iconName } = getMoonPhaseInfo(phase);
    moonrisePhase = { iconName, phase };
  }

  if (moonset?.isValid) {
    const { phase } = getMoonIllumination(moonset.toJSDate());
    const { icon: iconName } = getMoonPhaseInfo(phase);
    moonsetPhase = { iconName, phase };
  }

  return { moonrisePhase, moonsetPhase };
}

export function getMoonriseSetDate(moonriseIso: string|undefined, moonsetIso: string|undefined, timezone: string) {
  const [moonrise, moonset] = [moonriseIso, moonsetIso].map(moonTime => {
    const datetime = moonTime ? DateTime.fromISO(moonTime).setZone(timezone) : undefined;
    return datetime?.isValid ? datetime : undefined;
  });
  return { moonrise, moonset };
}