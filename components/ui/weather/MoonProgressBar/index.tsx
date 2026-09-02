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

  const isSetBeforeRise = (() => {
    if (!moonNow || !moonNow?.rise?.date || !moonNow?.set?.date) return false;
    return moonNow.set.date < moonNow.rise.date;
  })();

  const startEvent = isSetBeforeRise ? moonNow?.set : moonNow?.rise;
  const endEvent = !isSetBeforeRise ? moonNow?.set : moonNow?.rise;

  const progress = (() => {
    if (!moonNow || !startEvent || !endEvent) return 0;
    const start = DateTime.fromISO(startEvent.date);
    const end = DateTime.fromISO(endEvent.date);

    if (isValidDateTime(start) && isValidDateTime(end)) return getProgressBetweenDates(start, end, now);
    return 0;
  })();

  const accentPhase = (() => {
    if (startEvent && progress < 0.5) return startEvent.phase;
    if (endEvent && progress >= 0.5) return endEvent.phase;
    return moonNow?.date?.phase ?? undefined;
  })();

  const style = {
    '--wc-sun-accent': typeof accentPhase === 'number' ? getGradientColor(accentPhase * 100, MOON_COLORS) : 'var(--w-night)',
  } as CSSProperties;

  return (
    <EventProgress
      style={style}
      start={startEvent?.date}
      end={endEvent?.date}
      startIcon={getIconProp(startEvent?.iconName)}
      endIcon={getIconProp(endEvent?.iconName)}
      progress={progress}
      type={isSetBeforeRise ? 'ghost' : 'default'}
    />
  );
}

const getIconProp = (iconName?: string) => iconName ? ({ iconName }) : undefined;