import { TFunction } from "i18next";

export default function getHumidityDescription(humidity: number, t: TFunction): string {
  if (humidity < 20) return t("humidityTextes.extremelyDry");
  if (humidity < 30) return t("humidityTextes.veryDry");
  if (humidity < 40) return t("humidityTextes.dry");
  if (humidity <= 60) return t("humidityTextes.comfortable");
  if (humidity <= 70) return t("humidityTextes.slightlyHumid");
  if (humidity <= 80) return t("humidityTextes.humid");
  if (humidity <= 90) return t("humidityTextes.veryHumid");
  return t("humidityTextes.extremelyHumid");
}