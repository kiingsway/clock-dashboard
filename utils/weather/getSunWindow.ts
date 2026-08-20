import { SunWindow, SunEvent } from "@/types/sun.types";
import { DateTime } from "luxon";

const calculateProgressBetweenTwoDates = (startDate: DateTime, endDate: DateTime, progressDate: DateTime) => {
  if (!startDate?.isValid || !endDate?.isValid) return 0;

  if (progressDate >= endDate) return 1;
  if (progressDate <= startDate) return 0;

  const elapsed = progressDate.diff(startDate, "milliseconds").milliseconds;
  const duration = endDate.diff(startDate, "milliseconds").milliseconds;

  return elapsed / duration;
}

interface GetSunWindowAttr {
  sunriseTimes: string[]
  sunsetTimes: string[]
  timezone: string
  date: DateTime<boolean>
  includeNight?: boolean
}

/**
 * Returns the sunrise/sunset window for a given date and time.
 *
 * By default, the function returns the daytime window (sunrise → sunset)
 * for the target date. When `includeNight` is enabled, it instead returns
 * the current solar-cycle window, which may span sunset → next sunrise.
 *
 * `currentTime` is optional and defaults to the current time in the
 * specified timezone. It is used both to determine the target date and,
 * when applicable, the progress within the sunrise/sunset window.
 *
 * For daytime mode:
 * - Past days return `progress: 1`.
 * - Future days return `progress: 0`.
 * - Today calculates progress between sunrise and sunset.
 *
 * @param sunriseTimes ISO 8601 sunrise times without timezone information.
 * @param sunsetTimes ISO 8601 sunset times without timezone information.
 * @param timezone IANA timezone used to interpret the provided times.
 * @param date Optional ISO 8601 date/time used as the target moment.
 * @param includeNight Whether to allow the window to span sunset → sunrise.
 */
export function getSunWindow(p: GetSunWindowAttr): SunWindow | undefined {
  const { date, sunriseTimes, sunsetTimes, timezone, includeNight = false } = p;

  if (
    !sunriseTimes ||
    !sunsetTimes ||
    sunriseTimes.length <= 2 ||
    sunsetTimes.length <= 2
  ) {
    return undefined;
  }

  const events: SunEvent[] = [
    ...sunriseTimes.map((t) => ({
      time: DateTime.fromISO(t, { zone: timezone }),
      kind: "sunrise" as const,
    })),

    ...sunsetTimes.map((t) => ({
      time: DateTime.fromISO(t, { zone: timezone }),
      kind: "sunset" as const,
    })),
  ].sort((a, b) => a.time.toMillis() - b.time.toMillis());

  if (!events.length) throw new Error("No sunrise or sunset events available.");

  /**
   * includeNight
   * Usa o currentTime para determinar em qual trecho
   * do ciclo solar estamos:
   * 
   * sunrise → sunset
   * sunset  → sunrise
   */
  if (includeNight) {
    let start = events[0];
    let end = events[events.length - 1];

    for (const event of events) {
      if (event.time.toMillis() <= date.toMillis()) start = event;
      if (event.time.toMillis() > date.toMillis()) {
        end = event;
        break;
      }
    }

    const progress = calculateProgressBetweenTwoDates(start.time, end.time, date);

    return {
      start: start.time,
      end: end.time,
      startKind: start.kind,
      endKind: end.kind,
      progress: progress,
    };
  }

  /*
   * includeNight = false
   *
   * Sempre mostra sunrise → sunset do dia de now.
   */

  const sunrise = events.find(
    (event) =>
      event.kind === "sunrise" &&
      event.time.hasSame(date, "day")
  );

  const sunset = events.find(
    (event) =>
      event.kind === "sunset" &&
      event.time.hasSame(date, "day")
  );

  if (!sunrise || !sunset) {
    return {
      start: sunrise?.time ?? events[0].time,
      end: sunset?.time ?? events[events.length - 1].time,
      startKind: "sunrise",
      endKind: "sunset",
      progress: 0,
    };
  }

  const progress = calculateProgressBetweenTwoDates(sunrise.time, sunset.time, date);

  return {
    start: sunrise.time,
    end: sunset.time,
    startKind: "sunrise",
    endKind: "sunset",
    progress,
  };
}