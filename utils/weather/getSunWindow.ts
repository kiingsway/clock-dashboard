import { SunWindow, SunEvent } from "@/types/sun.types";
import { DateTime } from "luxon";

function buildSunWindow(now: DateTime, start: DateTime, end: DateTime, startKind: "sunrise" | "sunset", endKind: "sunrise" | "sunset"): SunWindow {

  const total = end.toMillis() - start.toMillis();
  const progress = total <= 0 ? 0 : Math.min(1, Math.max(0, (now.toMillis() - start.toMillis()) / total));

  return {
    start,
    end,
    startKind,
    endKind,
    progress,
  };
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
 * @param now Optional ISO 8601 date/time used as the target moment.
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
    let previous = events[0];
    let next = events[events.length - 1];

    for (const event of events) {
      if (event.time.toMillis() <= date.toMillis()) previous = event;
      if (event.time.toMillis() > date.toMillis()) {
        next = event;
        break;
      }
    }

    return buildSunWindow(
      date,
      previous.time,
      next.time,
      previous.kind,
      next.kind
    );
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

  const progress = ((): number => {
    if (!sunrise.time?.isValid || !sunset.time?.isValid) return 0;

    if (date >= sunset.time) return 1;
    if (date <= sunrise.time) return 0;

    const elapsed = date.diff(sunrise.time, "milliseconds").milliseconds;
    const duration = sunset.time.diff(sunrise.time, "milliseconds").milliseconds;

    return elapsed / duration;
  })();

  return {
    start: sunrise.time,
    end: sunset.time,
    startKind: "sunrise",
    endKind: "sunset",
    progress,
  };
}