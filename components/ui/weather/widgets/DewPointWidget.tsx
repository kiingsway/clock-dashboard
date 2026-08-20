import { DetailCard } from "@/components/ui/DetailCard/DetailCard";
import MiniCard from "@/components/ui/MiniCard";
import { IWeather } from "@/types/weather.types";
import { getCurrentIndex } from "@/utils/formatters/getValueByArray";
import { getDewPointColor } from "@/utils/weather/getColors";
import { getDewPointDescription } from "@/utils/weather/getDewPointDescription";
import { DateTime } from "luxon";
import { useTranslation } from "react-i18next";
import WeatherIcon from "../WeatherIcon";

interface Props {
  weather: IWeather;
  date: DateTime<boolean>;
  miniCard?: boolean;
  size?: number;
  kind: 'now' | 'day';
}

export default function DewPointWidget({ date, weather, miniCard, kind, size = 60 }: Props) {
  const { t } = useTranslation();

  const { daily, daily_units, hourly, hourly_units } = weather;

  const time = kind === 'now' ? hourly.time : daily.time;
  const nowIndex = getCurrentIndex({ date, time });
  const dewArray = kind === 'now' ? hourly.dew_point_2m : daily.dew_point_2m_mean;
  const dew = dewArray[nowIndex];

  const unit = kind === 'now' ? hourly_units.dew_point_2m : daily_units.dew_point_2m_mean;
  const dewPoint = dew + unit;

  const desc = getDewPointDescription(dew, t);

  const onDebugClick = (): void => console.info('Dew Point Widget:', { date, weather, nowIndex });

  if (miniCard) return (
    <MiniCard
      title={`${t('dewPoint')}: ${dewPoint}`}
      desc={desc}
      onDoubleClick={onDebugClick}
      size={120}
      icon={(
        <WeatherIcon
          iconName="thermometer-raindrop"
          size={size}
        />
      )}
    />
  );

  return (
    <DetailCard
      onDoubleClick={onDebugClick}
      title={t('dewPoint')}
      description={desc}
      bigText={dewPoint}
      textColor={getDewPointColor(dew)}
    />
  );
}
