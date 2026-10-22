import { TFunction } from "i18next";
import { DateTime } from "luxon";

export default function getForecastDateLabel(now: DateTime, date: DateTime, locale: string, t: TFunction) {
  const diffInDays = Math.round(date.startOf("day").diff(now.startOf("day"), "days").days);

  if (diffInDays === -1) return t('yesterday');
  if (diffInDays === 0) return t('today');

  const localDate = date.setLocale(locale);

  // Até 7 dias: exibe apenas o dia da semana curto (ex: "ter.")
  if (Math.abs(diffInDays) <= 7) return localDate.toFormat("ccc");

  // Mais de 7 dias: exibe o dia e o mês formatados para a locale atual (ex: "15 de ago.")
  return localDate.toLocaleString({ day: "numeric", month: "short" });
}
