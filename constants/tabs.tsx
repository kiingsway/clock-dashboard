import WeatherTab from "@/components/tabs/WeatherTab";
import { TiWeatherPartlySunny } from "react-icons/ti";

export const TABS = {
  weather: {
    icon: <TiWeatherPartlySunny />,
    component: WeatherTab
  },
} as const;

export const TABS_NAMES = Object.keys(TABS) as TTabs[];

export type TTabs = keyof typeof TABS;