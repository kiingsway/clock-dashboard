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

export type RainDescription =
  typeof RAIN_DESCRIPTIONS[keyof typeof RAIN_DESCRIPTIONS];