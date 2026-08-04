import { DateTime } from "luxon";

export function isXMinBefore(timeA: DateTime, timeB: DateTime, minutes: number): boolean {
  const diffInMinutes = timeB.diff(timeA, 'minutes').minutes;
  return diffInMinutes >= 0 && diffInMinutes <= minutes;
}

export const roundValues = (...values: number[]) => values.map(Math.round);