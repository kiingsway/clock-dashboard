import { BottomSheet } from "@/components/ui/BottomSheet";
import { Modal } from "@/components/ui/Modal";
import { Switch } from "@/components/ui/Switch";
import useAppSettings from "@/contexts/AppSettingsContext";
import { usePortalContainer } from "@/hooks/usePortalContainer";
import { AirQualityMetric, IAQI } from "@/types/aqi.types";
import getAQIInfo from "@/utils/aqi/getAQIInfo";
import { DateTime } from "luxon";
import { useTranslation } from "react-i18next";
import styles from './AQIModal.module.css';
import { convertUgM3 } from "@/utils/aqi/convertUgM3";
import AQIFormula from "./AQIFormula";
import AirQualityList from "./AirQualityList";

interface Props {
  aqi: IAQI;
  open: boolean;
  onClose: () => void;
  temp: number;
  pressure: number;
}

type CurrentKeyOf = keyof IAQI['current'];

interface IPollutantKey {
  key: CurrentKeyOf | CurrentKeyOf[];
  symbol?: 'PM₂.₅' | 'PM₁₀' | 'O₃' | 'NO₂' | 'SO₂' | 'CO';
}

const pollutantKeys: IPollutantKey[] = [
  { key: ['european_aqi', 'us_aqi'] },
  { key: 'pm2_5', symbol: 'PM₂.₅' },
  { key: 'pm10', symbol: 'PM₁₀' },
  { key: 'ozone', symbol: 'O₃' },
  { key: 'nitrogen_dioxide', symbol: 'NO₂' },
  { key: 'sulphur_dioxide', symbol: 'SO₂' },
  { key: 'carbon_monoxide', symbol: 'CO' },
  { key: 'dust' },
] as const;

export default function AQIModal({ aqi, onClose, open, pressure, temp }: Props) {
  const { t } = useTranslation();
  const portalContainer = usePortalContainer();
  // const { now } = useNow();
  const { get: { aqiScale, location: timezone, useBottomSheet }, set } = useAppSettings();

  const { current, current_units } = aqi;

  const itemsList = pollutantKeys.map(pkey => {

    const prop = Array.isArray(pkey.key) ? pkey.key[aqiScale === 'us' ? 1 : 0] : pkey.key;
    const key = prop === 'european_aqi' || prop === 'us_aqi' ? 'aqi' : prop;
    const value = current[prop];

    const info = (() => {
      if (typeof value !== 'number' || key === 'time' || key === 'interval') return undefined;
      const { color, level, desc } = getAQIInfo(value, aqiScale, key, t);
      return { level, color, desc };
    })();

    const { value2, unit2 } = (() => {
      if (aqiScale === 'us' && typeof value === 'number' && (
        key === 'ozone'
        || key === 'sulphur_dioxide'
        || key === 'nitrogen_dioxide'
        || key === 'carbon_monoxide'
      )) {
        const unit = key === 'carbon_monoxide' ? 'ppm' : 'ppb';
        const value2 = convertUgM3(value, key, unit, temp, pressure).toFixed(1);
        return { value2, unit2: unit };
      }

      return { value2: undefined, unit2: undefined };
    })();

    return {
      label: `${t(`aqiTextes.pollutant.${key}`)}${pkey.symbol ? ` (${pkey.symbol})` : ''}`,
      value,
      value2,
      unit: current_units[prop],
      unit2,
      level: info?.level,
      color: info?.color,
      desc: info?.desc
    } as AirQualityMetric;
  });

  const { color: accent } = getAQIInfo(current[aqiScale === 'european' ? 'european_aqi' : 'us_aqi'], aqiScale, 'aqi', t);

  const updatedAt = DateTime.fromISO(current.time, { zone: aqi.timezone }).setZone(timezone);

  const content = (
    <div className={styles.content} style={{ marginBottom: useBottomSheet ? 60 : 0 }}>
      <div className={styles.header}>
        <div className={styles.header_info}>
          <Switch value={aqiScale === 'us'} onChange={v => set.aqiScale(v ? 'us' : 'european')} />
          <span>{aqiScale === 'us' ? t('aqiTextes.scale.us') : t('aqiTextes.scale.eu')}</span>
        </div>
      </div>

      <AirQualityList items={itemsList} />

      <AQIFormula
        showDateOnly={aqiScale === 'european'}
        temperatureC={temp}
        pressureHpa={pressure}
        updatedAt={updatedAt}
        pollutants={[
          { pollutant: "ozone", valueUgM3: current.ozone },
          { pollutant: "nitrogen_dioxide", valueUgM3: current.nitrogen_dioxide },
          { pollutant: "sulphur_dioxide", valueUgM3: current.sulphur_dioxide },
          { pollutant: "carbon_monoxide", valueUgM3: current.carbon_monoxide, unit: 'ppm' },
        ]}
      />

    </div>
  );

  if (useBottomSheet) return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={t('airQuality')}
      ariaLabel={t('close')}
      snapPoints={[0.7, 0.95]}
      initialSnap={0}
      dismissible
      container={portalContainer}>
      {content}
    </BottomSheet>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      accentColor={accent}
      title={t('airQuality')}>
      {content}
    </Modal>
  );
}
