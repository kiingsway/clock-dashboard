import { getSunshineDurationDescription, getDaylightDurationDescription } from "@/constants/descriptions";
import { TFunction } from "i18next";
import { formatDuration } from "../formatters/dateFormatters";
import { getDaylightColor } from "./getColors";

export const getDaylightSunshineInfo = (seconds: number, kind: 'sunshine' | 'daylight', isDay: boolean, t: TFunction) => {

  const isSunshine = kind === 'sunshine';

  const time = formatDuration(seconds);
  const title = t(kind);
  const desc = (isSunshine ? getSunshineDurationDescription : getDaylightDurationDescription)(seconds, t);
  const color = getDaylightColor(seconds);

  const event = isDay ? 'day' : 'night';

  const icon = (() => {
    const hours = seconds / 3600;
    if (hours < 0.5) return 'overcast';
    if (hours < 2) return `partly-cloudy-${event}`;
    if (hours < 4) return `mostly-clear-${event}`;

    return isSunshine ? 'sunrise' : 'dust-day';
  })();

  return { title, time, desc, icon, color };
};
