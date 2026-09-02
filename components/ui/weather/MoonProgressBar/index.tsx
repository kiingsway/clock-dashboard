import type { CSSProperties, JSX } from "react";
import EventProgress from "../EventProgress";
import { IMoonDailyItem } from "@/types/weather.types";
import { DateTime } from "luxon";
import { getGradientColor } from "@/utils/weather/getColors";
import { MOON_COLORS } from "@/constants/colors";
import { getProgressBetweenDates, isValidDateTime } from "@/utils/formatters/dateFormatters";
import { useNow } from "@/contexts/NowContext";

interface Props {
  timezone: string;
  dailyMoon: IMoonDailyItem[];
  date: DateTime
}

export default function MoonProgressBar({ dailyMoon, date }: Props): JSX.Element {
  const { now } = useNow();

  const moonNow = dailyMoon.find(m => m.date.date === date.toISODate());

  const progress = (() => {
    if (!moonNow || !moonNow?.rise?.date || !moonNow?.set?.date) return 0;
    const start = DateTime.fromISO(moonNow.rise.date);
    const end = DateTime.fromISO(moonNow.set.date);

    if (isValidDateTime(start) && isValidDateTime(end)) return getProgressBetweenDates(start, end, now);
    return 0;
  })();

  const accentPhase = (() => {
    if (!moonNow) return undefined;
    if (moonNow.rise?.date && progress < 0.5) return moonNow.rise.phase;
    if (moonNow.set?.date && progress >= 0.5) return moonNow.set.phase;
    return moonNow.date.phase ?? undefined;
  })();

  const style = {
    '--wc-sun-accent': typeof accentPhase === 'number' ? getGradientColor(accentPhase * 100, MOON_COLORS) : 'var(--w-night)',
  } as CSSProperties;

  return (
    <EventProgress
      style={style}
      start={moonNow?.rise?.date}
      end={moonNow?.set?.date}
      startIcon={moonNow?.rise?.iconName ? { iconName: moonNow?.rise?.iconName } : undefined}
      endIcon={moonNow?.set?.iconName ? { iconName: moonNow?.set?.iconName } : undefined}
      progress={progress}
    />
  );
}
