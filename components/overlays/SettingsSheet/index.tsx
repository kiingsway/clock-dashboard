import React, { useEffect, useState } from "react";
import { DateTime } from "luxon";
import { useTranslation } from "react-i18next";
import { UseAppSettings } from "@/types/app.types";
import { TLocation } from "@/types/location.types";
import { APP_INFO } from "@/constants/appInfo";
import { Badge } from "@/components/ui/Badge";
import styles from "./SettingsSheet.module.css";
import { LanguageIcon, LocationIcon, RadiusIcon, ClockIcon, InfoIcon } from "./Icons";
import { ALERT_RADIUS_KM } from "@/constants/alerts";
import { LOCATION_OPTIONS } from "@/constants/locations";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { usePortalContainer } from "@/hooks/usePortalContainer";

interface Props {
  open: boolean;
  onClose: () => void;
  settings: UseAppSettings;
  updatedAt?: string;
  onUpdatedAtClick?: () => void;
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
  settings,
  updatedAt,
  onUpdatedAtClick,
}: Props) {
  const { t, i18n } = useTranslation();
  const { get: { alertRadiusKm, location } } = settings;

  const [draftRadius, setDraftRadius] = useState(alertRadiusKm);

  const portalContainer = usePortalContainer();

  // se o valor mudar por fora (ex: carregado do storage depois), sincroniza
  useEffect(() => {
    setDraftRadius(alertRadiusKm);
  }, [alertRadiusKm]);

  const commitRadius = (raw: number) => {
    if (raw !== alertRadiusKm) settings.set.alertRadiusKm(raw);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  const updatedAtHour = updatedAt
    ? DateTime.fromISO(updatedAt, { zone: location }).toFormat("HH:mm")
    : "--:--";

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
                onChange={(e) => settings.set.location(e.target.value as TLocation)}
              >
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
            icon={<RadiusIcon />}
            title={t("settingsTexts.alerts.radius.title")}
            description={t("settingsTexts.alerts.radius.description")}
            value={`${draftRadius} km`}
            htmlFor="alertRadius"
            control={
              <div className={styles.sliderRow}>
                <input
                  id="alertRadius"
                  type="range"
                  className={styles.slider}
                  min={ALERT_RADIUS_KM.MIN}
                  max={ALERT_RADIUS_KM.MAX}
                  step={ALERT_RADIUS_KM.STEP}
                  value={draftRadius}
                  onChange={(e) => setDraftRadius(Number(e.target.value))}
                  onPointerUp={(e) => commitRadius(Number((e.target as HTMLInputElement).value))}
                  onKeyUp={(e) => commitRadius(Number((e.target as HTMLInputElement).value))}
                  onBlur={(e) => commitRadius(Number((e.target as HTMLInputElement).value))}
                  aria-valuetext={`${draftRadius} km`}
                  style={
                    {
                      "--slider-fill": `${((draftRadius - ALERT_RADIUS_KM.MIN) / (ALERT_RADIUS_KM.MAX - ALERT_RADIUS_KM.MIN)) * 100}%`,
                    } as React.CSSProperties
                  }
                />
                <div className={styles.sliderScale}>
                  <span>{ALERT_RADIUS_KM.MIN} km</span>
                  <span>{ALERT_RADIUS_KM.MAX} km</span>
                </div>
              </div>
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
            value={
              <>
                {APP_INFO.isDev && <Badge variant="accent">DEV</Badge>} {APP_INFO.version}
              </>
            }
          />
        </SettingsSection>
      </form>
    </BottomSheet>
  );
}

// --- Presentational helpers ------------------------------------------------

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
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
  onDoubleClick?: () => void;
}

function SettingRow({ icon, title, description, value, control, htmlFor, onDoubleClick }: SettingRowProps) {
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