import { IWeather } from "@/types/weather.types";
import { formatLocaleNumber } from "../formatters/textFormatters";
import { getCurrentValue } from "../formatters/getValueByArray";
import { DateTime } from "luxon";
import { TFunction } from "i18next";
import { MAX_VISIBILITY_METERS, MIN_VISIBILITY_METERS } from "@/constants/visibility";
import { getVisibilityColor } from "./getColors";

export interface IVisibilityInfo {
  value: number;
  title: string;
  color: string;
  desc: string;
  unit: string;
}

export default function getVisibilityInfo(weather: IWeather, date: DateTime<boolean>, locale: string, t: TFunction): IVisibilityInfo | undefined {

  const { hourly, hourly_units } = weather

  const visibility = getCurrentValue({ date, time: hourly.time, values: hourly.visibility });

  if (!visibility) return undefined;

  const color = getVisibilityColor(visibility)

  const title = formatLocaleNumber(visibility, locale) + hourly_units.visibility;

  const percentage = getVisibilityPercentage(visibility)

  const desc = (() => {
    if (visibility >= 10000) return t("visibilityTextes.excellent") + ` (${percentage}%)`;
    if (visibility >= 5000) return t("visibilityTextes.good") + ` (${percentage}%)`;
    if (visibility >= 2000) return t("visibilityTextes.moderate") + ` (${percentage}%)`;
    if (visibility >= 1000) return t("visibilityTextes.low") + ` (${percentage}%)`;
    if (visibility >= 500) return t("visibilityTextes.veryLow") + ` (${percentage}%)`;
    return t("visibilityTextes.critical") + ` (${percentage}%)`;
  })();

  return { value: visibility, title, color, desc, unit: hourly_units.visibility }

}

/**
 * Calcula a porcentagem de visibilidade com base nos dados do Open-Meteo.
 * @param visibilityMeters Visibilidade em metros retornada pela API
 * @returns Porcentagem truncada entre 0 e 100
 */
export function getVisibilityPercentage(visibilityMeters: number): number {

  // Se for menor ou igual a 1 metro, a visibilidade é 0%
  if (visibilityMeters <= MIN_VISIBILITY_METERS) return 0;

  // Se for maior ou igual ao máximo, a visibilidade é 100%
  if (visibilityMeters >= MAX_VISIBILITY_METERS) return 100;

  // Aplica a regra de três dentro do intervalo definido
  const percentage = ((visibilityMeters - MIN_VISIBILITY_METERS) / (MAX_VISIBILITY_METERS - MIN_VISIBILITY_METERS)) * 100;

  // Retorna o número redondo para exibir direto na UI
  return Math.round(percentage);
}