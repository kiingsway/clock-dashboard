import { DateTime } from 'luxon';
import styles from './AQIFormula.module.css';
import { buildBreakdown, IPPBPollutant, numberFmt } from './utils';
import { useTranslation } from 'react-i18next';
import { GAS_CONSTANT } from './constants';
import { useMemo } from 'react';
import { formatClock } from '@/utils/formatters/formatClock';
import useAppSettings from '@/contexts/AppSettingsContext';
import { isValidDateTime } from '@/utils/formatters/dateFormatters';

interface Props {
  pollutants: IPPBPollutant[];
  temperatureC: number;
  pressureHpa: number;
  updatedAt: DateTime;
  showDateOnly: boolean;
}

export default function AQIFormula({ pollutants, pressureHpa, temperatureC, updatedAt, showDateOnly }: Props) {

  const { t, i18n: { language: locale } } = useTranslation();
  const { get: { is12hour } } = useAppSettings();

  const {
    rows,
    usesStandardFallback,
    effectiveTempC,
    effectivePressureHpa,
  } = useMemo(() => buildBreakdown({ pollutants, temperatureC, pressureHpa, t, locale }),
    [pollutants, temperatureC, pressureHpa, t, locale]
  );

  const metaItems = [
    { label: t('temperature'), value: numberFmt(effectiveTempC, 1, locale) + '°C' },
    { label: t('surfacePressure'), value: numberFmt(effectivePressureHpa, 1, locale) + ' hPa' },
    { label: t('updatedAt'), value: isValidDateTime(updatedAt) ? `${updatedAt.toFormat('LLL dd')}, ${formatClock({ date: updatedAt, language: locale, hour12: is12hour, localizedPeriod: true, short: false })}` : "—" },
  ];

  const content = (
    <>
      <p>{t('aqiTextes.legend.conversionInfo', { unit: 'ppb/ppm' })}</p>

      <div className={styles.formula}>
        ppb = C ÷ [ (PM × P) ÷ (R × T) × 0,001 ]
      </div>

      <dl className={styles.legend}>
        <dt>C</dt>
        <dd>{t('aqiTextes.legend.concentration')}</dd>

        <dt>PM</dt>
        <dd>{t('aqiTextes.legend.molecularWeight')}</dd>

        <dt>P</dt>
        <dd>{t('aqiTextes.legend.atmosphericPressure')}</dd>

        <dt>R</dt>
        <dd>
          {t('aqiTextes.legend.gasConstant', {
            value: numberFmt(GAS_CONSTANT, 6, locale),
          })}
        </dd>

        <dt>T</dt>
        <dd>{t('aqiTextes.legend.temperature')}</dd>
      </dl>

      {usesStandardFallback && (
        <p>
          Sem leitura de temperatura ou pressão no momento, foi usado um fator fixo de
          conversão por poluente.
        </p>
      )}

      <div className={styles.rows}>
        {rows.map((row) => (
          <div className={styles.row} key={row.key}>
            <div className={styles.header}>
              <span className={styles.symbol}>{row.symbol}</span>
              <span className={styles.label}>{row.name}</span>
              <span className={styles.mw}>PM {row.formatted.mw} g/mol</span>
            </div>

            {usesStandardFallback ? (
              <div className={styles.equation}>
                {row.formatted.ugm3} ÷ {row.formatted.ugm3ppb} ={" "}
                <span className={styles.result}>
                  {row.formatted.result} {row.unit}
                </span>
              </div>
            ) : (
              <div className={styles.equation}>
                {row.formatted.ugm3} ÷ [ ({row.formatted.mw} × {row.formatted.pressure}) ÷
                ({row.formatted.gas} × {row.formatted.kelvin}) × 0,001 ] ={" "}
                {row.formatted.ppb} ppb
                {row.unit === "ppm" ? (
                  <>
                    {" "}÷ 1000 <span className={styles.result}>≈ {row.formatted.result} ppm</span>
                  </>
                ) : (
                  <>
                    {" "}
                    <span className={styles.result}>≈ {row.formatted.result} ppb</span>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className={styles.main}>
      <div className={styles.content}>
        {!showDateOnly && content}
        <Meta items={metaItems.slice(showDateOnly ? 2 : 0)} />
      </div>
    </div>
  );
}

interface MetaProps {
  items: {
    value: string | number;
    label: string;
  }[]
}

const Meta = ({ items }: MetaProps) => (
  <div className={styles.meta}>
    {items.map((item, i) => (
      <div className={styles.cell} key={i}>
        <span className={styles.value}>{item.value}</span>
        <span className={styles.label}>{item.label}</span>
      </div>
    ))}
  </div>
);