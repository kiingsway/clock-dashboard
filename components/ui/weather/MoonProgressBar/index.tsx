import type { JSX } from "react";
import EventProgress from "../EventProgress";
import { IMoonDaily } from "@/types/weather.types";
import { DateTime } from "luxon";
import getMoonriseSetPhase, { getMoonriseSetDate } from "@/utils/weather/getMoonriseSetPhase";

interface Props {
  timezone: string;
  dailyMoon: IMoonDaily[];
  date: DateTime
}

export default function MoonProgressBar({ dailyMoon, timezone, date }: Props): JSX.Element {

  const moonNow = dailyMoon.find(m => m.date === date.toISODate());

  const { moonrise, moonset } = getMoonriseSetDate(moonNow?.moonrise, moonNow?.moonset, timezone);

  const { moonrisePhase, moonsetPhase } = getMoonriseSetPhase(moonrise, moonset);

  return (
    <EventProgress
      start={moonrise}
      end={moonset}
      startIcon={moonrisePhase.iconName ? { iconName: moonrisePhase.iconName } : undefined}
      endIcon={moonsetPhase.iconName ? { iconName: moonsetPhase.iconName } : undefined}
    />
  );
}
