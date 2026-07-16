import { DateTime } from "luxon";

/**
 * Hour label for the hourly strip ("14h" / "2 PM").
 * Uses Luxon to preserve the provided IANA timezone.
 */
export function formatHourLabel(
  date: DateTime,
  locale: string
): string {
  const hour24 = date.hour;

  const lang = locale.split("-")[0];

  switch (lang) {
    case "pt":
      return `${hour24}h`;

    case "fr":
      return `${hour24} h`;

    case "es":
      return `${hour24}:00`;

    case "ko": {
      const period = hour24 < 12 ? "오전" : "오후";
      const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
      return `${period} ${hour12}시`;
    }

    case "en":
    default: {
      const period = hour24 < 12 ? "AM" : "PM";
      const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
      return `${hour12} ${period}`;
    }
  }
}

export interface SunWindow {
  start: DateTime;
  end: DateTime;
  startKind: "sunrise" | "sunset";
  endKind: "sunrise" | "sunset";
  /** 0–1 position of `currentTime` between `start` and `end`. */
  progress: number;
}

interface SunEvent {
  time: DateTime;
  kind: "sunrise" | "sunset";
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

export const APP_INFO = {
  version: process.env.NEXT_PUBLIC_APP_VERSION!,
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",
};

export function splitCamelCase(text: string): string {
  if (!text) return '';

  const result = text.replace(/([A-Z])/g, ' $1').trim();

  return result.charAt(0).toUpperCase() + result.slice(1);
}

export function capitalizeWords(text: string): string {
  return text
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}