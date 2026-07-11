import { IWeather, SupportedLocale } from "@/types2/weather.types";
import "../styles2/tokens.css";
import styles from "./WeatherClockApp.module.css";
import { CurrentWeather } from "@/components2/CurrentWeather/CurrentWeather";
import { detectLocale } from "@/utils/i18n";
import { getAccentColor, getWeatherCategory } from "@/utils/weatherIcons";
import { Clock } from "@/components2/Clock/Clock";
import { HourlyForecast } from "@/components2/HourlyForecast/HourlyForecast";
import { DailyForecast } from "@/components2/DailyForecast/DailyForecast";

export interface WeatherClockAppProps {
  /** Full API payload — components read directly from it, no refetching or converting. */
  weather: IWeather;
  /** UI language. Defaults to the browser's language (pt-BR or en-US). */
  locale?: SupportedLocale;
  className?: string;
}

/**
 * Mobile, always-dark clock + weather screen. Designed to be read at a
 * glance from ~30cm, in a dark room, without hurting your eyes: no pure
 * white or pure black, and the only animation is a slow, dim glow behind
 * the weather icon whose color follows the current sky condition.
 */
export function WeatherClockApp({ weather, locale, className }: WeatherClockAppProps) {
  const resolvedLocale = locale ?? detectLocale();
  const { current, current_units, hourly, hourly_units, daily, daily_units, timezone } = weather;

  const category = getWeatherCategory(current.weather_code);
  const isDay = current.is_day !== 0;
  const accent = getAccentColor(category, isDay);

  return (
    <div
      className={[styles.root, "weather-clock-root", className].filter(Boolean).join(" ")}
      style={{ ["--wc-accent" as string]: accent }}
    >
      <Clock locale={resolvedLocale} timeZone={timezone} />

      <CurrentWeather
        current={current}
        currentUnits={current_units}
        todayMax={daily.temperature_2m_max[0] ?? current.temperature_2m}
        todayMin={daily.temperature_2m_min[0] ?? current.temperature_2m}
        sunrises={daily.sunrise}
        sunsets={daily.sunset}
        locale={resolvedLocale}
        timeZone={timezone}
      />

      <HourlyForecast
        hourly={hourly}
        hourlyUnits={hourly_units}
        currentTime={current.time}
        timeZone={timezone}
        sunrises={daily.sunrise}
        sunsets={daily.sunset}
        locale={resolvedLocale}
      />

      <DailyForecast daily={daily} dailyUnits={daily_units} timeZone={timezone} locale={resolvedLocale} />
    </div>
  );
}
