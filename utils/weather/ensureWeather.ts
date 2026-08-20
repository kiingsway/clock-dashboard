import { IDaily, IWeather, IWeatherCurrent, IWeatherUnits } from "@/types/weather.types";
import { DateTime } from "luxon";
import { getCurrentIndex } from "../formatters/getValueByArray";
import { getSunWindow } from "./getSunWindow";

export function ensureWeather(weather: IWeather | undefined, now: DateTime, isLoading: boolean) {
  const timezone = weather?.timezone ?? 'UTC';

  const current = weather?.current ?? {
    temperature_2m: -999,
    apparent_temperature: -999,
    precipitation: 0,
    weather_code: isLoading ? -2 : -1,
    is_day: 1,
    time: now.toISO(),
  } as IWeatherCurrent;

  const currentUnits = weather?.current_units ?? {
    temperature_2m: "°C",
    precipitation: "mm",
  } as IWeatherUnits;

  const daily = weather?.daily ?? {
    time: [now.toISO()],
    sunrise: [now.toISO()],
    sunset: [now.toISO()],
    temperature_2m_max: [0],
    temperature_2m_min: [0],
  } as IDaily;

  const isDay = current.is_day === 1;

  const todayIndex = getCurrentIndex({ date: now, time: daily.time });
  const tempMin = daily.temperature_2m_min?.[todayIndex] ?? -999;
  const tempMax = daily.temperature_2m_max?.[todayIndex] ?? -999;

  const sunWindow = getSunWindow({
    includeNight: true,
    sunriseTimes: daily.sunrise,
    sunsetTimes: daily.sunset,
    timezone,
    date: now,
  });

  return {
    current,
    currentUnits,
    isDay,
    tempMin,
    tempMax,
    sunWindow,
  }
}