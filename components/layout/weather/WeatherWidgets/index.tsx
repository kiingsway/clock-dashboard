import { CSSProperties, useMemo, type JSX } from 'react';
import styles from './WeatherWidgets.module.scss';
import { useNow } from '@/contexts/NowContext';
import { IWeather } from '@/types/weather.types';
import { DetailCard } from '@/components/ui/DetailCard/DetailCard';
import useBoolean from '@/hooks/useBoolean';
import { useTranslation } from 'react-i18next';
import buildWeatherWidgetsData, { TWeatherWidgetsDataItem } from './buildWeatherWidgetsData';
import useAppSettings from '@/contexts/AppSettingsContext';
import { IAQI } from '@/types/aqi.types';
import dynamic from 'next/dynamic';
import useHasBeenTrue from '@/hooks/useHasBeenTrue';

const AQIModal = dynamic(() => import('@/components/overlays/AQIModal'));

// recharts fica fora do bundle inicial; 87px é a altura padrão do ZoneGaugeBar.
const ZoneGaugeBar = dynamic(() => import('@/components/ui/ZoneGaugeBar'), {
  loading: () => <div style={{ height: 87 }} />,
});

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
  const shouldMountAQI = useHasBeenTrue(aqiOpen);

  const data = useMemo(() => buildWeatherWidgetsData(weather, aqi, aqiScale, now, locale, t), [weather, aqi, aqiScale, now, locale, t]);

  return (
    <div className={styles.main}>

      {aqi && shouldMountAQI && (
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
