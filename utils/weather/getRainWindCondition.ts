import { TFunction } from "i18next";

export interface WeatherCondition {
  status: string;
  description: string;
  safeToGoOut: boolean;
  severity: 'low' | 'moderate' | 'high' | 'extreme';
}

export function getRainWindCondition(rain: number, gusts: number, t: TFunction): WeatherCondition {
  const isRainy = rain > 0.2;
  const isHeavyRain = rain >= 5.0;
  const isModerateRain = rain >= 1.5 && rain < 5.0;

  const isWindy = gusts >= 23;
  const isStrongWind = gusts >= 45;
  const isSevereWind = gusts >= 65;

  if (!isRainy && !isWindy) {
    return {
      status: t("weatherConditions.rainWind.clear.status"),
      description: t("weatherConditions.rainWind.clear.description"),
      safeToGoOut: true,
      severity: "low",
    };
  }

  if (!isRainy && isWindy) {
    if (isSevereWind) {
      return {
        status: t("weatherConditions.rainWind.severeWind.status"),
        description: t("weatherConditions.rainWind.severeWind.description"),
        safeToGoOut: false,
        severity: "high",
      };
    }

    if (isStrongWind) {
      return {
        status: t("weatherConditions.rainWind.strongWind.status"),
        description: t("weatherConditions.rainWind.strongWind.description"),
        safeToGoOut: true,
        severity: "moderate",
      };
    }

    return {
      status: t("weatherConditions.rainWind.moderateBreeze.status"),
      description: t("weatherConditions.rainWind.moderateBreeze.description"),
      safeToGoOut: true,
      severity: "low",
    };
  }

  if (isRainy && !isWindy) {
    if (isHeavyRain) {
      return {
        status: t("weatherConditions.rainWind.heavyRain.status"),
        description: t("weatherConditions.rainWind.heavyRain.description"),
        safeToGoOut: true,
        severity: "moderate",
      };
    }

    if (isModerateRain) {
      return {
        status: t("weatherConditions.rainWind.moderateRain.status"),
        description: t("weatherConditions.rainWind.moderateRain.description"),
        safeToGoOut: true,
        severity: "low",
      };
    }

    return {
      status: t("weatherConditions.rainWind.lightDrizzle.status"),
      description: t("weatherConditions.rainWind.lightDrizzle.description"),
      safeToGoOut: true,
      severity: "low",
    };
  }

  if (isHeavyRain && isStrongWind) {
    return {
      status: t("weatherConditions.rainWind.storm.status"),
      description: t("weatherConditions.rainWind.storm.description"),
      safeToGoOut: false,
      severity: "extreme",
    };
  }

  if (isRainy && isStrongWind) {
    return {
      status: t("weatherConditions.rainWind.windDrivenRain.status"),
      description: t("weatherConditions.rainWind.windDrivenRain.description"),
      safeToGoOut: false,
      severity: "high",
    };
  }

  return {
    status: t("weatherConditions.rainWind.rainWithWind.status"),
    description: t("weatherConditions.rainWind.rainWithWind.description"),
    safeToGoOut: true,
    severity: "moderate",
  };
}