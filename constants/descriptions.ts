import { TFunction } from "i18next";
import { MAX_VISIBILITY_METERS, MIN_VISIBILITY_METERS } from "./visibility";

export function getDaylightDurationDescription(seconds: number, t: TFunction): string {
  const hours = seconds / 3600;

  if (hours < 8) return t("daylightTextes.veryShort");
  if (hours < 10) return t("daylightTextes.short");
  if (hours < 12) return t("daylightTextes.belowAverage");
  if (hours < 13) return t("daylightTextes.balanced");
  if (hours < 15) return t("daylightTextes.long");
  if (hours < 17) return t("daylightTextes.veryLong");

  return t("daylightTextes.exceptionallyLong");
}

export function getSunshineDurationDescription(seconds: number, t: TFunction): string {
  const hours = seconds / 3600;

  if (hours <= 0.5) return t("sunshineTextes.none");
  if (hours < 2) return t("sunshineTextes.veryLittle");
  if (hours < 4) return t("sunshineTextes.limited");
  if (hours < 6) return t("sunshineTextes.moderate");
  if (hours < 9) return t("sunshineTextes.plenty");
  if (hours < 12) return t("sunshineTextes.verySunny");

  return t("sunshineTextes.exceptionallySunny");
}

export function getDewPointDescription(dewPoint: number, t: TFunction): string {
  if (dewPoint < -10) return t("dewPointTexts.extremelyDry");
  if (dewPoint < 0) return t("dewPointTexts.veryDry");
  if (dewPoint < 7) return t("dewPointTexts.dryAndComfortable");
  if (dewPoint < 13) return t("dewPointTexts.comfortable");
  if (dewPoint < 16) return t("dewPointTexts.veryComfortable");
  if (dewPoint < 18) return t("dewPointTexts.slightlyComfortable");
  if (dewPoint < 21) return t("dewPointTexts.slightlyHumid");
  if (dewPoint < 24) return t("dewPointTexts.humid");
  if (dewPoint < 27) return t("dewPointTexts.veryHumid");

  return t("dewPointTexts.oppressive");
}

export function getHumidityDescription(percent: number, t: TFunction): string {
  if (percent < 20) return t("humidityTextes.extremelyDry");
  if (percent < 30) return t("humidityTextes.veryDry");
  if (percent < 40) return t("humidityTextes.dry");
  if (percent <= 60) return t("humidityTextes.comfortable");
  if (percent <= 70) return t("humidityTextes.slightlyHumid");
  if (percent <= 80) return t("humidityTextes.humid");
  if (percent <= 90) return t("humidityTextes.veryHumid");

  return t("humidityTextes.extremelyHumid");
}

export function getRainDescription(rainMm: number, t: TFunction): string {
  if (rainMm <= 0) return t("weatherTexts.rain.dry");
  if (rainMm < 0.2) return t("weatherTexts.rain.trace");
  if (rainMm < 1.0) return t("weatherTexts.rain.drizzle");
  if (rainMm < 2.5) return t("weatherTexts.rain.light");
  if (rainMm < 7.5) return t("weatherTexts.rain.moderate");
  if (rainMm < 15) return t("weatherTexts.rain.heavy");

  return t("weatherTexts.rain.torrential");
}

export function getVisibilityDescription(visibility: number, t: TFunction) {
  const [vmin, vmax] = [MIN_VISIBILITY_METERS, MAX_VISIBILITY_METERS];

  const percentage = (() => {
    if (visibility <= vmin) return 0;
    if (visibility >= vmax) return 100;
    return Math.round(((visibility - vmin) / (vmax - vmin)) * 100);
  })();

  if (visibility >= 10000) return t("visibilityTextes.excellent") + ` (${percentage}%)`;
  if (visibility >= 5000) return t("visibilityTextes.good") + ` (${percentage}%)`;
  if (visibility >= 2000) return t("visibilityTextes.moderate") + ` (${percentage}%)`;
  if (visibility >= 1000) return t("visibilityTextes.low") + ` (${percentage}%)`;
  if (visibility >= 500) return t("visibilityTextes.veryLow") + ` (${percentage}%)`;
  return t("visibilityTextes.critical") + ` (${percentage}%)`;
};

export const RAIN_DESCRIPTIONS = {
  prefix: 'rainTextes.hoursPrefix',

  noRain: "rainTextes.noRain",
  veryLowChance: "rainTextes.veryLowChance",
  drizzle: "rainTextes.drizzle",

  lightLowChance: "rainTextes.lightLowChance",
  lightPossible: "rainTextes.lightPossible",
  lightExpected: "rainTextes.lightExpected",

  moderateLowChance: "rainTextes.moderateLowChance",
  moderatePossible: "rainTextes.moderatePossible",
  moderateExpected: "rainTextes.moderateExpected",

  heavyLowChance: "rainTextes.heavyLowChance",
  heavyPossible: "rainTextes.heavyPossible",
  heavyExpected: "rainTextes.heavyExpected",

  veryHeavyLowChance: "rainTextes.veryHeavyLowChance",
  veryHeavyPossible: "rainTextes.veryHeavyPossible",
  veryHeavyExpected: "rainTextes.veryHeavyExpected",
} as const;

export function getRainSummaryDescription(rainHours: number, precipMM: number, chance: number, t: TFunction) {

  if (precipMM <= 0 && rainHours <= 0) return t(RAIN_DESCRIPTIONS.noRain);

  if (precipMM < 1) {
    if (chance < 30) return t(RAIN_DESCRIPTIONS.veryLowChance);
    else return t(RAIN_DESCRIPTIONS.drizzle);
  }

  // Chuva leve
  if (precipMM < 5) {
    if (chance < 30) return t(RAIN_DESCRIPTIONS.lightLowChance);
    if (chance < 60) return t(RAIN_DESCRIPTIONS.lightPossible);

    return t(RAIN_DESCRIPTIONS.lightExpected);
  }

  // Chuva moderada
  if (precipMM < 15) {
    if (chance < 30) return t(RAIN_DESCRIPTIONS.moderateLowChance);
    if (chance < 60) return t(RAIN_DESCRIPTIONS.moderatePossible);

    return t(RAIN_DESCRIPTIONS.moderateExpected);
  }

  // Chuva forte
  if (precipMM < 30) {
    if (chance < 30) return t(RAIN_DESCRIPTIONS.heavyLowChance);
    if (chance < 60) return t(RAIN_DESCRIPTIONS.heavyPossible);

    return t(RAIN_DESCRIPTIONS.heavyExpected);
  }

  // Chuva muito forte
  if (chance < 30) return t(RAIN_DESCRIPTIONS.veryHeavyLowChance);
  if (chance < 60) return t(RAIN_DESCRIPTIONS.veryHeavyPossible);

  return t(RAIN_DESCRIPTIONS.veryHeavyExpected);
}