import { IAQI } from "@/types/aqi.types";

const isValidAirQualityData = (aqi: unknown): aqi is IAQI => {
  if (!aqi || typeof aqi !== 'object') return false;

  const data = aqi as Partial<IAQI>;

  return (
    typeof data.latitude === 'number' &&
    typeof data.longitude === 'number' &&
    typeof data.timezone === 'string' &&
    !!data.current &&
    typeof data.current.european_aqi === 'number' &&
    typeof data.current.us_aqi === 'number' &&
    !!data.hourly &&
    Array.isArray(data.hourly.time) &&
    Array.isArray(data.hourly.european_aqi) &&
    Array.isArray(data.hourly.us_aqi)
  );
};

export default isValidAirQualityData;