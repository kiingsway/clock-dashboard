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

export function getSunWindow(
  sunriseTimes: string[],
  sunsetTimes: string[],
  timezone: string,
  currentTime?: string
): SunWindow {
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

  // "now" is always the actual current moment.
  const now = DateTime.now().setZone(timezone);

  // The requested date determines which sunrise/sunset
  // window should be displayed.
  const targetDate = currentTime
    ? DateTime.fromISO(currentTime, { zone: timezone })
    : now;

  const sunrise = events.find(
    (event) =>
      event.kind === "sunrise" &&
      event.time.hasSame(targetDate, "day")
  );

  const sunset = events.find(
    (event) =>
      event.kind === "sunset" &&
      event.time.hasSame(targetDate, "day")
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

  // Compare the requested day with today.
  const targetDay = targetDate.startOf("day");
  const today = now.startOf("day");

  let progress = 0;

  if (targetDay < today) {
    // Past day
    progress = 1;
  } else if (targetDay > today) {
    // Future day
    progress = 0;
  } else {
    // Today
    progress = Math.min(
      1,
      Math.max(
        0,
        (now.toMillis() - sunrise.time.toMillis()) /
          (sunset.time.toMillis() - sunrise.time.toMillis())
      )
    );
  }

  return {
    start: sunrise.time,
    end: sunset.time,
    startKind: "sunrise",
    endKind: "sunset",
    progress,
  };
}