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

/**
 * Works out which stretch of the sun cycle "now" is in, and how far through
 * it we are — so the track always shows a *forward* span:
 *  - during the day: sunrise → today's sunset
 *  - during the night: sunset → tomorrow's sunrise
 *  - in the early hours before today's sunrise: last night's sunset → today's sunrise
 *
 * `sunriseTimes` / `sunsetTimes` only need today's entry to work; a second
 * entry (tomorrow) makes the after-sunset case exact instead of a ±24h
 * estimate, and there's no equivalent "yesterday" entry available from the
 * API, so the before-sunrise case always estimates from today's sunset.
 */

export function getSunWindow(currentTime: string, sunriseTimes: string[], sunsetTimes: string[], timezone: string): SunWindow {
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

  const now = DateTime.fromISO(currentTime, { zone: timezone });

  let previous = events[0];
  let next = events[events.length - 1];

  for (const event of events) {
    if (event.time <= now) {
      previous = event;
    }

    if (event.time > now) {
      next = event;
      break;
    }
  }

  return buildSunWindow(
    now,
    previous.time,
    next.time,
    previous.kind,
    next.kind
  );
}