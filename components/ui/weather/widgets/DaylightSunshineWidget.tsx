import { DetailCard } from "@/components/ui/DetailCard/DetailCard";
import MiniCard from "@/components/ui/MiniCard";
import { IWeather } from "@/types/weather.types";
import { getCurrentIndex } from "@/utils/formatters/getValueByArray";
import { DateTime } from "luxon";
import { useTranslation } from "react-i18next";
import WeatherIcon from "../WeatherIcon";
import { getDaylightColor } from "@/utils/weather/getColors";
import { formatDuration } from "@/utils/formatters/dateFormatters";
import getDaylightDurationDescription, { getSunshineDurationDescription } from "@/utils/weather/getDaylightDurationDescription";

interface Props {
  weather: IWeather;
  date: DateTime<boolean>;
  miniCard?: boolean;
  size?: number;
}

export default function DaylightSunshineWidget({ date, weather, miniCard, size }: Props) {
  const { t } = useTranslation();
  const { daily: { sunshine_duration, daylight_duration, time } } = weather;

  const nowIndex = getCurrentIndex({ date, time });

  const daylight = daylight_duration[nowIndex];
  const sunshine = sunshine_duration[nowIndex];

  const daylightColor = getDaylightColor(daylight);
  const sunshineColor = getDaylightColor(sunshine);

  const daylightDuration = formatDuration(daylight);
  const sunshineDuration = formatDuration(sunshine);

  const daylightDesc = getDaylightDurationDescription(daylight, t);
  const sunshineDesc = getSunshineDurationDescription(sunshine, t);

  const onDebugClick = (): void => console.info('Daylight Sunshine', {
    weather,
    sunshine: { duration: sunshineDuration, value: sunshine },
    daylight: { duration: daylightDuration, value: daylight },
  })

  if (miniCard) return (
    <>
      <MiniCard
        title={`${t('daylight')}: ${daylightDuration}`}
        desc={daylightDesc}
        onDoubleClick={onDebugClick}
        size={120}
        icon={(
          <WeatherIcon
            category="sunrise"
            size={size}
          />
        )}
      />
      <MiniCard
        title={`${t('sunshine')}: ${sunshineDuration}`}
        desc={sunshineDesc}
        onDoubleClick={onDebugClick}
        size={120}
        icon={(
          <WeatherIcon
            iconName="dust-day"
            size={size}
          />
        )}
      />
    </>
  );

  return (
    <>
      <DetailCard
        onDoubleClick={onDebugClick}
        title={t('daylight')}
        description={daylightDesc}
        bigText={daylightDuration}
        textColor={daylightColor}
      />
      <DetailCard
        onDoubleClick={onDebugClick}
        title={t('sunshine')}
        description={sunshineDesc}
        bigText={sunshineDuration}
        textColor={sunshineColor}
      />
    </>
  );
}
