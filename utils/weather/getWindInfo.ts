import { TFunction } from "i18next";

export function getWindGustAnimationDuration(windGust: number): number {
  const MIN_GUST = 0;
  const MAX_GUST = 100;

  const MIN_DURATION = 1.5; // 100 km/h
  const MAX_DURATION = 15;  // 0 km/h

  const gust = Math.min(Math.max(windGust, MIN_GUST), MAX_GUST);

  const t = (gust - MIN_GUST) / (MAX_GUST - MIN_GUST);

  return MAX_DURATION - t * (MAX_DURATION - MIN_DURATION);
}

interface WindSummaryData {
  currentSpeed: number;
  averageSpeed: number;
  direction: string;
}

export function getWindSummary({ currentSpeed, averageSpeed, direction }: WindSummaryData, t: TFunction): string {
  let impact: string;

  if (currentSpeed < 10) {
    impact = t("windTextes.impact.calm");
  } else if (currentSpeed < 20) {
    impact = t("windTextes.impact.light");
  } else if (currentSpeed < 30) {
    impact = t("windTextes.impact.moderate");
  } else if (currentSpeed < 50) {
    impact = t("windTextes.impact.strong");
  } else {
    impact = t("windTextes.impact.veryStrong");
  }

  return t("windTextes.summary", {
    current: `${currentSpeed}km/h`,
    average: `${averageSpeed}km/h`,
    direction,
    impact,
  });
}

export function getWindSummary2(speed: number, gusts: number, windUnit: string, compass: string, t: TFunction): string {
  let impact: string;

  if (speed < 10) {
    impact = t("windTextes.impact.calm");
  } else if (speed < 20) {
    impact = t("windTextes.impact.light");
  } else if (speed < 30) {
    impact = t("windTextes.impact.moderate");
  } else if (speed < 50) {
    impact = t("windTextes.impact.strong");
  } else {
    impact = t("windTextes.impact.veryStrong");
  }

  return `${t('windGusts')}: ${gusts} ${windUnit}. ${t('wind')} ${t(compass)}. ${impact}`;
}