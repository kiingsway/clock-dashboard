import { DateTime } from "luxon";
import { ReactNode } from "react";

export interface IMoonInfo {
  title: string;
  icon: ReactNode;
}

export interface IMoonPhase extends IMoonInfo {
  phase: number
  isVisible: boolean | undefined
  iconSrc: string
  moonrise?: DateTime
  moonset?: DateTime
}

export interface IUVIcon {
  alt: string;
  src: string;
  desc: string;
  uv?: number;
  iconDuration?: number;
}

export interface IWindInfo {
  daily?: {
    speed: number;
    gusts: number;
    gustsColor?: string;
    desc: string;
  };
  hourly: {
    direction: {
      name?: string;
      src: string;
    };
    beaufort?: {
      src: string;
      value: BeaufortLevel
      duration: number
    };
    gusts?: number;
    gustsColor?: string;
    speed?: number;
    desc?: string;
  };
};

export type BeaufortLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface BeaufortResult {
  level: BeaufortLevel;
  description: string;
}

export interface IVisibilityInfo {
  value: number;
  title: string;
  color: string;
  desc: string;
}