import { CSSProperties, useMemo, type JSX } from 'react';
import styles from './WeatherWidgets.module.scss';
import { useNow } from '@/contexts/NowContext';
import { IWeather } from '@/types/weather.types';
import { DetailCard } from '@/components/ui/DetailCard/DetailCard';
import ZoneGaugeBar from '@/components/ui/ZoneGaugeBar';
import useBoolean from '@/hooks/useBoolean';
import { useTranslation } from 'react-i18next';
import buildWeatherWidgetsData, { TWeatherWidgetsDataItem } from './buildWeatherWidgetsData';
import useAppSettings from '@/contexts/AppSettingsContext';
import { IAQI } from '@/types/aqi.types';
import AQIModal from '@/components/overlays/AQIModal';

interface Props {
  weather: IWeather;
  aqi: IAQI | undefined;
}

export default function WeatherWidgets({ weather, aqi }: Props): JSX.Element | null {
  const { i18n: { language: locale } } = useTranslation();
  const { now } = useNow();
  const { t } = useTranslation();
  const { get: { aqiScale } } = useAppSettings();
  const [aqiOpen, { setTrue: openAQI, setFalse: closeAQI }] = useBoolean();

  const data = useMemo(() => buildWeatherWidgetsData(weather, aqi, aqiScale, now, locale, t), [weather, aqi, aqiScale, now, locale, t]);

  return (
    <div className={styles.main}>

      {aqi && (
        <AQIModal
          aqi={aqi}
          onClose={closeAQI}
          open={aqiOpen}
          temp={weather.current.temperature_2m}
          pressure={weather.current.surface_pressure}
        />
      )}

      {data.map((detailProps, i) => {
        return (
          <DetailCardRender
            key={i}
            data={detailProps}
            onClick={detailProps.title === t('airQuality') ? openAQI : undefined}
          />
        );
      })}
    </div>
  );
}

const DetailCardRender = ({ data, onClick: onClickProp }: { data: TWeatherWidgetsDataItem, onClick?: () => void }) => {
  const [gaugeShowing, { toggle: toggleGauge }] = useBoolean(Boolean(data.showZoneGauge));

  const onClick = () => data.zoneGauge && !data.showZoneGauge ? toggleGauge() : onClickProp?.();

  const style = {
    '--wc-shadow-md': "0 2px 6px color-mix(in srgb, var(--wc-accent) 13%, transparent)",
    gridColumn: `span ${data.colspan ?? 1}`,
    height: (data.colspan ?? 1) > 1 ? 180 : 230,
  } as CSSProperties;

  const zoneRenderGauge = (() => {
    if (data.zoneGauge && (gaugeShowing || data.showZoneGauge))
      return <ZoneGaugeBar {...data.zoneGauge} />;
    else return null;
  })();

  return (
    <DetailCard {...data} onClick={onClick} style={style}>
      {zoneRenderGauge}
    </DetailCard>
  );
};
