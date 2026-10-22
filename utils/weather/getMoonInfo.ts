import MOON_PHASES from "@/constants/moonPhases";
import { IMoonInfo, NameIcon } from "@/types/weatherInfo.types";
import { DateTime } from "luxon";
import { getMoonIllumination, getMoonPosition } from "suncalc";
import { getIconUrl } from "@/constants/iconFiles";
import { TFunction } from "i18next";

/** Altitude (degrees) above which the moon counts as visible. */
const MOON_VISIBLE_ALTITUDE = 2;

function getMoonPhaseInfo(phase: number): NameIcon {
  if (phase < 1 / 16 || phase >= 15 / 16) return MOON_PHASES.new;
  if (phase < 3 / 16) return MOON_PHASES.waxingCrescent;
  if (phase < 5 / 16) return MOON_PHASES.firstQuarter;
  if (phase < 7 / 16) return MOON_PHASES.waxingGibbous;
  if (phase < 9 / 16) return MOON_PHASES.full;
  if (phase < 11 / 16) return MOON_PHASES.waningGibbous;
  if (phase < 13 / 16) return MOON_PHASES.lastQuarter;
  return MOON_PHASES.waningCrescent;
}

/** Moon phase, icon and whether it's above the horizon at `date`, for a location. */
export function getMoonInfo(date: DateTime, lat: number, lon: number): IMoonInfo {
  const { phase } = getMoonIllumination(date.toJSDate());
  const { altitude } = getMoonPosition(date.toJSDate(), lat, lon);
  const { name, icon: iconName } = getMoonPhaseInfo(phase);

  return {
    name,
    phase,
    iconName,
    iconSrc: getIconUrl(iconName),
    isVisible: altitude > MOON_VISIBLE_ALTITUDE,
  };
}

type DateKind = Date | DateTime<boolean> | DateTime<true> | DateTime<false> | undefined;

interface IMoonNameIconPhase {
  name: string;
  date: DateTime<true>;
  iconName: string;
  phase: number;
}

/** Moon phase name (translated when `t` is given), icon and phase at `date`. */
export function getMoonNameIconPhase(date: DateTime<true>, t?: TFunction): IMoonNameIconPhase;
export function getMoonNameIconPhase(date: undefined | DateTime<false>, t?: TFunction): undefined;
export function getMoonNameIconPhase(date: DateKind, t?: TFunction): IMoonNameIconPhase | undefined;
export function getMoonNameIconPhase(dateJS: DateKind, t?: TFunction): IMoonNameIconPhase | undefined {
  const date = dateJS instanceof DateTime
    ? dateJS
    : dateJS
      ? DateTime.fromJSDate(dateJS)
      : undefined;

  if (!date?.isValid) return undefined;

  const { phase } = getMoonIllumination(date.toJSDate());
  const { name, icon: iconName } = getMoonPhaseInfo(phase);

  return { name: t ? t(name) : name, date: date as DateTime<true>, iconName, phase };
}
