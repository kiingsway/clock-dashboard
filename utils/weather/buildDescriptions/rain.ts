import { RAIN_DESCRIPTIONS } from "@/constants/rainDescriptions";
import { DailySheetItemDesc } from "@/types/weatherInfo.types";
import { TFunction } from "i18next";

interface RainData {
  hoursOfRain?: number;
  precipMM?: number;
  precipChance?: number;
}

export default function buildRainDescription(
  t: TFunction,
  {
    hoursOfRain = 0,
    precipMM: precipMM = 0,
    precipChance = 0,
  }: RainData
): DailySheetItemDesc {
  const hoursPrefix =
    hoursOfRain > 0
      ? t(RAIN_DESCRIPTIONS.prefix, { hours: hoursOfRain })
      : "";

  const description = (key: keyof typeof RAIN_DESCRIPTIONS) => `${hoursPrefix}${t(RAIN_DESCRIPTIONS[key])}`;

  const title = t('precipitationTexts.precipInHours', { precip: precipMM, chance: precipChance })

  // Sem chuva
  if (precipMM <= 0 && hoursOfRain <= 0) {
    return {
      title,
      desc: t(RAIN_DESCRIPTIONS.noRain),
      icons: [{ iconName: "umbrella-closed" }],
    };
  }

  // Garoa / chuva muito fraca
  if (precipMM < 1) {
    if (precipChance < 30) {
      return {
        title,
        desc: description("veryLowChance"),
        icons: [{ iconName: "umbrella-closed" }],
      };
    }

    return {
      title,
      desc: description("drizzle"),
      icons: [{ iconName: "umbrella" }],
    };
  }

  // Chuva leve
  if (precipMM < 5) {
    if (precipChance < 30) {
      return {
        title,
        desc: description("lightLowChance"),
        icons: [{ iconName: "umbrella" }],
      };
    }

    if (precipChance < 60) {
      return {
        title,
        desc: description("lightPossible"),
        icons: [{ iconName: "umbrella" }],
      };
    }

    return {
      title,
      desc: description("lightExpected"),
      icons: [{ iconName: "umbrella" }],
    };
  }

  // Chuva moderada
  if (precipMM < 15) {
    if (precipChance < 30) {
      return {
        title,
        desc: description("moderateLowChance"),
        icons: [{ iconName: "umbrella" }],
      };
    }

    if (precipChance < 60) {
      return {
        title,
        desc: description("moderatePossible"),
        icons: [{ iconName: "umbrella" }],
      };
    }

    return {
      title,
      desc: description("moderateExpected"),
      icons: [{ iconName: "umbrella" }],
    };
  }

  // Chuva forte
  if (precipMM < 30) {
    if (precipChance < 30) {
      return {
        title,
        desc: description("heavyLowChance"),
        icons: [{ iconName: "umbrella-wind" }],
      };
    }

    if (precipChance < 60) {
      return {
        title,
        desc: description("heavyPossible"),
        icons: [{ iconName: "umbrella-wind" }],
      };
    }

    return {
      title,
      desc: description("heavyExpected"),
      icons: [{ iconName: "umbrella-wind" }],
    };
  }

  // Chuva muito forte
  if (precipChance < 30) {
    return {
      title,
      desc: description("veryHeavyLowChance"),
      icons: [{ iconName: "umbrella-wind-alt" }],
    };
  }

  if (precipChance < 60) {
    return {
      title,
      desc: description("veryHeavyPossible"),
      icons: [{ iconName: "umbrella-wind-alt" }],
    };
  }

  return {
    title,
    desc: description("veryHeavyExpected"),
    icons: [{ iconName: "umbrella-wind-alt" }],
  };
}