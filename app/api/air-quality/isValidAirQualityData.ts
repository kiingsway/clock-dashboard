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
    typeof data.current.us_aqi === 'number'
  );
};

export default isValidAirQualityData;