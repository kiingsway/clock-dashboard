import MOON_PHASES from "@/constants/moonPhases";
import { IMoonInfo, NameIcon } from "@/types/weatherInfo.types";
import { DateTime } from "luxon";
import { getMoonIllumination, getMoonPosition } from "suncalc";
import Image from "next/image";
import { ICON_BASE_URI } from "@/constants/iconFiles";
import { IMoonDaily } from "@/types/weather.types";

function getMoonPhaseInfo(phase: number) {
  let moon: NameIcon;

  if (phase < 1 / 16 || phase >= 15 / 16) {
    moon = MOON_PHASES.new;
  } else if (phase < 3 / 16) {
    moon = MOON_PHASES.waxingCrescent;
  } else if (phase < 5 / 16) {
    moon = MOON_PHASES.firstQuarter;
  } else if (phase < 7 / 16) {
    moon = MOON_PHASES.waxingGibbous;
  } else if (phase < 9 / 16) {
    moon = MOON_PHASES.full;
  } else if (phase < 11 / 16) {
    moon = MOON_PHASES.waningGibbous;
  } else if (phase < 13 / 16) {
    moon = MOON_PHASES.lastQuarter;
  } else {
    moon = MOON_PHASES.waningCrescent;
  }

  return moon;
}

interface GetMoonInfoBaseProps {
  now: DateTime<boolean>;
  date?: DateTime<boolean>;
  lat: number;
  lon: number;
  iconSize?: number;
}

interface GetMoonInfoWithDailyMoonProps extends GetMoonInfoBaseProps {
  dailyMoon: IMoonDaily[];
}

interface GetMoonInfoWithoutDailyMoonProps extends GetMoonInfoBaseProps {
  dailyMoon?: undefined;
}

interface MoonTimes {
  moonrise: DateTime<true> | undefined;
  moonset: DateTime<true> | undefined;
  progress: number | undefined;
}

export type IMoonInfoWithTimes = IMoonInfo & MoonTimes;

function getMoonInfo(
  props: GetMoonInfoWithDailyMoonProps
): IMoonInfoWithTimes;

function getMoonInfo(
  props: GetMoonInfoWithoutDailyMoonProps
): IMoonInfo

function getMoonInfo({
  now,
  date: initialDate = now,
  lat,
  lon,
  iconSize = 100,
  dailyMoon,
}: GetMoonInfoWithDailyMoonProps | GetMoonInfoWithoutDailyMoonProps): IMoonInfo | IMoonInfoWithTimes {
  const date = initialDate.setZone(now.zone);

  const { phase } = getMoonIllumination(date.toJSDate());
  const { altitude } = getMoonPosition(date.toJSDate(), lat, lon);

  const { name, icon: iconName } = getMoonPhaseInfo(phase);

  const isVisible = altitude > 2;

  const iconSrc = `${ICON_BASE_URI}${iconName}.svg`;

  const icon = (
    <Image
      src={iconSrc}
      alt={name}
      title={name}
      loading="lazy"
      style={{
        width: `${iconSize / 16}em`,
        height: `${iconSize / 16}em`,
        display: "block",
      }}
    />
  );

  const baseInfo: IMoonInfo = {
    name,
    phase,
    icon,
    iconSrc,
    iconName,
    isVisible,
  };

  // Sem dailyMoon: não adiciona moonrise/moonset
  if (!dailyMoon) return baseInfo;

  if (!date.isValid) {
    return {
      ...baseInfo,
      moonrise: undefined,
      moonset: undefined,
    };
  }

  const targetDateISO = date.toISODate();

  if (!targetDateISO) {
    return {
      ...baseInfo,
      moonrise: undefined,
      moonset: undefined,
    };
  }

  const moonDay = dailyMoon.find(
    (day) => day.date === targetDateISO
  );

  if (!moonDay) {
    return {
      ...baseInfo,
      moonrise: undefined,
      moonset: undefined,
    };
  }

  const moonrise = moonDay.moonrise
    ? DateTime.fromISO(moonDay.moonrise)
    : undefined;

  const moonset = moonDay.moonset
    ? DateTime.fromISO(moonDay.moonset)
    : undefined;

  const progress = ((): number => {
    if (!moonrise?.isValid || !moonset?.isValid) return 0;

    if (now >= moonset) {
      return 1;
    } else if (now <= moonrise) {
      return 0;
    } else {
      const total = moonset.toMillis() - moonrise.toMillis();

      return total <= 0 ?
        0
        : Math.min(
          1,
          Math.max(
            0,
            (date.toMillis() - moonrise.toMillis()) /
            total
          )
        );
    }
  })();

  return {
    ...baseInfo,
    moonrise: moonrise?.isValid ? moonrise : undefined,
    moonset: moonset?.isValid ? moonset : undefined,
    progress
  };
}

export default getMoonInfo;