import { WeatherAlertData, IWeatherAlert } from "@/types/weather.types";
import { DateTime } from "luxon";

const ALERT_TYPE_ORDER = [
  "warning",
  "watch",
  "advisory",
  "statement",
];

const RISK_COLOR_ORDER = [
  "red",
  "orange",
  "yellow",
];

function getAlertScore(alert: WeatherAlertData) {
  const typeScore =
    ALERT_TYPE_ORDER.indexOf(
      alert.alert_type?.trim().toLowerCase()
    );

  const colorScore =
    RISK_COLOR_ORDER.indexOf(
      alert.risk_colour_en?.trim().toLowerCase()
    );

  return {
    type: typeScore === -1 ? 999 : typeScore,
    color: colorScore === -1 ? 999 : colorScore,
    end: DateTime.fromISO(alert.event_end_datetime).toMillis(),
  };
}

export default function sortWeatherAlerts(alerts: IWeatherAlert[]) {
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