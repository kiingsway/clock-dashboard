import styles from './WeatherAlertCard.module.scss';
import { type JSX } from 'react';
import { TbMapPin } from "react-icons/tb";
import { Badge } from '../../Badge';
import { IWeatherAlert } from '@/types/weatherAlerts.types';
import { useNow } from '@/contexts/NowContext';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { useTranslation } from 'react-i18next';
import formatAlertUntil from '@/utils/weatherAlerts/formatAlertUntil';
import useBoolean from '@/hooks/useBoolean';
import getSeverityColor from '@/utils/weatherAlerts/getSeverityColor';

/** Quantidade de caracteres da descrição exibida quando o card está colapsado */
const DESCRIPTION_PREVIEW_LENGTH = 120;

interface Props {
  alert: IWeatherAlert;
  autoExpand: boolean
}

export default function WeatherAlertCard({ alert, autoExpand }: Props): JSX.Element {
  const { t, i18n: { language: locale } } = useTranslation()
  const { get: { location: timezone } } = useAppSettings()
  const { now } = useNow();
  const [expanded, { toggle: toggleExpand }] = useBoolean(autoExpand);
  const showMore = (): void => autoExpand ? undefined : toggleExpand();

  const {
    title,
    status,
    description,
    expires,
    location,
    color,
    properties,
    descriptions,
  } = alert;

  const visibleProperties = properties.filter((p) => p.value?.trim());


  const isTruncatable = description.length > DESCRIPTION_PREVIEW_LENGTH;
  const displayedDescription =
    expanded || !isTruncatable
      ? description + ' '
      : `${description.slice(0, DESCRIPTION_PREVIEW_LENGTH).trimEnd()}... `;

  const until = formatAlertUntil(expires, now, locale, timezone);

  const accent = getSeverityColor(color);

  return (
    <div
      className={styles.card}
      style={{ ["--wc-accent" as string]: accent }}
      onClick={showMore}
    >
      <div className={styles.stripe} aria-hidden="true" />
      <div className={styles.body}>
        <div className={styles.header}>
          <div className={styles.status}>
            {/* <span className={styles.dot} style={{ backgroundColor: color }} /> */}
            <span className={styles.dot} />
            <span className={styles.statusText}>{status}</span>
          </div>

          <span className={styles.expires}>
            {t('until')} {until}
          </span>
        </div>

        <h3 className={styles.title}>{title}</h3>

        <div className={styles.location}>
          <TbMapPin className={styles.locationIcon} />
          <span>{location}</span>
        </div>

        {expanded && visibleProperties.length > 0 && (
          <div className={styles.properties}>
            {visibleProperties.map((prop, index) => (
              <Badge key={index} variant="accent">
                {prop.label}: {prop.value}
              </Badge>
            ))}
          </div>
        )}

        {description && (
          <p className={styles.description}>
            {displayedDescription}
            {isTruncatable && !autoExpand && (
              <span className={styles.toggle}>
                {expanded ? t('showLess') : t('showMore')}
              </span>
            )}
          </p>
        )}

        {expanded && descriptions.length > 0 && (
          <div className={styles.descriptions}>
            {descriptions.map((desc, index) => (
              <div key={index} className={styles.descriptionBlock}>
                <h4 className={styles.descriptionLabel}>{desc.label}</h4>
                <p className={styles.descriptionValue}>{desc.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}