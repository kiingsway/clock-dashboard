import styles from "./DailyForecast.module.css";
import { IWeather } from "@/types/weather.types";
import { DateTime } from "luxon";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import useBoolean from "@/hooks/useBoolean";
import ForecastDay from "./ForecastDay";
import { roundValues } from "@/utils/formatters/mathDateFormatters";
import DailySheet from "@/components/overlays/DailySheet";
import { useNow } from "@/contexts/NowContext";

export interface DailyForecastProps {
  weather: IWeather
}

/**
 * Day-by-day list in a height-capped, internally scrolling panel — so a
 * 16-day forecast doesn't push the rest of the screen off-view. Each row's
 * min–max bar is positioned relative to the coldest/warmest points across
 * the whole forecast window, so a glance at the bar shows where a day sits
 * in the week, not just its two numbers.
 */
export function DailyForecast({ weather }: DailyForecastProps) {
  const { t } = useTranslation();
  const { now } = useNow();
  const [expandedIndex, setExpandedIndex] = useState<number>();
  const [dailySheetOpen, { setTrue: openDaily, setFalse: closeDaily }] = useBoolean();

  const onExpandedIndexChange = (i: number | undefined): void => {
    setExpandedIndex(i)
    if (i) openDaily();
    else closeDaily()
  }

  const { daily, timezone } = weather;

  if (daily.time.length === 0) return null;

  const today = now.startOf("day");

  const forecastIndexes = daily.time.reduce<number[]>((acc, iso, index) => {
    const date = DateTime.fromISO(iso, { zone: timezone });
    if (date >= today) acc.push(index);
    return acc;
  }, []);

  if (forecastIndexes.length === 0) return null;

  const [weekMin, weekMax] = roundValues(
    Math.min(...forecastIndexes.map(i => daily.temperature_2m_min[i])),
    Math.max(...forecastIndexes.map(i => daily.temperature_2m_max[i]))
  );

  const onDebugClick = () => console.info("Daily forecast data:", { weather, weekMin, weekMax });

  return (
    <section className={styles.section} aria-label={t("nextDays")} onDoubleClick={onDebugClick}>

      {dailySheetOpen && (
        <DailySheet
          weather={weather}
          open={dailySheetOpen}
          onClose={closeDaily}
          index={expandedIndex}
        />
      )}

      <ul className={styles.list}>
        {forecastIndexes.map((i) => (
          <ForecastDay
            key={daily.time[i]}
            weather={weather}
            weekMin={weekMin}
            weekMax={weekMax}
            today={today}
            index={i}
            setExpandedIndex={onExpandedIndexChange} />
        ))}
      </ul>
    </section>
  );
}

