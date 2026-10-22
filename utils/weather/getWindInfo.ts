import { TFunction } from "i18next";
import type { WeatherIconProps } from "@/components/ui/weather/WeatherIcon";
import { getIconUrl } from "@/constants/iconFiles";
import getBeaufortScale from "@/utils/geo/getBeaufortScale";
import { capitalizeWords } from "@/utils/formatters/textFormatters";

function getWindGustAnimationDuration(windGust: number): number {
  const MIN_GUST = 0;
  const MAX_GUST = 100;

  const MIN_DURATION = 1.5; // 100 km/h
  const MAX_DURATION = 15;  // 0 km/h

  const gust = Math.min(Math.max(windGust, MIN_GUST), MAX_GUST);

  const t = (gust - MIN_GUST) / (MAX_GUST - MIN_GUST);

  return MAX_DURATION - t * (MAX_DURATION - MIN_DURATION);
}

/** Texto de impacto do vento ("calmo", "forte"...) a partir da velocidade em km/h. */
function getWindImpact(speed: number, t: TFunction): string {
  if (speed < 10) return t("windTextes.impact.calm");
  if (speed < 20) return t("windTextes.impact.light");
  if (speed < 30) return t("windTextes.impact.moderate");
  if (speed < 50) return t("windTextes.impact.strong");
  return t("windTextes.impact.veryStrong");
}

interface WindSummaryData {
  currentSpeed: number;
  averageSpeed: number;
  direction: string;
}

/** Resumo do vento agora, comparado com a média do dia (card de vento). */
export function getWindSummary({ currentSpeed, averageSpeed, direction }: WindSummaryData, t: TFunction): string {
  return t("windTextes.summary", {
    current: `${currentSpeed}km/h`,
    average: `${averageSpeed}km/h`,
    direction,
    impact: getWindImpact(currentSpeed, t),
  });
}

/** Resumo do vento de um dia: rajadas, direção e impacto (detalhes do dia). */
export function getDailyWindSummary(speed: number, gusts: number, windUnit: string, compass: string, t: TFunction): string {
  return `${t('windGusts')}: ${gusts} ${windUnit}. ${t('wind')} ${t(compass)}. ${getWindImpact(speed, t)}`;
}

/**
 * Ícones animados de escala Beaufort e de direção do vento. A velocidade do
 * vento define o nível de Beaufort e a velocidade da animação.
 */
export function getWindIcons(windSpeed: number, compass: { name: string; iconSrc: string }, t: TFunction): WeatherIconProps[] {
  const level = getBeaufortScale(windSpeed);
  const duration = getWindGustAnimationDuration(windSpeed);

  const beaufortTitle = `Beaufort Scale: ${level} (${windSpeed})`;
  const directionText = `${capitalizeWords(t('wind'))} ${compass.name}`;

  return [
    {
      src: getIconUrl(`wind-beaufort-${level}`),
      title: beaufortTitle,
      alt: beaufortTitle,
      duration,
    },
    {
      src: compass.iconSrc,
      title: directionText,
      alt: directionText,
      duration,
    },
  ];
}
