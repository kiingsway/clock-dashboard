import type { CSSProperties, ReactNode } from "react";
import type { TooltipPayload } from "recharts";
import styles from "./PrecipitationTooltip.module.scss";
import getAccentColor from "@/utils/weather/getAccentColor";
import { precipitationAreas } from "..";
import getWeatherCategory from "@/utils/weather/getWeatherCategory";
import { useTranslation } from "react-i18next";
import { getWindColor } from "@/utils/weather/getColors";
import WeatherIcon from "../../WeatherIcon";
import { getRainWindCondition } from "@/utils/weather/getRainWindCondition";
import { IPrecipChartData } from "@/types/chart.types";

type TPrecipAreas = "rain" | "showers" | "snowfall";

function getPrecipitationIcon(area: TPrecipAreas, isDay = true): string {
  const time = isDay ? "day" : "night";

  switch (area) {
    case "rain":
      return `mostly-clear-${time}-drizzle`;

    case "showers":
      return `mostly-clear-${time}-rain`;

    case "snowfall":
      return `mostly-clear-${time}-snow`;
  }
}

interface Props {
  active?: boolean;
  label?: string | number;
  payload?: TooltipPayload

  rainUnit?: string;
  snowUnit?: string;
  labelFormatter?: (label: ReactNode) => ReactNode;
};

interface ItemProp {
  area?: TPrecipAreas;
  label: string;
  value: number;
  valueColor?: string;
  unit: string;
  icon?: string;
}

export default function PrecipitationTooltip({
  active,
  payload,
  label,
  rainUnit = "mm",
  snowUnit = "cm",
  labelFormatter,
}: Props) {
  const { t } = useTranslation();
  if (!active || !payload?.length) return null;

  const { weatherCode, isDay, windGusts, temp, rain } = payload[0].payload as IPrecipChartData;

  const values = {
    rain: Number(payload.find((item) => item.dataKey === "rain")?.value ?? 0),
    showers: Number(payload.find((item) => item.dataKey === "showers")?.value ?? 0),
    snowfall: Number(payload.find((item) => item.dataKey === "snowfall")?.value ?? 0),
  };

  const units: Record<TPrecipAreas, string> = {
    rain: rainUnit,
    showers: rainUnit,
    snowfall: snowUnit,
  };

  const areaItems: ItemProp[] = precipitationAreas.map(area => ({
    area,
    label: t(`weatherTexts.rain.${area}`),
    value: values[area],
    unit: units[area],
  })).filter(i => Boolean(i.value));

  const infoItems: ItemProp[] = [
    {
      label: t('windGusts'),
      value: windGusts,
      valueColor: getWindColor(windGusts, 'gusts'),
      unit: 'km/h',
      icon: 'wind',
    }
  ];

  const items = [...areaItems, ...infoItems];

  const weatherCategory = getWeatherCategory(weatherCode, t);
  const accent = getAccentColor(weatherCategory.name, isDay);

  return (
    <div className={styles.tooltip} style={{ '--wc-accent': accent } as CSSProperties}>
      <div className={styles.header}>
        <span className={styles.time}>
          {labelFormatter ? labelFormatter(label) : label} - {Math.round(temp)}ºC, {weatherCategory.title}
        </span>

        <span className={styles.dot} />
      </div>

      <div className={styles.values}>
        {!items.length && (
          <div className={styles.item}>
            <WeatherIcon category={weatherCategory} size={30} />

            <span className={styles.label}>
            </span>

            <strong className={styles.value}>
              {t('noPrecipitation')}
            </strong>
          </div>
        )}
        {items.map(item => {
          const { area, label, value, unit, icon, valueColor } = item;

          return (
            <div className={styles.item} key={area + label}>
              {area && <WeatherIcon iconName={getPrecipitationIcon(area, isDay)} size={30} />}
              {icon && <WeatherIcon iconName={icon} size={30} />}

              <span className={styles.label}>
                {label}
              </span>

              <strong className={styles.value} style={{ color: valueColor }}>
                {value}
              </strong>

              <span className={styles.unit}>
                {unit}
              </span>
            </div>
          );
        })}

      </div>

      <span className={styles.description}>
        {getRainWindCondition(rain, windGusts, t).description}
      </span>
    </div>
  );
}