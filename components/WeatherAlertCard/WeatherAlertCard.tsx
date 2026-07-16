import { useState } from "react";
import type { SupportedLocale, WeatherAlertData } from "../../types/weather.types";
import styles from "./WeatherAlertCard.module.css";
import { useTranslation } from "react-i18next";
import { formatAlertUntil, getSeverityColor } from "@/utils/weatherAlerts";
import { Badge } from "../Badge";
import { DateTime } from "luxon";
import { capitalizeWords } from "@/utils/formatters";

export interface WeatherAlertCardProps {
  alert: WeatherAlertData;
  locale: SupportedLocale;
  timeZone?: string;
  /**
   * Reference "now" used to decide whether `event_end_datetime` needs a
   * weekday prefix or just a time. Defaults to the render time — pass it
   * explicitly if you're rendering a list and want them all consistent.
   */
  now?: DateTime;
}

/** How many characters of `alert_text_en` to show before offering "show more". */
const COLLAPSED_CHARS = 100;

/**
 * A single weather alert. The severity color (from `risk_colour_en`) shows
 * up as a left edge stripe and the title color — never as the whole card
 * background, so a red alert doesn't read as more alarming than it is on a
 * screen that's otherwise deliberately dim and dark. Title falls back to
 * `alert_short_name_en` if `alert_name_en` is empty; body text is clamped
 * with a "show more" toggle since Environment Canada's alert text can run
 * to several paragraphs.
 */
export function WeatherAlertCard({ alert, locale, timeZone, now = DateTime.now() }: WeatherAlertCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useTranslation()

  const severityColor = getSeverityColor(alert.risk_colour_en);
  const title = capitalizeWords(alert.alert_name_en || alert.alert_short_name_en);
  const until = formatAlertUntil(alert.event_end_datetime, now, locale, timeZone);

  const text = alert.alert_text_en?.trim() ?? "";
  const isLong = text.length > COLLAPSED_CHARS;
  const shownText = expanded || !isLong ? text : `${text.slice(0, COLLAPSED_CHARS).trimEnd()}…`;

  return (
    <div className={styles.card} style={{ ["--wc-severity" as string]: severityColor }}>
      <div className={styles.stripe} aria-hidden="true" />

      <div className={styles.body}>
        <div className={styles.headerRow}>
          <div className={styles.headerInfo}>
            <h3 className={styles.title} title={title}>{title}</h3>
            <span className={styles.dot} aria-hidden="true">·</span>
            <span className={styles.until} title={until}>
              {t('until')} {until}
            </span>
          </div>
          {alert.alert_type && (
            <span className={styles.typeTag}>
              <span className={styles.typeDot} aria-hidden="true" />
              {alert.alert_type}
            </span>
          )}
        </div>

        {(alert.status_en || alert.confidence_en || alert.impact_en) && expanded && (
          <div className={styles.metaRow}>
            {alert.status_en && (
              <Badge size="sm" variant="outline">
                {alert.status_en}
              </Badge>
            )}
            {alert.confidence_en && (
              <Badge size="sm" variant="outline">
                {t('confidence')}: {alert.confidence_en}
              </Badge>
            )}
            {alert.impact_en && (
              <Badge size="sm" variant="outline">
                {t('impact')}: {alert.impact_en}
              </Badge>
            )}
          </div>
        )}

        {shownText && (
          <p className={styles.description}>
            {shownText}{" "}
            {isLong && (
              <button type="button" className={styles.toggle} onClick={() => setExpanded((v) => !v)}>
                {expanded ? t('showLess') : t('showMore')}
              </button>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
