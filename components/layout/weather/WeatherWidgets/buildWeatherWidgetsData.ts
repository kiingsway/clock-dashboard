import { DetailCardProps } from '@/components/ui/DetailCard/DetailCard';
import { ZoneGaugeBarProps } from '@/components/ui/ZoneGaugeBar';
import { AQI_EU_COLORS, AQI_USA_COLORS, HUMIDITY_COLORS, MOON_COLORS, VISIBILITY_COLORS, WIND_GUSTS_COLORS, WIND_SPEED_COLORS } from '@/constants/colors';
import { getDewPointDescription, getHumidityDescription } from '@/constants/descriptions';
import { getIconUrl } from '@/constants/iconFiles';
import { UV_INDEX_LEVELS } from '@/constants/uvIndex';
import { IAQI, AQIScale } from '@/types/aqi.types';
import { IWeather } from '@/types/weather.types';
import { AQI_COLORS } from '@/utils/aqi/getAQIInfo';
import { formatDuration } from '@/utils/formatters/dateFormatters';
import { getCurrentIndex } from '@/utils/formatters/getValueByArray';
import { capitalizeWords, formatMetricValue } from '@/utils/formatters/textFormatters';
import { getAstronomicalSeasonInfo } from '@/utils/geo/getAstronomicalSeason';
import getBeaufortScale from '@/utils/geo/getBeaufortScale';
import { getCompassDirection } from '@/utils/geo/getCompassDirection';
import buildAQIDescription from '@/utils/weather/buildDescriptions/aqi';
import buildMoonDescription from '@/utils/weather/buildDescriptions/moon';
import buildUVDescription from '@/utils/weather/buildDescriptions/uvIndex';
import buildVisibilityDescription from '@/utils/weather/buildDescriptions/visibility';
import { getDaylightColor, getDewPointColor, getHumidityColor, getWindColor } from '@/utils/weather/getColors';
import { getDaylightSunshineInfo } from '@/utils/weather/getDaylightSunshineInfo';
import { getWindGustAnimationDuration, getWindSummary } from '@/utils/weather/getWindInfo';
import { TFunction } from 'i18next';
import { DateTime } from 'luxon';

export type TWeatherWidgetsDataItem = (DetailCardProps & {
  showZoneGauge?: boolean;
  zoneGauge?: ZoneGaugeBarProps
});

function safeBuild(t: TFunction, defaultTitle: string = 'Erro', builder: (title: string) => TWeatherWidgetsDataItem | undefined): TWeatherWidgetsDataItem | undefined {
  try {
    return builder ? builder(defaultTitle) : undefined;
  } catch (error) {
    console.error(`${t('error_building_item')} "${defaultTitle}":`, error);
    return {
      title: defaultTitle,
      description: t('error_building_item'),
      iconsProps: [{ category: 'error' }],
    } as TWeatherWidgetsDataItem;
  }
}

export default function buildWeatherWidgetsData(weather: IWeather, aqi: IAQI | undefined, aqiScale: AQIScale, now: DateTime, locale: string, t: TFunction): TWeatherWidgetsDataItem[] {

  const {
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

  const nowIndex = getCurrentIndex(now, hourlyTime);
  const todayIndex = getCurrentIndex(now, dailyTime);

  if (nowIndex < 0) {
    console.error('Now Index doesnt exist. ', { now: now.toFormat('yyyy-LL-dd HH:mm'), hourlyTime });
    throw new Error(`Now not found. Now: ${now.toISO()}. Hourly Time length: ${hourlyTime.length}`);
  }

  const daylightHours = [0, 4, 8, 12, 16, 20, 24];
  const daylightZones = daylightHours.map(value => ({ value, color: getDaylightColor(value * 60 * 60) }));
  const windSpeedZones = WIND_SPEED_COLORS.map(({ hex: color, value }) => ({ value, color }));
  const windGustsZones = WIND_GUSTS_COLORS.map(({ hex: color, value }) => ({ value, color }));

  return [

    safeBuild(t, t('airQuality'), title => {
      if (!aqi) return undefined;
      const isEUType = aqiScale === 'european';

      const { european_aqi, us_aqi } = aqi.current;

      const aqIndex = isEUType ? european_aqi : us_aqi;
      const aqiDesc = buildAQIDescription(aqIndex, aqiScale, t);

      const zones = (isEUType ? AQI_EU_COLORS : AQI_USA_COLORS).map(({ value }, index) => ({ value, color: AQI_COLORS[index] }));

      return {
        title,
        description: aqiDesc.desc,
        bigText: aqIndex,
        colspan: 2,
        showZoneGauge: true,
        zoneGauge: {
          value: aqIndex ?? 0,
          valueDesc: aqiDesc.title,
          zones,
          max: isEUType ? 120 : 400,
          hideZoneLabel: true,
        }
      };
    }),

    safeBuild(t, t('uvIndex'), title => {

      const uvIndex = uv_index[nowIndex];
      const isDay = is_day[nowIndex] === 1;

      const uvIndexDesc = buildUVDescription(uvIndex, isDay, t);
      const zones = UV_INDEX_LEVELS.map(({ value, color }) => ({ value, color }));

      return {
        title,
        description: uvIndexDesc.desc,
        iconProps: uvIndexDesc.icons[0],
        zoneGauge: {
          value: uvIndex ?? 0,
          zones,
          max: 13,
          hideZoneLabel: true,
        }
      };
    }),

    safeBuild(t, t('moon'), title => {
      const moonDesc = buildMoonDescription(daily_moon, now, t);
      const moonPhaseZones = MOON_COLORS.map(({ hex: color, value }) => ({ value, color }));
      return {
        title,
        description: moonDesc.title,
        iconProps: moonDesc.icons[0],
        zoneGauge: {
          value: +(Number(moonDesc.title.split('(')?.[1]?.replaceAll('%)', '')))?.toFixed(1),
          unit: '%',
          zones: moonPhaseZones,
          max: 100,
          hideZoneLabel: true,
        }
      };
    }),

    safeBuild(t, t('windSpeed'), title => {
      const windDirectionNow = wind_direction_10m[nowIndex];
      const windSpeedNow = wind_speed_10m[nowIndex];
      const windSpeedDay = wind_speed_10m_mean[todayIndex];

      const compass = getCompassDirection(windDirectionNow, t);
      const windSpeedDesc = getWindSummary({ currentSpeed: windSpeedNow, averageSpeed: windSpeedDay, direction: compass.title }, t);
      const beaufortLevel = getBeaufortScale(windSpeedNow);
      const beaufortDuration = getWindGustAnimationDuration(windSpeedNow);
      const beaufortTitle = `Beaufort Scale: ${beaufortLevel} (${windSpeedNow})`;
      const directionText = `${capitalizeWords(t('wind'))} ${compass.name}`;

      return {
        title,
        description: windSpeedDesc,
        textColor: getWindColor(windSpeedNow, 'gusts'),
        iconsProps: [
          {
            src: getIconUrl(`wind-beaufort-${beaufortLevel}`),
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
          zones: windSpeedZones,
          hideZoneLabel: true,
          referenceZones: [
            { label: `${t('mean')}: ${windSpeedDay} ${windUnit}`, value: windSpeedDay }
          ]
        }
      };
    }),

    safeBuild(t, t('windGusts'), title => {

      const windGustsNow = wind_gusts_10m[nowIndex];
      const windGustsDay = wind_gusts_10m_mean[todayIndex];

      return {
        title,
        textColor: getWindColor(windGustsNow, 'gusts'),
        bigText: `${windGustsNow} ${windUnit}`,
        description: t('averageSpeedForDay', { speed: windGustsDay + windUnit }),
        zoneGauge: {
          value: windGustsNow,
          unit: ` ${windUnit}`,
          zones: windGustsZones,
          hideZoneLabel: true,
          referenceZones: [
            { label: `${t('mean')}: ${windGustsDay} ${windUnit}`, value: windGustsDay }
          ]
        }
      };
    }),

    safeBuild(t, t('visibility'), title => {

      const visibility = visibilityProp[nowIndex];

      const visibilityDesc = buildVisibilityDescription(visibility, visibilityUnit, locale, true, t);
      const visibilityZones = VISIBILITY_COLORS.map(({ hex: color, value }) => ({ color, value }));

      return {
        title,
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
      };
    }),

    safeBuild(t, t('humidity'), title => {

      const humidity = relative_humidity_2m[nowIndex];
      const humidityZones = HUMIDITY_COLORS.map(({ hex: color, value }) => ({ color, value }));

      return {
        title,
        bigText: humidity + humidityUnit,
        description: getHumidityDescription(humidity, t),
        textColor: getHumidityColor(humidity),
        zoneGauge: {
          value: humidity,
          unit: humidityUnit,
          zones: humidityZones,
          hideZoneLabel: true
        }
      };
    }),

    safeBuild(t, t('dewPoint'), title => {

      const dewPoint = dew_point_2m[nowIndex];

      const dewPointdesc = getDewPointDescription(dewPoint, t);
      const dewPointStops = [-10, 0, 7, 13, 18, 27];
      const dewPointZones: { value: number; color: string }[] =
        dewPointStops.map(value => ({ value, color: getDewPointColor(value) }));

      return {
        title,
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
      };
    }),

    safeBuild(t, t('daylight'), title => {

      const daylight = daylight_duration[todayIndex];
      const daylightInfo = getDaylightSunshineInfo(daylight, 'daylight', true, t);

      return {
        title,
        description: daylightInfo.desc,
        bigText: daylightInfo.time,
        textColor: daylightInfo.color,
        iconsProps: (daylight / 3600) < 1 ? [{ iconName: daylightInfo.icon }] : undefined,
        zoneGauge: {
          value: daylight / 60 / 60,
          valueLabel: () => formatDuration(daylight),
          zones: daylightZones,
          min: daylightZones[0].value,
          max: daylightZones[daylightZones.length - 1].value,
          hideZoneLabel: true,
        }
      };
    }),

    safeBuild(t, t('sunshine'), title => {

      const sunshine = sunshine_duration[todayIndex];
      const sunshineInfo = getDaylightSunshineInfo(sunshine, 'sunshine', true, t);

      return {
        title,
        description: sunshineInfo.desc,
        bigText: sunshineInfo.time,
        textColor: sunshineInfo.color,
        iconsProps: (sunshine / 3600) < 1 ? [{ iconName: sunshineInfo.icon }] : undefined,
        zoneGauge: {
          value: sunshine / 60 / 60,
          valueLabel: () => formatDuration(sunshine),
          zones: daylightZones,
          min: daylightZones[0].value,
          max: daylightZones[daylightZones.length - 1].value,
          hideZoneLabel: true,
        }
      };
    }),

    safeBuild(t, t('season'), title => {
      const { desc, daysProgressText, color } = getAstronomicalSeasonInfo(weather.latitude, now, t);

      return {
        title,
        bigText: daysProgressText,
        description: desc,
        textColor: color
      };
    }),

  ].filter(i => i !== undefined) as TWeatherWidgetsDataItem[];
}
