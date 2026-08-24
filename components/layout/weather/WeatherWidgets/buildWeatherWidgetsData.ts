import { DetailCardProps } from '@/components/ui/DetailCard/DetailCard'
import { ZoneGaugeBarProps } from '@/components/ui/ZoneGaugeBar';
import { VISIBILITY_COLORS, WIND_GUSTS_COLORS } from '@/constants/colors';
import { createIconUrl } from '@/constants/iconFiles';
import { IWeather } from '@/types/weather.types';
import { formatDuration } from '@/utils/formatters/dateFormatters';
import { getCurrentIndex } from '@/utils/formatters/getValueByArray';
import { capitalizeWords, formatMetricValue } from '@/utils/formatters/textFormatters';
import getBeaufortScale from '@/utils/geo/getBeaufortScale';
import { getCompassDirection } from '@/utils/geo/getCompassDirection';
import buildMoonDescription from '@/utils/weather/buildDescriptions/moon';
import buildUVDescription from '@/utils/weather/buildDescriptions/uvIndex';
import buildVisibilityDescription from '@/utils/weather/buildDescriptions/visibility';
import { getDaylightColor, getDewPointColor, getHumidityColor, getWindColor } from '@/utils/weather/getColors';
import getDaylightDurationDescription, { getSunshineDurationDescription } from '@/utils/weather/getDaylightDurationDescription';
import { getDewPointDescription } from '@/utils/weather/getDewPointDescription';
import getHumidityDescription from '@/utils/weather/getHumidityDescription';
import { getWindGustAnimationDuration, getWindSummary } from '@/utils/weather/getWindInfo';
import { TFunction } from 'i18next';
import { DateTime } from 'luxon';

export type TWeatherWidgetsDataItem = (DetailCardProps & { zoneGauge?: ZoneGaugeBarProps });

export default function buildWeatherWidgetsData(weather: IWeather, now: DateTime, locale: string, t: TFunction): TWeatherWidgetsDataItem[] {

  const {
    timezone,
    daily_moon,
    hourly_units: {
      relative_humidity_2m: humidityUnit,
      dew_point_2m: dewPointUnit,
      visibility: visibilityUnit,
      wind_gusts_10m: windUnit,
    },
    daily: {
      time: dailyTime,
      daylight_duration,
      sunshine_duration,
      wind_speed_10m_mean,
      wind_gusts_10m_mean
    },
    hourly: {
      time: hourlyTime,
      uv_index,
      relative_humidity_2m,
      dew_point_2m,
      visibility: visibilityProp,
      wind_gusts_10m,
      wind_speed_10m,
      wind_direction_10m,
      is_day
    }
  } = weather;

  const nowIndex = getCurrentIndex({ date: now, time: hourlyTime })
  const todayIndex = getCurrentIndex({ date: now, time: dailyTime })

  const moonNow = daily_moon.find(m => m.date === now.toISODate());
  const uvIndex = uv_index[nowIndex];
  const humidity = relative_humidity_2m[nowIndex];
  const dewPoint = dew_point_2m[nowIndex];
  const visibility = visibilityProp[nowIndex];
  const windGustsNow = wind_gusts_10m[nowIndex];
  const windSpeedNow = wind_speed_10m[nowIndex];
  const windDirectionNow = wind_direction_10m[nowIndex];
  const isDay = is_day[nowIndex] === 1;

  const windGustsDay = wind_gusts_10m_mean[todayIndex];
  const windSpeedDay = wind_speed_10m_mean[todayIndex];
  const daylight = daylight_duration[todayIndex];
  const sunshine = sunshine_duration[todayIndex];

  const compass = getCompassDirection(windDirectionNow, t);

  const moonDesc = buildMoonDescription(moonNow, timezone, t);
  const uvIndexDesc = buildUVDescription(uvIndex, isDay, t);
  const visibilityDesc = buildVisibilityDescription(visibility, visibilityUnit, locale, true, t);

  const dewPointdesc = getDewPointDescription(dewPoint, t);
  const windSpeedDesc = getWindSummary({ currentSpeed: windSpeedNow, averageSpeed: windSpeedDay, direction: compass.title }, t)
  const daylightDesc = getDaylightDurationDescription(daylight, t);
  const sunshineDesc = getSunshineDurationDescription(sunshine, t);

  const daylightColor = getDaylightColor(daylight);
  const sunshineColor = getDaylightColor(sunshine);

  const daylightDuration = formatDuration(daylight);
  const sunshineDuration = formatDuration(sunshine);

  const { level } = getBeaufortScale(windSpeedNow);
  const beaufortSrc = createIconUrl(`wind-beaufort-${level}`);
  const beaufortDuration = getWindGustAnimationDuration(windSpeedNow);

  const beaufortTitle = `Beaufort Scale: ${level} (${windSpeedNow})`;
  const directionText = `${capitalizeWords(t('wind'))} ${compass.name}`

  const dewPointStops = [-10, 0, 7, 13, 18, 27];
  const dewPointZones: { value: number; color: string }[] =
    dewPointStops.map(value => ({
      value,
      color: getDewPointColor(value)
    }));


  const uvIndexZones: { value: number; color: string }[] = [
    { value: 0, color: "#86CFA3" },  // Verde — baixo
    { value: 3, color: "#F2D37A" },  // Amarelo — moderado
    { value: 6, color: "#F2A56F" },  // Laranja — alto
    { value: 8, color: "#E97C7C" },  // Vermelho — muito alto
    { value: 11, color: "#A982C7" }, // Roxo — extremo
  ];

  const moonPhaseZones: { value: number; color: string }[] = [
    { value: Math.round((0 / 16) * 100), color: "#24304A" },
    { value: Math.round((1 / 16) * 100), color: "#405B86" },
    { value: Math.round((3 / 16) * 100), color: "#5F78A3" },
    { value: Math.round((5 / 16) * 100), color: "#8295B5" },
    { value: Math.round((7 / 16) * 100), color: "#D8DDE5" },
    { value: Math.round((9 / 16) * 100), color: "#8295B5" },
    { value: Math.round((11 / 16) * 100), color: "#5F78A3" },
    { value: Math.round((13 / 16) * 100), color: "#405B86" },
    { value: Math.round((15 / 16) * 100), color: "#24304A" },
  ];

  const windZones = WIND_GUSTS_COLORS.map(({ hex: color, value }) => ({ value, color }));
  const visibilityZones = VISIBILITY_COLORS.map(({ hex: color, value }) => ({ color, value }));

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

  const daylightHours = [0, 4, 8, 12, 16, 20, 24];
  const daylightZones = daylightHours.map(value => ({ value, color: getDaylightColor(value * 60 * 60) }));

  // console.log('uvIndexDesc.icons[0]', uvIndexDesc.icons[0]);

  return [
    {
      title: t('moon'),
      description: moonDesc.title,
      iconProps: moonDesc.icons[0],
      zoneGauge: {
        value: +(Number(moonDesc.title.split('(')[1].replaceAll('%)', ''))).toFixed(1),
        unit: '%',
        zones: moonPhaseZones,
        max: 100,
        hideZoneLabel: true,
      }
    },
    {
      title: t('uvIndex'),
      description: uvIndexDesc.desc,
      iconProps: uvIndexDesc.icons[0],
      zoneGauge: {
        value: uvIndex ?? 0,
        zones: uvIndexZones,
        max: 12,
        hideZoneLabel: true,
      }
    },
    {
      title: t('windSpeed'),
      description: windSpeedDesc,
      textColor: getWindColor(windSpeedNow, 'gusts'),
      iconsProps: [
        {
          src: beaufortSrc,
          title: beaufortTitle,
          alt: beaufortTitle,
          duration: beaufortDuration,
        },
        {
          src: compass.iconSrc,
          title: directionText,
          alt: directionText,
          duration: beaufortDuration,
        },
      ],
      zoneGauge: {
        value: windSpeedNow,
        unit: ` ${windUnit}`,
        zones: windZones,
        hideZoneLabel: true,
        referenceZones: [
          { label: `${t('mean')}: ${windSpeedDay} ${windUnit}`, value: windSpeedDay }
        ]
      }
    },
    {
      title: t('windGusts'),
      textColor: getWindColor(windGustsNow, 'gusts'),
      bigText: `${windGustsNow} ${windUnit}`,
      description: t('averageSpeedForDay', { speed: windGustsDay + windUnit }),
      zoneGauge: {
        value: windGustsNow,
        unit: ` ${windUnit}`,
        zones: windZones,
        hideZoneLabel: true,
        referenceZones: [
          { label: `${t('mean')}: ${windGustsDay} ${windUnit}`, value: windGustsDay }
        ]
      }
    },
    {
      title: t('visibility'),
      bigText: visibilityDesc.title,
      description: visibilityDesc.desc,
      textColor: visibilityDesc.textColor,
      zoneGauge: {
        value: visibility,
        valueLabel: v => formatMetricValue(v, locale, visibilityUnit),
        unit: ` ${visibilityUnit}`,
        zones: visibilityZones,
        min: visibilityZones[0].value,
        max: visibilityZones[visibilityZones.length - 1].value,
        hideZoneLabel: true,
      }
    },
    {
      title: t('humidity'),
      bigText: humidity + humidityUnit,
      description: getHumidityDescription(humidity, t),
      textColor: getHumidityColor(humidity),
      zoneGauge: {
        value: humidity,
        unit: humidityUnit,
        zones: humidityZones,
        hideZoneLabel: true
      }
    },
    {
      title: t('dewPoint'),
      description: dewPointdesc,
      bigText: dewPoint + dewPointUnit,
      textColor: getDewPointColor(dewPoint),
      zoneGauge: {
        value: dewPoint,
        unit: dewPointUnit,
        zones: dewPointZones,
        min: -18,
        max: 35,
        hideZoneLabel: true,
      }
    },
    {
      title: t('daylight'),
      description: daylightDesc,
      bigText: daylightDuration,
      textColor: daylightColor,
      zoneGauge: {
        value: daylight / 60 / 60,
        valueLabel: () => formatDuration(daylight),
        zones: daylightZones,
        min: daylightZones[0].value,
        max: daylightZones[daylightZones.length - 1].value,
        hideZoneLabel: true,
      }
    },
    {
      title: t('sunshine'),
      description: sunshineDesc,
      bigText: sunshineDuration,
      textColor: sunshineColor,
      zoneGauge: {
        value: sunshine / 60 / 60,
        valueLabel: () => formatDuration(sunshine),
        zones: daylightZones,
        min: daylightZones[0].value,
        max: daylightZones[daylightZones.length - 1].value,
        hideZoneLabel: true,
      }
    },
  ];
}
