import { DateTime } from "luxon";

export interface SunEvent {
  time: DateTime;
  kind: "sunrise" | "sunset";
}

export interface SunWindow {
  start: DateTime;
  end: DateTime;
  startKind: "sunrise" | "sunset";
  endKind: "sunrise" | "sunset";
}