import { TFunction } from "i18next";
import { getVisibilityPercentage } from "./getVisibilityInfo";

export default function getVisibilityDescription(visibility: number, t: TFunction) {
  const percentage = getVisibilityPercentage(visibility);
  if (visibility >= 10000) return t("visibilityTextes.excellent") + ` (${percentage}%)`;
  if (visibility >= 5000) return t("visibilityTextes.good") + ` (${percentage}%)`;
  if (visibility >= 2000) return t("visibilityTextes.moderate") + ` (${percentage}%)`;
  if (visibility >= 1000) return t("visibilityTextes.low") + ` (${percentage}%)`;
  if (visibility >= 500) return t("visibilityTextes.veryLow") + ` (${percentage}%)`;
  return t("visibilityTextes.critical") + ` (${percentage}%)`;
};