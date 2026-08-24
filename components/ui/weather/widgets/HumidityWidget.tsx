import { DetailCard } from "@/components/ui/DetailCard/DetailCard";
import MiniCard from "@/components/ui/MiniCard";
import { IWeather } from "@/types/weather.types";
import { getCurrentIndex } from "@/utils/formatters/getValueByArray";
import getHumidityDescription from "@/utils/weather/getHumidityDescription";
import { DateTime } from "luxon";
import { useTranslation } from "react-i18next";
import WeatherIcon from "../WeatherIcon";
import { getHumidityColor } from "@/utils/weather/getColors";
import useBoolean from "@/hooks/useBoolean";
import ZoneGaugeBar from "../../ZoneGaugeBar";

interface Props {
  weather: IWeather;
  date: DateTime<boolean>;
  miniCard?: boolean;
  size?: number;
  kind: 'now' | 'day';
}

export default function HumidityWidget({ date, weather, miniCard, kind, size = 60 }: Props) {
  const { t } = useTranslation();
  const [gaugeShowing, { toggle: toggleGauge }] = useBoolean();

  const { daily, daily_units, hourly, hourly_units } = weather;

  const time = kind === 'now' ? hourly.time : daily.time;
  const nowIndex = getCurrentIndex({ date, time });
  const humidityArray = kind === 'now' ? hourly.relative_humidity_2m : daily.relative_humidity_2m_mean;
  const humidity = humidityArray[nowIndex];

  const unit = kind === 'now' ? hourly_units.relative_humidity_2m : daily_units.relative_humidity_2m_mean;
  const humidityText = humidity + unit;

  const desc = getHumidityDescription(humidity, t);

  const onDebugClick = (): void => console.info('Humidity Widget:', { date, weather, nowIndex });

  if (miniCard) return (
    <MiniCard
      title={`${t('humidity')}: ${humidityText}`}
      desc={desc}
      onDoubleClick={onDebugClick}
      size={120}
      icon={(
        <WeatherIcon
          iconName="humidity"
          size={size}
        />
      )}
    />
  );

  const humidityZones = [
    { value: 0, color: "#C9A227", },// Extremely dry
    { value: 20, color: "#D9A441", },// Very dry
    { value: 30, color: "#d8c38e", },// Dry
    { value: 40, color: "#cfddf4", },// Comfortable
    { value: 60, color: "#7db2c4", },// Slightly humid
    { value: 70, color: "#3D8FB8", },// Humid
    { value: 80, color: "#3976A8", },// Very humid
    { value: 90, color: "#2E5E96", },// Extremely humid
  ];

  return (
    <DetailCard
      onDoubleClick={onDebugClick}
      title={t('humidity')}
      description={desc}
      bigText={humidityText}
      textColor={getHumidityColor(humidity)}
      onClick={toggleGauge}
    >
      {gaugeShowing && (
        <ZoneGaugeBar
          value={humidity}
          unit={unit}
          zones={humidityZones}
          hideZoneLabel
        />
      )}
    </DetailCard>
  );
}
