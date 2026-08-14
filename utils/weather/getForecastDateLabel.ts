import { DateTime } from "luxon";

export default function getForecastDateLabel(now: DateTime, date: DateTime, locale: string) {
  const initialNow = now.startOf("day");
  const targetDate = date.startOf("day");
  const diffInDays = Math.abs(targetDate.diff(initialNow, "days").days);

  const localDate = date.setLocale(locale);

  // Até 7 dias: exibe apenas o dia da semana curto (ex: "ter.")
  if (diffInDays <= 7) return localDate.toFormat("ccc");

  // Mais de 7 dias: exibe o dia da semana curto + dia e mês formatados para a locale atual
  // Ex (pt-BR): "ter., 15 de ago." ou "ter., 15/08"
  return `${localDate.toLocaleString({ day: "numeric", month: "short" })}`;
}