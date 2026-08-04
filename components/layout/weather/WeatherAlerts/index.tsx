import { Modal } from "@/components/ui/Modal";
import useBoolean from "@/hooks/useBoolean";
import { IWeatherAlertCanada } from "@/types/weatherAlerts.types";
import { useTranslation } from "react-i18next";
import styles from './WeatherAlerts.module.css'
import { capitalizeWords } from "@/utils/formatters/textFormatters";
import getSeverityColor from "@/utils/weatherAlerts/getSeverityColor";
import sortWeatherAlerts from "@/utils/weatherAlerts/sortWeatherAlerts";
import { WeatherAlertCard } from "@/components/ui/weather/WeatherAlertCard/WeatherAlertCard";
import { BottomSheet } from "@/components/ui/BottomSheet";

interface Props {
  alerts: IWeatherAlertCanada[];
  locale: string;
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
      <BottomSheet
        open={alertsModalOpen}
        onClose={closeModal}
        title={t('alert', { count: alerts.length })}
        ariaLabel={t('close')}
        snapPoints={[0.6, 0.95]}
        initialSnap={0}
        dismissible
        container={document.querySelector(".root")}
      >
        <div className={styles.modalList} onDoubleClick={onDebugClick}>
          {worstAlerts.map(alert => <WeatherAlertCard key={alert.id} alert={alert.properties} locale={locale} autoExpand={alerts.length === 1} />)}
        </div>
      </BottomSheet>

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
              `${alerts.length} ${t('alerts')}`
              :
              worstAlerts[0].properties.alert_type
            }</span>
          </span>

        </div>
      </div>
    </>
  )
}
