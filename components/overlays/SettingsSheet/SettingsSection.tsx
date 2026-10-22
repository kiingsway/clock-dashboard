import { JSX, PropsWithChildren } from 'react';
import styles from './SettingsSheet.module.css';
import { Badge } from '@/components/ui/Badge';
import { APP_INFO } from '@/constants/appInfo';
import { AppSettings, SaveAppSettings } from '@/types/app.types';
import { Switch } from '@/components/ui/Switch';
import { TFunction } from 'i18next';
import { capitalizeWords } from '@/utils/formatters/textFormatters';

interface Props {
  title: string;
  hide?: boolean;
}

export default function SettingsSection({ title, hide, children }: PropsWithChildren<Props>) {
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
  subtext?: string;
  /** Compact value shown inline next to the title (for static/quick-glance settings). */
  value?: React.ReactNode;
  /** Full-width interactive control rendered below the description (select, slider, etc). */
  control?: React.ReactNode;
  htmlFor?: string;
  hide?: boolean;
  onDoubleClick?: () => void;
}

export function SettingRow({ icon, title, description, value, subtext, control, htmlFor, hide, onDoubleClick }: SettingRowProps) {
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
      {subtext && <span className={styles.subtext}>{subtext}</span>}
    </div>
  );
}

export function VersionBadge() {

  const isBeta = (process.env.NEXT_PUBLIC_APP_NAME || "")?.toLowerCase().includes('beta');

  return (
    <div className={styles.version}>
      {isBeta && <Badge variant="accent">BETA</Badge>}
      {APP_INFO.isDev && <Badge variant="accent">DEV</Badge>}
      {APP_INFO.version}
    </div>
  );
}

export function CreditLink({ href, children }: PropsWithChildren<{ href: string }>) {
  return (
    <a className={styles.creditLink} href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export interface BuildSettingRowProps {
  key: "is12hour" | "showFeelsLikeWhenEqual" | "showMinMaxPeakBadge" | "focusCurrentWeatherOnLaunch" | "useBottomSheet";
  get: AppSettings;
  set: SaveAppSettings;
  icon: JSX.Element | ((v: boolean) => JSX.Element) | ((v: boolean) => JSX.Element),
  t: TFunction;
}

export function buildBooleanSettingRow({ get, key, icon, set, t }: BuildSettingRowProps) {
  const value = get[key];

  const renderedIcon = typeof icon === 'function' ? icon(value) : icon;

  return (
    <SettingRow
      key={key}
      icon={renderedIcon}
      title={t(`settingsTexts.appearance.${key}.title`)}
      description={t(`settingsTexts.appearance.${key}.desc`)}
      value={capitalizeWords(String(t(value ? 'active' : 'inactive')))}
      control={<Switch id={key} value={value} onChange={set[key]} />}
      htmlFor={key}
    />
  );
}