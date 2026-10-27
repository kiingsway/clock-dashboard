import { BETA_TEMPERATURE_RAMP } from "@/constants/locations";
import { IWeather } from "@/types/weather.types";
import { DateTime } from "luxon";
import { getCurrentIndex } from "./formatters/getValueByArray";

/**
 * Troca as temperaturas por uma rampa de `FROM` (agora) até `TO` (daqui a `HOURS` horas).
 * Antes e depois da rampa os valores ficam travados nas pontas. Também ajusta a temperatura
 * atual e a mín/máx de hoje, para o resto do dashboard combinar com o gráfico.
 */
export function mockTemperatureRamp(weather: IWeather, ramp = BETA_TEMPERATURE_RAMP): IWeather {
  const { FROM, TO, HOURS, FEELS_LIKE_OFFSET } = ramp;
  const now = DateTime.now().setZone(weather.timezone);

  const start = getCurrentIndex(now, weather.hourly.time);
  if (start < 0) return weather;

  const tempAt = (index: number) => {
    const progress = Math.min(Math.max((index - start) / HOURS, 0), 1);
    return FROM + (TO - FROM) * progress;
  };

  const temperature = weather.hourly.time.map((_, i) => tempAt(i));
  const todayIndex = Math.max(getCurrentIndex(now, weather.daily.time), 0);

  const replaceAt = (values: number[], index: number, value: number) =>
    values.map((v, i) => i === index ? value : v);

  return {
    ...weather,
    current: {
      ...weather.current,
      temperature_2m: FROM,
      apparent_temperature: FROM + FEELS_LIKE_OFFSET,
    },
    hourly: {
      ...weather.hourly,
      temperature_2m: temperature,
      apparent_temperature: temperature.map(t => t + FEELS_LIKE_OFFSET),
    },
    daily: {
      ...weather.daily,
      temperature_2m_max: replaceAt(weather.daily.temperature_2m_max, todayIndex, Math.max(FROM, TO)),
      temperature_2m_min: replaceAt(weather.daily.temperature_2m_min, todayIndex, Math.min(FROM, TO)),
    },
  };
}
