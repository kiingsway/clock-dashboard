import { IWeatherAlertCanada } from "@/types/weatherAlerts.types";
import getAlertScore from "./getAlertScore";

export default function sortWeatherAlerts(alerts: IWeatherAlertCanada[]) {
  return [...alerts].sort((a, b) => {
    const aScore = getAlertScore(a.properties);
    const bScore = getAlertScore(b.properties);

    // 1. Tipo
    if (aScore.type !== bScore.type) {
      return aScore.type - bScore.type;
    }

    // 2. Cor
    if (aScore.color !== bScore.color) {
      return aScore.color - bScore.color;
    }

    // 3. Termina primeiro vem primeiro
    return aScore.end - bScore.end;
  });
}