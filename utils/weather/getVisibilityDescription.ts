import { TFunction } from "i18next";
import { MIN_VISIBILITY_METERS, MAX_VISIBILITY_METERS } from "@/constants/visibility";

/**
 * Calcula a porcentagem de visibilidade com base nos dados do Open-Meteo.
 * @param visibilityMeters Visibilidade em metros retornada pela API
 * @returns Porcentagem truncada entre 0 e 100
 */
function getVisibilityPercentage(visibilityMeters: number): number {

  // Se for menor ou igual a 1 metro, a visibilidade é 0%
  if (visibilityMeters <= MIN_VISIBILITY_METERS) return 0;

  // Se for maior ou igual ao máximo, a visibilidade é 100%
  if (visibilityMeters >= MAX_VISIBILITY_METERS) return 100;

  // Aplica a regra de três dentro do intervalo definido
  const percentage = ((visibilityMeters - MIN_VISIBILITY_METERS) / (MAX_VISIBILITY_METERS - MIN_VISIBILITY_METERS)) * 100;

  // Retorna o número redondo para exibir direto na UI
  return Math.round(percentage);
}

export default function getVisibilityDescription(visibility: number, t: TFunction) {
  const percentage = getVisibilityPercentage(visibility);
  
  if (visibility >= 10000) return t("visibilityTextes.excellent") + ` (${percentage}%)`;
  if (visibility >= 5000) return t("visibilityTextes.good") + ` (${percentage}%)`;
  if (visibility >= 2000) return t("visibilityTextes.moderate") + ` (${percentage}%)`;
  if (visibility >= 1000) return t("visibilityTextes.low") + ` (${percentage}%)`;
  if (visibility >= 500) return t("visibilityTextes.veryLow") + ` (${percentage}%)`;
  return t("visibilityTextes.critical") + ` (${percentage}%)`;
};