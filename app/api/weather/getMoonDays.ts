import { getMoonIllumination, getMoonTimes } from "suncalc";
import { DateTime } from "luxon";
import { IMoonDaily } from "@/types/weather.types";
import MOON_PHASES from "@/constants/moonPhases";
import { NameIcon } from "@/types/weatherInfo.types";

export interface MoonDay {
  date: string;
  moonrise: string | null;
  moonset: string | null;
  alwaysUp: boolean;
  alwaysDown: boolean;
}

interface MoonEvent {
  time: DateTime;
  type: "moonrise" | "moonset";
}

interface GetMoonDaysParams {
  latitude: number;
  longitude: number;
  timezone: string;
  startDate: DateTime;
  days?: number;
}

export function getMoonDays({
  latitude,
  longitude,
  timezone,
  startDate,
  days = 14,
}: GetMoonDaysParams): IMoonDaily[] {
  if (days <= 0) return [];

  const firstDay = startDate
    .setZone(timezone)
    .startOf("day");

  const lastDay = firstDay.plus({ days: days - 1 });

  /*
   * Pegamos alguns dias antes e depois para garantir que
   * os eventos que atravessam a meia-noite sejam encontrados.
   */
  const calculationStart = firstDay.minus({ days: 2 });
  const calculationEnd = lastDay.plus({ days: 2 });

  const events: MoonEvent[] = [];

  let currentDay = calculationStart;

  while (currentDay <= calculationEnd) {
    const result = getMoonTimes(
      currentDay.toJSDate(),
      latitude,
      longitude
    );

    if (result.rise) {
      events.push({
        time: DateTime
          .fromJSDate(result.rise)
          .setZone(timezone),
        type: "moonrise",
      });
    }

    if (result.set) {
      events.push({
        time: DateTime
          .fromJSDate(result.set)
          .setZone(timezone),
        type: "moonset",
      });
    }

    currentDay = currentDay.plus({ days: 1 });
  }

  /** Ordena todos os eventos cronologicamente. */
  events.sort((a, b) => a.time.toMillis() - b.time.toMillis());

  /** Remove possíveis eventos duplicados. */
  const uniqueEvents = events.filter((event, index, array) => {
    if (index === 0) return true;

    const previous = array[index - 1];

    return !(
      event.type === previous.type &&
      event.time.toMillis() === previous.time.toMillis()
    );
  });

  return Array.from({ length: days }, (_, index) => {
    const date = firstDay.plus({ days: index });
    const dateKey = date.toISODate()!;

    /*
     * Procuramos o primeiro moonrise que ocorre nesse dia.
     */
    const moonrise = uniqueEvents.find(
      (event) =>
        event.type === "moonrise" &&
        event.time.hasSame(date, "day")
    );

    /*
     * O moonset pertence à janela iniciada pelo moonrise.
     *
     * Portanto, procuramos o primeiro moonset DEPOIS
     * desse moonrise, mesmo que ele aconteça no dia seguinte.
     */
    const moonset = moonrise
      ? uniqueEvents.find(
        (event) =>
          event.type === "moonset" &&
          event.time.toMillis() > moonrise.time.toMillis()
      )
      : undefined;

    const { phase } = getMoonIllumination(date.toJSDate());

    let moon: NameIcon;

    if (phase < 1 / 16 || phase >= 15 / 16) {
      moon = MOON_PHASES.new;
    } else if (phase < 3 / 16) {
      moon = MOON_PHASES.waxingCrescent;
    } else if (phase < 5 / 16) {
      moon = MOON_PHASES.firstQuarter;
    } else if (phase < 7 / 16) {
      moon = MOON_PHASES.waxingGibbous;
    } else if (phase < 9 / 16) {
      moon = MOON_PHASES.full;
    } else if (phase < 11 / 16) {
      moon = MOON_PHASES.waningGibbous;
    } else if (phase < 13 / 16) {
      moon = MOON_PHASES.lastQuarter;
    } else {
      moon = MOON_PHASES.waningCrescent;
    }

    return {
      name: moon.name,
      iconName: moon.icon,
      date: dateKey,
      moonrise: moonrise?.time.toISO() ?? undefined,
      moonset: moonset?.time.toISO() ?? undefined,
      phase,
      alwaysUp: false,
      alwaysDown: false,
    };
  });
}