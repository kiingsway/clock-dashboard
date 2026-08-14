import styles from "./WeatherAlertCard.module.css";
import { useTranslation } from "react-i18next";
import useBoolean from "@/hooks/useBoolean";
import { TbMapPin } from "react-icons/tb";
import getSeverityColor from "@/utils/weatherAlerts/getSeverityColor";
import { IWeatherAlertCanadaProps } from "@/types/weatherAlerts.types";
import formatAlertUntil from "@/utils/weatherAlerts/formatAlertUntil";
import AlertCardHeader from "./AlertCardHeader";
import { capitalizeWords } from "@/utils/formatters/textFormatters";
import { Badge } from "../../Badge";
import { useNow } from "@/contexts/NowContext";

export interface WeatherAlertCardProps {
  alert: IWeatherAlertCanadaProps;
  timezone?: string;
  /**
   * Reference "now" used to decide whether `event_end_datetime` needs a
   * weekday prefix or just a time. Defaults to the render time — pass it
   * explicitly if you're rendering a list and want them all consistent.
   */
  autoExpand: boolean
}

/** How many characters of `alert_text_en` to show before offering "show more". */
const COLLAPSED_CHARS = 90;

/**
 * A single weather alert. The severity color (from `risk_colour_en`) shows
 * up as a left edge stripe and the title color — never as the whole card
 * background, so a red alert doesn't read as more alarming than it is on a
 * screen that's otherwise deliberately dim and dark. Title falls back to
 * `alert_short_name_en` if `alert_name_en` is empty; body text is clamped
 * with a "show more" toggle since Environment Canada's alert text can run
 * to several paragraphs.
 */
export function WeatherAlertCard({ alert, timezone: timezone, autoExpand }: WeatherAlertCardProps) {
  const { t, i18n: { language: locale } } = useTranslation();
  const { now } = useNow();
  const [expanded, { toggle: toggleExpand }] = useBoolean(autoExpand)
  const showMore = (): void => autoExpand ? undefined : toggleExpand();

  const severityColor = getSeverityColor(alert.risk_colour_en);
  const title = capitalizeWords(alert.alert_name_en || alert.alert_short_name_en);
  const until = formatAlertUntil(alert.event_end_datetime, now, locale, timezone);

  const text = alert.alert_text_en?.trim() ?? "";
  const isLong = text.length > COLLAPSED_CHARS;
  const shownText = autoExpand || expanded || !isLong ? text : `${text.slice(0, COLLAPSED_CHARS).trimEnd()}…`;

  return (
    <>
      <div
        className={styles.card}
        style={{ ["--wc-severity" as string]: severityColor }}
        onClick={showMore}
      >
        <div className={styles.stripe} aria-hidden="true" />

        <div className={styles.body}>
          <AlertCardHeader
            alertType={alert.alert_type}
            title={title}
            until={until} />

          {alert.feature_name_en && (
            <Badge size="sm" variant="ghost" icon={<TbMapPin />} className={styles.badge}>
              {alert.feature_name_en}
            </Badge>
          )}

          {(alert.status_en || alert.confidence_en || alert.impact_en) && (autoExpand || expanded) && (
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
              {isLong && !autoExpand && (
                <button type="button" className={styles.toggle}>
                  {expanded ? t('showLess') : t('showMore')}
                </button>
              )}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
