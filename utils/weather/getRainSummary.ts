import { RAIN_DESCRIPTIONS } from "@/constants/rainDescriptions";
import { TFunction } from "i18next";

interface RainData {
  hoursOfRain?: number;
  precipitationMm?: number;
  chanceMax?: number;
}

interface RainSummary {
  description: string;
  iconName:
  | 'umbrella-closed'
  | 'umbrella'
  | 'umbrella-wind'
  | 'umbrella-wind-alt';
}

export default function getRainSummary(
  t: TFunction,
  {
    hoursOfRain = 0,
    precipitationMm = 0,
    chanceMax = 0,
  }: RainData
): RainSummary {
  const hoursPrefix =
    hoursOfRain > 0
      ? t(RAIN_DESCRIPTIONS.prefix, { hours: hoursOfRain })
      : "";

  const description = (key: keyof typeof RAIN_DESCRIPTIONS) => `${hoursPrefix}${t(RAIN_DESCRIPTIONS[key])}`;

  // Sem chuva
  if (precipitationMm <= 0 && hoursOfRain <= 0) {
    return {
      description: t(RAIN_DESCRIPTIONS.noRain),
      iconName: "umbrella-closed",
    };
  }

  // Garoa / chuva muito fraca
  if (precipitationMm < 1) {
    if (chanceMax < 30) {
      return {
        description: description("veryLowChance"),
        iconName: "umbrella-closed",
      };
    }

    return {
      description: description("drizzle"),
      iconName: "umbrella",
    };
  }

  // Chuva leve
  if (precipitationMm < 5) {
    if (chanceMax < 30) {
      return {
        description: description("lightLowChance"),
        iconName: "umbrella",
      };
    }

    if (chanceMax < 60) {
      return {
        description: description("lightPossible"),
        iconName: "umbrella",
      };
    }

    return {
      description: description("lightExpected"),
      iconName: "umbrella",
    };
  }

  // Chuva moderada
  if (precipitationMm < 15) {
    if (chanceMax < 30) {
      return {
        description: description("moderateLowChance"),
        iconName: "umbrella",
      };
    }

    if (chanceMax < 60) {
      return {
        description: description("moderatePossible"),
        iconName: "umbrella",
      };
    }

    return {
      description: description("moderateExpected"),
      iconName: "umbrella",
    };
  }

  // Chuva forte
  if (precipitationMm < 30) {
    if (chanceMax < 30) {
      return {
        description: description("heavyLowChance"),
        iconName: "umbrella-wind",
      };
    }

    if (chanceMax < 60) {
      return {
        description: description("heavyPossible"),
        iconName: "umbrella-wind",
      };
    }

    return {
      description: description("heavyExpected"),
      iconName: "umbrella-wind",
    };
  }

  // Chuva muito forte
  if (chanceMax < 30) {
    return {
      description: description("veryHeavyLowChance"),
      iconName: "umbrella-wind-alt",
    };
  }

  if (chanceMax < 60) {
    return {
      description: description("veryHeavyPossible"),
      iconName: "umbrella-wind-alt",
    };
  }

  return {
    description: description("veryHeavyExpected"),
    iconName: "umbrella-wind-alt",
  };
}