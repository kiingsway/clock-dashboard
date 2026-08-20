import { TFunction } from "i18next";

export default function getDaylightDurationDescription(durationSeconds: number, t: TFunction): string {
  const hours = durationSeconds / 3600;

  if (hours < 8) return t("daylightTextes.veryShort");
  if (hours < 10) return t("daylightTextes.short");
  if (hours < 12) return t("daylightTextes.belowAverage");
  if (hours < 13) return t("daylightTextes.balanced");
  if (hours < 15) return t("daylightTextes.long");
  if (hours < 17) return t("daylightTextes.veryLong");

  return t("daylightTextes.exceptionallyLong");
}

export function getSunshineDurationDescription(durationSeconds: number, t: TFunction): string {
  const hours = durationSeconds / 3600;

  if (hours <= 0.5) return t("sunshineTextes.none");
  if (hours < 2) return t("sunshineTextes.veryLittle");
  if (hours < 4) return t("sunshineTextes.limited");
  if (hours < 6) return t("sunshineTextes.moderate");
  if (hours < 9) return t("sunshineTextes.plenty");
  if (hours < 12) return t("sunshineTextes.verySunny");

  return t("sunshineTextes.exceptionallySunny");
}