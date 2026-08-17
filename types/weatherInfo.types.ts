import { ReactNode } from "react";

export interface NameIcon {
  name: string;
  icon: string;
}

export interface IMoonInfo extends Omit<NameIcon, 'icon'> {
  name: string;
  phase: number;
  icon: ReactNode;
  iconSrc: string;
  iconName: string;
  isVisible: boolean;
}

export interface IUVIcon {
  alt: string;
  src: string;
  desc: string;
  uv?: number;
  iconDuration?: number;
}

interface WindMetric {
  direction?: {
    name: string;
    src: string;
  };
  gusts: {
    value: number;
    unit: string;
    color: string | undefined;
    desc: string | undefined;
  };
  speed: {
    value: number;
    unit: string;
    color: string | undefined;
    desc: string | undefined;
  };
  beaufort: undefined | {
    src: string;
    value: BeaufortLevel;
    duration: number;
  };
}

export interface IWindInfo {
  now: WindMetric;
  day: WindMetric;
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