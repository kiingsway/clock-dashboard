import styles from "./DailyForecast.module.css";
import { IWeather } from "@/types/weather.types";
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import ForecastDay from "./ForecastDay";
import DailySheet from "@/components/overlays/DailySheet";
import { useNow } from "@/contexts/NowContext";
import { IDailyData } from "@/types/weatherInfo.types";
import { splitCamelCase } from "@/utils/formatters/textFormatters";
import buildDailyForecastItem from "./buildDailyForecastItem";

interface Props {
  weather: IWeather
}

/**
 * Day-by-day list in a height-capped, internally scrolling panel — so a
 * 16-day forecast doesn't push the rest of the screen off-view. Each row's
 * min–max bar is positioned relative to the coldest/warmest points across
 * the whole forecast window, so a glance at the bar shows where a day sits
 * in the week, not just its two numbers.
 */
export function DailyForecast({ weather }: Props) {
  const { t, i18n: { language: locale } } = useTranslation();
  const { today } = useNow();

  const [selectedDailyItem, selectDailyItem] = useState<IDailyData>();

  const dailyForecastItems = useMemo(() =>
    buildDailyForecastItem({ weather, today, locale, t }),
    [locale, today, t, weather]);

  const onDebugClick = () => console.info(splitCamelCase(DailyForecast.name), { dailyForecastItems, daily: weather.daily });

  return (
    <section className={styles.section} aria-label={t("nextDays")} onDoubleClick={onDebugClick}>

      {selectedDailyItem?.index && (
        <DailySheet
          weather={weather}
          open={Boolean(selectedDailyItem)}
          onClose={() => selectDailyItem(undefined)}
          index={selectedDailyItem.index}
        />
      )}

      <ul className={styles.list}>
        {dailyForecastItems.map(item => (
          <ForecastDay
            key={item.key}
            item={item}
            onClick={() => selectDailyItem(item)}
          />
        ))}
      </ul>
    </section>
  )
}

