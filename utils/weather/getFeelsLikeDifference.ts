import { TFunction } from "i18next";

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
    none: 'feelsLikeDifferenceTextes.none',
    verySmall: 'feelsLikeDifferenceTextes.warmer.verySmall',
    small: 'feelsLikeDifferenceTextes.warmer.small',
    moderate: 'feelsLikeDifferenceTextes.warmer.moderate',
    large: 'feelsLikeDifferenceTextes.warmer.large',
    extreme: 'feelsLikeDifferenceTextes.warmer.extreme',
  },
  cooler: {
    none: 'feelsLikeDifferenceTextes.none',
    verySmall: 'feelsLikeDifferenceTextes.cooler.verySmall',
    small: 'feelsLikeDifferenceTextes.cooler.small',
    moderate: 'feelsLikeDifferenceTextes.cooler.moderate',
    large: 'feelsLikeDifferenceTextes.cooler.large',
    extreme: 'feelsLikeDifferenceTextes.cooler.extreme',
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

export function getFeelsLikeRecommendation(temperature: number, feelsLike: number, t: TFunction): string {
  const { level, direction } = getFeelsLikeDifference(temperature, feelsLike);

  if (direction === "same") return t(`feelsLikeDifferenceTextes.none`);

  return t(recommendations[direction][level]);
}