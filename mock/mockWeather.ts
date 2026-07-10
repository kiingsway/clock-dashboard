import type { IWeather } from "../types/weather.types";

/**
 * Sample payload shaped exactly like the real API response, used only for
 * local preview/dev — not part of the published component package.
 */
function buildMockWeather(): IWeather {
  const now = new Date();
  now.setMinutes(0, 0, 0);

  const hourlyTime: string[] = [];
  const hourlyTemp: number[] = [];
  const hourlyPrecip: number[] = [];
  const hourlyApparent: number[] = [];
  const hourlyCode: number[] = [];

  for (let i = -2; i < 48; i++) {
    const d = new Date(now.getTime() + i * 3600_000);
    hourlyTime.push(d.toISOString());
    const hour = d.getHours();
    const base = 18 + 6 * Math.sin(((hour - 6) / 24) * Math.PI * 2);
    hourlyTemp.push(Math.round(base * 10) / 10);
    hourlyApparent.push(Math.round((base - 1.5) * 10) / 10);
    hourlyPrecip.push(hour >= 15 && hour <= 18 ? 1.2 : 0);
    hourlyCode.push(hour >= 15 && hour <= 18 ? 61 : hour >= 6 && hour <= 18 ? 1 : 0);
  }

  const dailyTime: string[] = [];
  const dailyMax: number[] = [];
  const dailyMin: number[] = [];
  const dailyCode: number[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(now.getTime() + i * 86_400_000);
    dailyTime.push(d.toISOString());
    dailyMax.push(24 + (i % 3));
    dailyMin.push(15 + (i % 2));
    dailyCode.push([0, 2, 61, 3, 80, 95, 71][i]);
  }

  return {
    latitude: 43.77,
    longitude: -79.42,
    generationtime_ms: 0.12,
    utc_offset_seconds: -14400,
    timezone: "America/Toronto",
    timezone_abbreviation: "EDT",
    elevation: 175,
    current_units: {
      time: "iso8601",
      interval: "seconds",
      temperature_2m: "°C",
      apparent_temperature: "°C",
      precipitation: "mm",
      weather_code: "wmo code",
    },
    current: {
      time: now.toISOString(),
      interval: 900,
      temperature_2m: 22.4,
      apparent_temperature: 21.1,
      precipitation: 0,
      weather_code: 2,
      is_day: 1,
    },
    hourly_units: {
      time: "iso8601",
      temperature_2m: "°C",
      precipitation: "mm",
      apparent_temperature: "°C",
      weather_code: "wmo code",
    },
    hourly: {
      time: hourlyTime,
      temperature_2m: hourlyTemp,
      precipitation: hourlyPrecip,
      apparent_temperature: hourlyApparent,
      weather_code: hourlyCode,
    },
    daily_units: {
      time: "iso8601",
      temperature_2m_max: "°C",
      temperature_2m_min: "°C",
      weather_code: "wmo code",
    },
    daily: {
      time: dailyTime,
      temperature_2m_max: dailyMax,
      temperature_2m_min: dailyMin,
      weather_code: dailyCode,
    },
  };
}

export const mockWeather: IWeather = buildMockWeather();
