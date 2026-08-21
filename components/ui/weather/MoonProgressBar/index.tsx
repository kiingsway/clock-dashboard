import type { JSX } from "react";
import { getMoonPhaseInfo } from "@/utils/weather/getMoonInfo";
import EventProgress from "../EventProgress";
import { IWeather, MoonPhaseIcon } from "@/types/weather.types";
import { DateTime } from "luxon";
import { useNow } from "@/contexts/NowContext";
import { getMoonIllumination } from "suncalc";

interface Props {
  weather: IWeather;
  date: DateTime
}

const f = (d?: DateTime) => !d ? undefined : d.toFormat('yyyy-LL-dd HH:mm:ss');

export default function MoonProgressBar({ weather, date }: Props): JSX.Element {
  const { now } = useNow();

  const moonNow = weather?.daily_moon?.find(m => m.date === date.toISODate());

  const [moonrise, moonset] = [moonNow?.moonrise, moonNow?.moonset].map(moonTime => {
    const datetime = moonTime ? DateTime.fromISO(moonTime).setZone(weather.timezone) : undefined;
    return datetime?.isValid ? datetime : undefined;
  });

  const progress = ((): number => {
    if (!moonrise?.isValid || !moonset?.isValid) return 0;

    if (now.toMillis() >= moonset.toMillis()) return 1;
    if (now.toMillis() <= moonrise.toMillis()) return 0;

    const elapsed = now.diff(moonrise, "milliseconds").milliseconds;
    const duration = moonset.diff(moonrise, "milliseconds").milliseconds;

    return elapsed / duration;
  })();

  const { moonrisePhase, moonsetPhase } = (() => {
    const phaseIconDefault: MoonPhaseIcon = { iconName: undefined, phase: undefined };
    let moonrisePhase: MoonPhaseIcon = phaseIconDefault;
    let moonsetPhase: MoonPhaseIcon = phaseIconDefault;

    if (moonrise?.isValid) {
      const { phase } = getMoonIllumination(moonrise.toJSDate());
      const { icon: iconName } = getMoonPhaseInfo(phase);
      moonrisePhase = { iconName, phase };
    }

    if (moonset?.isValid) {
      const { phase } = getMoonIllumination(moonset.toJSDate());
      const { icon: iconName } = getMoonPhaseInfo(phase);
      moonsetPhase = { iconName, phase };
    }

    return { moonrisePhase, moonsetPhase };
  })();


  const onDebugClick = (): void => console.info('Moon Progress Bar:', {
    moonriseDate: f(moonrise),
    moonsetDate: f(moonset),
    now: f(now),
    progress,
    moonrisePhase,
    moonsetPhase
  });

  return (
    <EventProgress
      start={moonrise}
      end={moonset}
      startIconName={moonrisePhase.iconName}
      endIconName={moonsetPhase.iconName}
      progress={progress}
      onDoubleClick={onDebugClick}
    />
  );
}