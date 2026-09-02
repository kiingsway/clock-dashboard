import { DateTime } from "luxon";
import { getMoonIllumination } from "suncalc";
import { getMoonPhaseInfo } from "./getMoonInfo";
import { TFunction } from "i18next";

type DateKind = Date | DateTime<boolean> | DateTime<true> | DateTime<false> | undefined;

function getMoonNameIconPhase(date: DateTime<true>, t?: TFunction): {
  name: string;
  date: DateTime<true>;
  iconName: string;
  phase: number;
};

function getMoonNameIconPhase(date: undefined | DateTime<false>, t?: TFunction): undefined;

function getMoonNameIconPhase(date: DateKind, t?: TFunction): {
  name: string;
  date: DateTime<true>;
  iconName: string;
  phase: number;
} | undefined;

function getMoonNameIconPhase(dateJS: DateKind, t?: TFunction) {
  const date = dateJS instanceof DateTime
    ? dateJS
    : dateJS
      ? DateTime.fromJSDate(dateJS)
      : undefined;

  if (!date?.isValid) return undefined;

  const { phase } = getMoonIllumination(date.toJSDate());
  const { name, icon: iconName } = getMoonPhaseInfo(phase);

  return { name: t ? t(name) : name, date, iconName, phase };
}

export default getMoonNameIconPhase;