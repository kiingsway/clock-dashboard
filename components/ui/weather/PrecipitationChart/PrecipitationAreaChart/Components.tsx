import { IPrecipChartData } from "@/types/chart.types";
import { RiArrowDropRightFill } from "react-icons/ri";
import WeatherIcon from "../../WeatherIcon";
import { clampIconX } from "@/utils/charts/edgeLabels";

const ARROW_SIZE = 24;

/** `chartWidth`: largura do gráfico (0 = ainda não medida), para não sair da tela nas pontas. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Arrow = ({ cx, cy, accent, chartWidth = 0 }: { accent: string, chartWidth?: number } & any) => {
  const x = clampIconX(cx, ARROW_SIZE, chartWidth) ?? 0;

  return (
    <RiArrowDropRightFill
      x={x - ARROW_SIZE / 2}
      y={cy - ARROW_SIZE / 2}
      size={ARROW_SIZE}
      color={accent}
    />
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CustomAreaDot = (props: any) => {
  const { cx, cy, payload: p, chartWidth = 0 } = props;
  const payload = p as IPrecipChartData;

  const no = {
    rain: !payload.rain || payload.rain <= 0,
    showers: !payload.showers || payload.showers <= 0,
    snowfall: !payload.snowfall || payload.snowfall <= 0,
  };

  if (no.rain && no.showers && no.snowfall) return null;

  const size = 30;
  const x = clampIconX(cx, size, chartWidth) ?? 0;

  return (
    <foreignObject
      x={x - (size / 2)}
      y={(cy - (size + 2)) + 2}
      width={size}
      height={size}
    >
      <WeatherIcon
        size={size}
        weatherCode={payload.weatherCode}
        hideGlow
      />
    </foreignObject>
  );
};
