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