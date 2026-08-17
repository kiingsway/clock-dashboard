import { ALERT_TYPE_ORDER, RISK_COLOR_ORDER } from "@/constants/alerts";
import { IWeatherAlertCanadaProps } from "@/types/WeatherAlerts/canada.types";
import { DateTime } from "luxon";

export default function getAlertScore(alert: IWeatherAlertCanadaProps) {
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
