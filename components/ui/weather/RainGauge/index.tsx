import React from "react";
import styles from "./RainGauge.module.css";
import { clamp } from "../../BottomSheet/utils";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { Tooltip } from "../../Tooltip";
import { getRainDescription } from "@/constants/descriptions";

export interface RainGaugeProps {
  /** Precipitation in millimeters. */
  mm: number;
  /** mm value that counts as "full" (100% fill). Default 10. */
  max?: number;
  /** Decimal places shown in the label. Default 1. */
  precision?: number;
  className?: string;
}

/**
 * A rounded, battery-style indicator: text shows the raw mm value, and a
 * background fill grows from left to right in proportion to how much of
 * `max` the current value represents. Text and fill both key off
 * `var(--wc-accent)`, so it re-themes with the rest of the app.
 */
export function RainGauge({ mm, max = 10, precision = 1, className }: RainGaugeProps) {
  const { t } = useTranslation();

  const pct = clamp(mm / max, 0, 1) * 100;

  const label = `${mm.toFixed(precision)}mm`;
  const title = getRainDescription(mm, t);

  const content = (
    <div
      className={classNames(styles.main, { [styles.gauge]: mm }, className)}
      style={{ "--fill": `${pct}%` } as React.CSSProperties}
      role="meter"
      aria-valuenow={mm}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuetext={`${label}`}
      aria-label="Precipitation"
    >
      {!mm ? <span>—</span> : (
        <>
          <span className={styles.sizer} aria-hidden="true">
            {label}
          </span>
          <span className={styles.fill} aria-hidden="true" />
          <span className={styles.label} aria-hidden="true">
            {label}
          </span>
        </>
      )}
    </div>
  );

  if (mm === 0) return content;
  return <Tooltip content={title}>{content}</Tooltip>;
}