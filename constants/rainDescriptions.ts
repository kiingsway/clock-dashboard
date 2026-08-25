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

// Limites máximos esperados para aplicar a cor "100% forte"
export const MAX_RAIN_MM_LIMIT = 15;
export const MAX_SHOWERS_MM_LIMIT = 15;
export const MAX_SNOWFALL_CM_LIMIT = 5;

export const MIN_RAIN_ALERT_HOURS = 4;
export const MAX_RAIN_ALERT_HOURS = 24;