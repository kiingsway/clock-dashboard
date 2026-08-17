import { IWeatherAlert } from "@/types/weatherAlerts.types";

const COLOR_PRIORITY: Record<string, number> = {
  red: 0,
  orange: 1,
  yellow: 2,
  green: 3,
  grey: 4,
  gray: 4,
};

const STATUS_PRIORITY: Record<IWeatherAlert["status"], number> = {
  Extreme: 0,
  warning: 1,
  Severe: 2,
  Moderate: 3,
  watch: 4,
  Minor: 5,
  advisory: 6,
  statement: 7,
  Unknown: 8,
};

export default function sortWeatherAlerts(alerts: IWeatherAlert[]): IWeatherAlert[] {
  return [...alerts].sort((a, b) => {
    const colorDifference =
      (COLOR_PRIORITY[a.color?.trim().toLowerCase()] ?? 99) -
      (COLOR_PRIORITY[b.color?.trim().toLowerCase()] ?? 99);

    if (colorDifference !== 0) {
      return colorDifference;
    }

    const statusDifference =
      STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status];

    if (statusDifference !== 0) {
      return statusDifference;
    }

    return a.expires.toMillis() - b.expires.toMillis();
  });
}