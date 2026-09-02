import { IWeather } from "@/types/weather.types";

const isValidWeather = (weather: unknown): weather is IWeather => {
  if (!weather || typeof weather !== 'object') return false;

  const data = weather as Partial<IWeather>;

  return (
    typeof data.latitude === 'number' &&
    typeof data.longitude === 'number' &&
    typeof data.timezone === 'string' &&
    !!data.current &&
    !!data.hourly &&
    !!data.daily
  );
};

export default isValidWeather;