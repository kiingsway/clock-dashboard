import { CSSProperties } from 'react';
import styles from './WeatherNow.module.scss';
import { useTranslation } from 'react-i18next';
import { useAppSettings } from '@/contexts/AppSettingsContext';
import { getTemperatureMinMaxColors } from '@/constants/colors';


interface Props {
  temp: number | undefined;
  min: number | undefined;
  max: number | undefined;
  unit?: string;
  minColor?: string;
  meanColor?: string;
  maxColor?: string;
  progress: number;
}

export default function MinMaxProgress({ temp, min, max, unit, progress }: Props) {
  const { t } = useTranslation();
  const { get: { showMinMaxPeakBadge: showMinMaxOnTempRange } } = useAppSettings();

  const { minColor, maxColor } = getTemperatureMinMaxColors(min, max);

  const style = {
    '--wc-min-color': minColor,
    '--wc-mean-color': 'var(--wc-text-faint)',
    '--wc-max-color': maxColor,
  } as CSSProperties;

  const tempText = (t: number | undefined) =>
    typeof t === 'number' ? `${t}${unit ?? ''}` : '-';

  return (
    <div className={styles.rangeCard} style={style}>
      <span className={styles.rangeMin}>{min === temp && showMinMaxOnTempRange ? t('min') : tempText(min)}</span>
      <div className={styles.rangeTrack}>
        <div className={styles.rangeDot} style={{ left: `${progress}%` }} />
      </div>
      <span className={styles.rangeMax}>{max === temp && showMinMaxOnTempRange ? t('max') : tempText(max)}</span>
    </div>
  );
}
