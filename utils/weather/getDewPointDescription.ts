import { TFunction } from "i18next";

export function getDewPointDescription(dewPoint: number, t: TFunction): string {
  if (dewPoint < -10) return t("dewPointTexts.extremelyDry");
  if (dewPoint < 0) return t("dewPointTexts.veryDry");
  if (dewPoint < 7) return t("dewPointTexts.dryAndComfortable");
  if (dewPoint < 13) return t("dewPointTexts.comfortable");
  if (dewPoint < 16) return t("dewPointTexts.veryComfortable");
  if (dewPoint < 18) return t("dewPointTexts.slightlyComfortable");
  if (dewPoint < 21) return t("dewPointTexts.slightlyHumid");
  if (dewPoint < 24) return t("dewPointTexts.humid");
  if (dewPoint < 27) return t("dewPointTexts.veryHumid");
  return t("dewPointTexts.oppressive");
}