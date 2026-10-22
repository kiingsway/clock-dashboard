import { IMoonDailyItem } from "@/types/weather.types";
import { TFunction } from "i18next";
import { DateTime } from "luxon";
import { isValidDateTime } from "../formatters/dateFormatters";

const timeOrDateTime = (d: DateTime<true>, isToday = false) => d.toFormat(`${isToday ? '' : 'dd/LL'} HH:mm`);

export default function getMoonEvent(moonDays: IMoonDailyItem[], index: number, event: 'rise' | 'set', t: TFunction): string {
  const label = t(`moon${event}`);
  const format = (date?: DateTime) =>
    isValidDateTime(date) ? `${label}: ${timeOrDateTime(date)}` : null;

  // setZone: mantém o fuso do texto ISO (o da localização), em vez de converter para o do navegador.
  const parse = (iso: string) => DateTime.fromISO(iso, { setZone: true });

  const moonNow = moonDays[index]?.[event]?.date;
  const current = moonNow ? format(parse(moonNow)) : undefined;
  if (current) return current;

  const otherDayIndex = event === 'rise' ? index - 1 : index + 1;
  const moonOtherDay = moonDays[otherDayIndex]?.[event]?.date;
  const other = moonOtherDay ? format(parse(moonOtherDay)) : undefined;

  return other ?? `${label}: --:--`;
}
