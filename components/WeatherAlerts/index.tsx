import { IWeatherAlert, SupportedLocale } from "@/types/weather.types";
import styles from './WeatherAlerts.module.css'
import { getSeverityColor } from "@/utils/weatherAlerts";
import { WeatherAlertCard } from "../WeatherAlertCard/WeatherAlertCard";
import useBoolean from "@/hooks/useBoolean";
import sortWeatherAlerts from "@/utils/sortWeatherAlerts";
import { useTranslation } from "react-i18next";
import { Modal } from "../SettingsModal/Modal/Modal";
import { capitalizeWords } from "@/utils/formatters";

interface Props {
  alerts: IWeatherAlert[];
  locale: SupportedLocale;
  timeZone?: string;
}

/**
 * Groups multiple WeatherAlertCards under one header. Sorts by severity
 * (worst first) so the most urgent alert is always the one visible when
 * collapsed. Shows just the header (count + worst-severity dot) when there's
 * only one alert would be overkill, so with a single alert it renders the
 * card directly, no wrapper chrome.
 */
export default function WeatherAlerts({ alerts, locale }: Props) {
  const { t } = useTranslation();

  const [alertsModalOpen, { setTrue: openModal, setFalse: closeModal }] = useBoolean()

  if (alerts.length === 0) return null;

  const worstAlerts = sortWeatherAlerts(alerts);

  const riskColors = [... new Set(worstAlerts.map(wa => getSeverityColor(wa.properties.risk_colour_en)))].reverse()
  const worstColor = riskColors.at(-1);

  const titles = [...new Set(worstAlerts.map(a => capitalizeWords(a.properties.alert_short_name_en || a.properties.alert_name_en)))]
  const title = titles.length === 1 ? capitalizeWords(worstAlerts[0].properties.alert_name_en) : titles[0]
  const titlePlus = titles.length > 1 ? ` + ${titles.length - 1}` : ''

  const onDebugClick = (): void => console.info('Alerts:', alerts)

  return (
    <>
      <Modal open={alertsModalOpen} onClose={closeModal} title={t('alert', { count: alerts.length })} closeLabel={t('close')}>
        <div className={styles.modalList} onDoubleClick={onDebugClick}>
          {worstAlerts.map(alert => <WeatherAlertCard key={alert.id} alert={alert.properties} locale={locale} autoExpand={alerts.length === 1} />)}
        </div>
      </Modal>

      <div className={styles.main} style={{ ["--wc-severity" as string]: worstColor }} onClick={openModal}>
        <div className={styles.stripe} aria-hidden="true" />
        <div className={styles.body}>
          <div className={styles.bodyLeft}>
            <h3 className={styles.title} title={title}>{title}</h3>
            <span className={styles.desc}>{titlePlus}</span>
          </div>

          <span className={styles.typeTag}>
            {riskColors.map(rc => <span key={rc} style={{ ["--wc-severity" as string]: rc }} className={styles.typeDot} aria-hidden="true" />)}
            <span>{alerts.length > 1 ?
              `${alerts.length} alerts`
              :
              worstAlerts[0].properties.alert_type
            }</span>
          </span>

        </div>
      </div>
    </>
  )
}
