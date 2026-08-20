import { JSX, useEffect, useState } from "react";
import { DateTime } from "luxon";
import { useTranslation } from "react-i18next";
import { TLocation } from "@/types/location.types";
import { APP_INFO } from "@/constants/appInfo";
import { Badge } from "@/components/ui/Badge";
import styles from "./SettingsSheet.module.css";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { LanguageIcon, LocationIcon, RadiusIcon, ClockIcon, InfoIcon, RainCardIcon } from "./Icons";
import { ALERT_RADIUS_KM } from "@/constants/alerts";
import { LOCATION_OPTIONS, LOCATION_TO_WEATHER } from "@/constants/locations";
import { usePortalContainer } from "@/hooks/usePortalContainer";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import Alert from "@/components/ui/Alert";
import Slider from "@/components/ui/Slider";
import { MIN_RAIN_ALERT_HOURS, MAX_RAIN_ALERT_HOURS } from "@/constants/rainDescriptions";

interface Props {
  open: boolean;
  onClose: () => void;
  updatedAt?: string;
  onUpdatedAtClick?: () => void;

  alertsError?: unknown;
}

/**
 * Settings sheet: language, forecast location, alert radius, last-updated
 * time, and app version, grouped into categories. Each row follows the same
 * icon / title / description / control shape so new settings drop in
 * without new layout work.
 */
export function SettingsSheet({
  open,
  onClose,
  updatedAt,
  onUpdatedAtClick,
  alertsError
}: Props) {
  const { t, i18n } = useTranslation();
  const { set, get: { alertRadiusKm, location, precipHoursRange } } = useAppSettings();

  const [draftRadius, setDraftRadius] = useState(alertRadiusKm);
  const [draftPrecipHrs, setDraftPrecipHrs] = useState(precipHoursRange);
  const portalContainer = usePortalContainer(".root");

  // se o valor mudar por fora (ex: carregado do storage depois), sincroniza
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraftRadius(alertRadiusKm);
    setDraftPrecipHrs(precipHoursRange);
  }, [alertRadiusKm, precipHoursRange]);

  const commitRadius = (raw: number) => {
    if (raw !== alertRadiusKm) set.alertRadiusKm(raw);
  };

  const commitPrecipHrs = (raw: number) => {
    if (raw !== precipHoursRange) set.precipHoursRange(raw);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  const updatedAtHour = updatedAt
    ? DateTime.fromISO(updatedAt, { zone: location }).toFormat("HH:mm")
    : "--:--";

  const loc = LOCATION_TO_WEATHER[location];

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={t("settings")}
      ariaLabel={t("settings")}
      snapPoints={[0.6, 0.9]}
      initialSnap={0}
      dismissible
      container={portalContainer}
    >
      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        {Boolean(alertsError) && (
          <Alert
            title="Failed to fetch weather alerts"
            message={String(alertsError)}
            variant="danger" />
        )}
        <SettingsSection title={t("settingsTexts.general.title")}>
          <SettingRow
            icon={<LanguageIcon />}
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
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="pt">Português</option>
                <option value="es">Español</option>
                <option value="ko">한국어</option>
              </select>
            }
          />
          <SettingRow
            icon={<LocationIcon />}
            title={t("location")}
            description={t("settingsTexts.general.location")}
            htmlFor="location"
            control={
              <select
                id="location"
                className={styles.select}
                value={location}
                onChange={(e) => set.location(e.target.value as TLocation)}
              >
                {/* <option value="auto">Auto</option> */}
                {LOCATION_OPTIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {t(`cities.${loc.split("/")[1]}`)}
                  </option>
                ))}
              </select>
            }
          />
        </SettingsSection>

        <SettingsSection title={t("settingsTexts.alerts.title")}>
          <SettingRow
            icon={<RainCardIcon />}
            title={t('precipitationRange')}
            description={t('precipitationRangeDescription')}
            value={`${draftPrecipHrs} hrs`}
            htmlFor="alertPrecipHrs"
            control={
              <Slider
                id="alertPrecipHrs"
                min={MIN_RAIN_ALERT_HOURS}
                max={MAX_RAIN_ALERT_HOURS}
                step={1}
                value={draftPrecipHrs}
                onChange={setDraftPrecipHrs}
                onCommit={commitPrecipHrs}
                unit="hrs"
              />
            }
          />
          <SettingRow
            icon={<RadiusIcon />}
            title={t("settingsTexts.alerts.radius.title")}
            description={t("settingsTexts.alerts.radius.description")}
            value={`${draftRadius} km`}
            htmlFor="alertRadius"
            hide={!(['CA'].includes(loc.country || ""))}
            control={
              <Slider
                id="alertRadius"
                min={ALERT_RADIUS_KM.MIN}
                max={ALERT_RADIUS_KM.MAX}
                step={ALERT_RADIUS_KM.STEP}
                value={draftRadius}
                onChange={setDraftRadius}
                onCommit={commitRadius}
                unit="km"
              />
            }
          />
        </SettingsSection>

        <SettingsSection title={t("settingsTexts.status.title")}>
          <SettingRow
            icon={<ClockIcon />}
            title={t("weatherUpdatedAt")}
            description={t("settingsTexts.status.updatedAtDesc")}
            value={updatedAtHour}
            onDoubleClick={onUpdatedAtClick}
          />
          <SettingRow
            icon={<InfoIcon />}
            title={t("version")}
            description={t("settingsTexts.status.version")}
            value={<VersionBadge />}
          />
        </SettingsSection>
      </form>
    </BottomSheet>
  );
}

// --- Presentational helpers ------------------------------------------------

function SettingsSection({ title, hide, children }: { title: string; hide?: boolean; children: React.ReactNode }): JSX.Element | null {
  if (hide) return null;
  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      <div className={styles.sectionBody}>{children}</div>
    </section>
  );
}

interface SettingRowProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  /** Compact value shown inline next to the title (for static/quick-glance settings). */
  value?: React.ReactNode;
  /** Full-width interactive control rendered below the description (select, slider, etc). */
  control?: React.ReactNode;
  htmlFor?: string;
  hide?: boolean;
  onDoubleClick?: () => void;
}

function SettingRow({ icon, title, description, value, control, htmlFor, hide, onDoubleClick }: SettingRowProps) {
  if (hide) return null;
  return (
    <div className={styles.row} onDoubleClick={onDoubleClick}>
      <div className={styles.rowMain}>
        <span className={styles.iconBadge} aria-hidden="true">
          {icon}
        </span>
        <div className={styles.rowText}>
          <label className={styles.rowTitle} htmlFor={htmlFor}>
            {title}
          </label>
          <p className={styles.rowDescription}>{description}</p>
        </div>
        {value !== undefined && <span className={styles.rowValue}>{value}</span>}
      </div>
      {control && <div className={styles.rowControl}>{control}</div>}
    </div>
  );
}

function VersionBadge() {

  const isBeta = (process.env.NEXT_PUBLIC_APP_NAME || "")?.toLowerCase().includes('beta')

  return (
    <div className={styles.version}>
      {isBeta && <Badge variant="accent">BETA</Badge>}
      {APP_INFO.isDev && <Badge variant="accent">DEV</Badge>}
      {APP_INFO.version}
    </div>
  )
}