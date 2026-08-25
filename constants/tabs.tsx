import WeatherTab from "@/components/tabs/WeatherTab";
import { TiWeatherPartlySunny } from "react-icons/ti";

export const TABS = {
  weather: {
    icon: <TiWeatherPartlySunny />,
    component: WeatherTab
  },
} as const;