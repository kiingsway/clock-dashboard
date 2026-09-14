import { CSSProperties, useEffect, useState } from "react";
import { DateTime } from "luxon";
import { useTranslation } from "react-i18next";
import { TLocation } from "@/types/location.types";
import styles from "./SettingsSheet.module.css";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { LOCATION_OPTIONS } from "@/constants/locations";
import { usePortalContainer } from "@/hooks/usePortalContainer";
import useAppSettings from "@/contexts/AppSettingsContext";
import Alert from "@/components/ui/Alert";
import Slider from "@/components/ui/Slider";
import { ALERT_RADIUS_KM, RAIN_ALERT_HOURS, SUNWINDOW_BEFORE_MINUTES, LANGUAGES, AQI_SCALES } from "@/constants/settings";
import { capitalizeWords } from "@/utils/formatters/textFormatters";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { SlGlobe } from "react-icons/sl";
import { GrMap } from "react-icons/gr";
import { FiCloudRain, FiSunset, FiWind } from "react-icons/fi";
import { TbClock, TbTemperature, TbInfoCircle } from "react-icons/tb";
import { PiMapPinAreaBold } from "react-icons/pi";
import { TbClock12, TbClock24 } from "react-icons/tb";
import { RxSlider } from "react-icons/rx";
import { VscScreenFull, VscScreenNormal } from "react-icons/vsc";
import { AQIScale } from "@/types/aqi.types";
import { FaRegWindowRestore } from "react-icons/fa";
import SettingsSection, { SettingRow, buildBooleanSettingRow, VersionBadge } from "./SettingsSection";
import { Modal } from "@/components/ui/Modal";

interface Props {
  open: boolean;
  onClose: () => void;
  updatedAt?: string;
  onUpdatedAtClick?: () => void;
  style?: CSSProperties;
  alertsError?: unknown;
  accent: string;
}

/**
 * Settings sheet: language, forecast location, alert radius, last-updated
 * time, and app version, grouped into categories. Each row follows the same
 * icon / title / description / control shape so new settings drop in
 * without new layout work.
 */
export default function SettingsSheet(p: Props) {
  return (
    <ErrorBoundary>
      <SettingsSheetContent {...p} />
    </ErrorBoundary>
  );
}

export function SettingsSheetContent({
  open,
  onClose,
  updatedAt,
  onUpdatedAtClick,
  alertsError,
  accent,
  style: styleProp,
}: Props) {
  const { t, i18n } = useTranslation();
  const { set, get, weatherLocation } = useAppSettings();

  const [draftRadius, setDraftRadius] = useState(get.alertRadiusKm);
  const [draftPrecipHrs, setDraftPrecipHrs] = useState(get.precipHoursRange);
  const [draftSunAlertThresholdMinutes, setDraftSunAlertThresholdMinutes] = useState(get.sunAlertThresholdMinutes);
  const portalContainer = usePortalContainer(".root");

  // se o valor mudar por fora (ex: carregado do storage depois), sincroniza
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraftRadius(get.alertRadiusKm);
    setDraftPrecipHrs(get.precipHoursRange);
    setDraftSunAlertThresholdMinutes(get.sunAlertThresholdMinutes);
  }, [get.alertRadiusKm, get.precipHoursRange, get.sunAlertThresholdMinutes]);

  const commitRadius = (raw: number) => {
    if (raw !== get.alertRadiusKm) set.alertRadiusKm(raw);
  };

  const commitPrecipHrs = (raw: number) => {
    if (raw !== get.precipHoursRange) set.precipHoursRange(raw);
  };

  const commitDraftSunAlertThresholdMinutes = (raw: number) => {
    if (raw !== get.sunAlertThresholdMinutes) set.sunAlertThresholdMinutes(raw);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  const updatedAtHour = updatedAt
    ? DateTime.fromISO(updatedAt, { zone: get.location }).toFormat("HH:mm")
    : "--:--";

  const booleanSettingsKeys = [
    { key: 'showFeelsLikeWhenEqual', icon: <TbTemperature /> },
    { key: 'showMinMaxPeakBadge', icon: <RxSlider /> },
    { key: 'focusCurrentWeatherOnLaunch', icon: (v: boolean) => v ? <VscScreenFull /> : <VscScreenNormal /> },
    { key: 'useBottomSheet', icon: <FaRegWindowRestore /> }
  ] as const;

  const style = {
    ...styleProp,
    '--wc-accent': accent,
    marginBottom: get.useBottomSheet ? 150 : 0,
  } as CSSProperties;

  const content = (
    <form className={styles.form} onSubmit={(e) => e.preventDefault()} tabIndex={-1} style={style}>
      {Boolean(alertsError) && (
        <Alert
          title="Failed to fetch weather alerts"
          message={String(alertsError)}
          variant="danger" />
      )}
      <SettingsSection title={t("settingsTexts.general.title")}>
        <SettingRow
          icon={<SlGlobe />}
          title={t("language")}
          description={t("settingsTexts.general.language")}
          htmlFor="language"
          control={
            <select
              id="language"
              className={styles.select}
              value={i18n.language}
              onChange={handleLanguageChange}
            >
              {LANGUAGES.map(({ label, value }) =>
                <option key={value} value={value}>{label}</option>)}
            </select>
          }
        />
        <SettingRow
          icon={<GrMap />}
          title={t("location")}
          description={t("settingsTexts.general.location")}
          htmlFor="location"
          control={
            <select
              id="location"
              className={styles.select}
              value={get.location}
              onChange={(e) => set.location(e.target.value as TLocation)}
            >
              {LOCATION_OPTIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {t(`cities.${loc.split("/")[1]}`)}
                </option>
              ))}
            </select>
          }
        />

        {buildBooleanSettingRow({ get, icon: get.is12hour ? <TbClock12 /> : <TbClock24 />, key: 'is12hour', set, t })}
      </SettingsSection>

      <SettingsSection title={t("aqiTextes.scale.title")}>

        <SettingRow
          icon={<FiWind />}
          title={t("aqiTextes.scale.title")}
          description={t("settingsTexts.general.aqiScale")}
          htmlFor="aqiScale"
          control={
            <select
              id="aqiScale"
              className={styles.select}
              value={get.aqiScale}
              onChange={e => set.aqiScale(e.target.value as AQIScale)}
            >
              {AQI_SCALES.map(scale =>
                <option key={scale} value={scale}>{capitalizeWords(scale)}</option>)}
            </select>
          }
        />

      </SettingsSection>

      <SettingsSection title={t("settingsTexts.alerts.title")}>

        <SettingRow
          icon={<PiMapPinAreaBold />}
          title={t("settingsTexts.alerts.radius.title")}
          description={t("settingsTexts.alerts.radius.description")}
          value={`${draftRadius} ${t('km')}`}
          htmlFor="alertRadius"
          hide={!(['CA'].includes(weatherLocation?.country || ""))}
          control={
            <Slider
              id="alertRadius"
              min={ALERT_RADIUS_KM.MIN}
              max={ALERT_RADIUS_KM.MAX}
              step={ALERT_RADIUS_KM.STEP}
              value={draftRadius}
              onChange={setDraftRadius}
              onCommit={commitRadius}
              unit={t("km")}
              snapToMultiples
            />
          }
        />

        <SettingRow
          icon={<FiCloudRain />}
          title={t('precipitationRange')}
          description={t('precipitationRangeDescription')}
          value={`${draftPrecipHrs} ${t('hrs')}`}
          htmlFor="alertPrecipHrs"
          control={
            <Slider
              id="alertPrecipHrs"
              min={RAIN_ALERT_HOURS.MIN}
              max={RAIN_ALERT_HOURS.MAX}
              step={1}
              value={draftPrecipHrs}
              onChange={setDraftPrecipHrs}
              onCommit={commitPrecipHrs}
              unit={t('hrs')}
            />
          }
        />

        <SettingRow
          icon={<FiSunset />}
          title={t("settingsTexts.appearance.sunAlertThresholdMinutes.title")}
          description={t('settingsTexts.appearance.sunAlertThresholdMinutes.desc')}
          value={`${draftSunAlertThresholdMinutes} ${t('min_minute')}`}
          htmlFor="sunWindowIconBeforeMinutes"
          control={
            <Slider
              id="sunWindowIconBeforeMinutes"
              min={SUNWINDOW_BEFORE_MINUTES.MIN}
              max={SUNWINDOW_BEFORE_MINUTES.MAX}
              step={SUNWINDOW_BEFORE_MINUTES.STEP}
              value={draftSunAlertThresholdMinutes}
              onChange={setDraftSunAlertThresholdMinutes}
              onCommit={commitDraftSunAlertThresholdMinutes}
              unit={t('min_minute')}
            />
          }
        />

      </SettingsSection>

      <SettingsSection title={t("settingsTexts.appearance.title")}>

        {booleanSettingsKeys.map(({ key, icon }) => {
          return buildBooleanSettingRow({ get, icon, key, set, t });
        })}

      </SettingsSection>

      <SettingsSection title={t("settingsTexts.status.title")}>
        <SettingRow
          icon={<TbClock />}
          title={t("weatherUpdatedAt")}
          description={t("settingsTexts.status.updatedAtDesc")}
          value={updatedAtHour}
          onDoubleClick={onUpdatedAtClick}
        />
        <SettingRow
          icon={<TbInfoCircle />}
          title={t("version")}
          description={t("settingsTexts.status.version")}
          value={<VersionBadge />}
        />
      </SettingsSection>
    </form>
  );

  if (!get.useBottomSheet) return (
    <Modal
      open={open}
      onClose={onClose}
      title={t("settings")}
    >
      {content}
    </Modal>
  );

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={t("settings")}
      ariaLabel={t("settings")}
      snapPoints={[0.4, 0.6, 0.9]}
      initialSnap={0}
      dismissible
      container={portalContainer}
    >
      {content}
    </BottomSheet>
  );
}