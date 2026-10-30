import { JSX } from "react";
import WeatherIcon, { WeatherIconProps } from "@/components/ui/weather/WeatherIcon";

interface WeatherIconObjectProps {
  cx: number | undefined;
  cy: number | undefined;
  icon: WeatherIconProps;
  size?: number;
  hideGlow?: boolean;
}

export default function WeatherIconObject({ cx = 0, cy = 0, icon, size = 28, hideGlow }: WeatherIconObjectProps): JSX.Element {

  return (
    <foreignObject
      x={cx - (size / 2)}
      y={cy - (size / 2)}
      width={size}
      height={size}>
      <WeatherIcon {...icon} hideGlow={hideGlow} size={size} />
    </foreignObject>
  );
}
