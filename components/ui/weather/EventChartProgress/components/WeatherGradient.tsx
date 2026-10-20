import { GradientStop } from "../types";

interface Props {
  id: string;
  stops: GradientStop[];
}

/** Gradiente horizontal: cada parada é a cor do clima de uma hora. */
export default function WeatherGradient({ id, stops }: Props) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
      {stops.map((stop, index) => (
        <stop key={index} offset={stop.offset} stopColor={stop.color} />
      ))}
    </linearGradient>
  );
}
