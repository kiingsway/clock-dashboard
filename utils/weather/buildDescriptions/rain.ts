import { getRainSummaryDescription, RAIN_DESCRIPTIONS } from "@/constants/descriptions";
import { DailySheetItemDesc } from "@/types/weatherInfo.types";
import { TFunction } from "i18next";

export default function buildRainDescription(rainHours: number, precip: number, chance: number, t: TFunction): DailySheetItemDesc {

  const hoursPrefix = rainHours > 0 ? t(RAIN_DESCRIPTIONS.prefix, { hours: rainHours }) : "";

  const rainDesc = getRainSummaryDescription(rainHours, precip, chance, t);
  const desc = hoursPrefix + rainDesc;

  const title = t('precipitationTexts.precipInHours', { precip: precip, chance });

  // Sem chuva
  if (precip <= 0 && rainHours <= 0) {
    return {
      title,
      desc,
      icons: [{ iconName: "umbrella-closed" }],
    };
  }

  // Garoa / chuva muito fraca
  if (precip < 1) {

    if (chance < 30) {
      return {
        title,
        desc,
        icons: [{ iconName: "umbrella-closed" }],
      };
    }

    return {
      title,
      desc,
      icons: [{ iconName: "umbrella" }],
    };

  }

  // Chuva leve
  if (precip < 5) {
    if (chance < 30) {
      return {
        title,
        desc,
        icons: [{ iconName: "umbrella" }],
      };
    }

    if (chance < 60) {
      return {
        title,
        desc,
        icons: [{ iconName: "umbrella" }],
      };
    }

    return {
      title,
      desc,
      icons: [{ iconName: "umbrella" }],
    };
  }

  // Chuva moderada
  if (precip < 15) {
    if (chance < 30) {
      return {
        title,
        desc,
        icons: [{ iconName: "umbrella" }],
      };
    }

    if (chance < 60) {
      return {
        title,
        desc,
        icons: [{ iconName: "umbrella" }],
      };
    }

    return {
      title,
      desc,
      icons: [{ iconName: "umbrella" }],
    };
  }

  // Chuva forte
  if (precip < 30) {
    if (chance < 30) {
      return {
        title,
        desc,
        icons: [{ iconName: "umbrella-wind" }],
      };
    }

    if (chance < 60) {
      return {
        title,
        desc,
        icons: [{ iconName: "umbrella-wind" }],
      };
    }

    return {
      title,
      desc,
      icons: [{ iconName: "umbrella-wind" }],
    };
  }

  // Chuva muito forte
  if (chance < 30) {
    return {
      title,
      desc,
      icons: [{ iconName: "umbrella-wind-alt" }],
    };
  }

  if (chance < 60) {
    return {
      title,
      desc,
      icons: [{ iconName: "umbrella-wind-alt" }],
    };
  }

  return {
    title,
    desc,
    icons: [{ iconName: "umbrella-wind-alt" }],
  };
}