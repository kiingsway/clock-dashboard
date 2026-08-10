export type FeelsLikeDifferenceLevel =
  | "none"
  | "verySmall"
  | "small"
  | "moderate"
  | "large"
  | "extreme";

type Direction = "warmer" | "cooler";

export interface FeelsLikeDifference {
  level: FeelsLikeDifferenceLevel;
  direction: Direction | "same";
  delta: number;
}

const recommendations: Record<Direction, Record<FeelsLikeDifferenceLevel, string>> = {
  warmer: {
    none: "Feels close to the actual temperature.",
    verySmall: "Feels slightly warmer.",
    small: "Feels warmer than expected.",
    moderate: "Feels noticeably warmer.",
    large: "Feels much warmer.",
    extreme: "Feels significantly warmer.",
  },
  cooler: {
    none: "Feels close to the actual temperature.",
    verySmall: "Feels slightly cooler.",
    small: "Feels cooler than expected.",
    moderate: "Feels noticeably cooler.",
    large: "Feels much cooler.",
    extreme: "Feels significantly cooler.",
  },
};

export function getFeelsLikeDifference(temperature: number, feelsLike: number): FeelsLikeDifference {
  const delta = feelsLike - temperature;
  const absDelta = Math.abs(delta);

  let level: FeelsLikeDifferenceLevel;
  if (absDelta < 0.5) level = "none";
  else if (absDelta < 2) level = "verySmall";
  else if (absDelta < 4) level = "small";
  else if (absDelta < 7) level = "moderate";
  else if (absDelta < 10) level = "large";
  else level = "extreme";

  let direction: FeelsLikeDifference['direction'] = 'same';
  if (delta > 0) direction = 'warmer';
  else if (delta < 0) direction = 'cooler';

  return { level, direction, delta };
}

export function getFeelsLikeRecommendation(temperature: number, feelsLike: number): string {
  const { level, direction } = getFeelsLikeDifference(temperature, feelsLike);

  const temp = Math.round(temperature);

  if (direction === "same") return `Feels close to the actual mean temperature (${temp}ºC).`;

  return recommendations[direction][level] + ` (${temp}ºC).`;
}