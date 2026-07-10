import type { FC } from "react";
import "../styles/tokens.css";
import styles from "./WeatherDashboard.module.css";
import { Clock } from "@/components/Clock";
import { CurrentWeatherCard } from "@/components/CurrentWeatherCard";
import { DailyForecast } from "@/components/DailyForecast";
import { HourlyForecast } from "@/components/HourlyForecast";
import { getDayPart, formatClock } from "@/helpers/dateTime";
import { useClock } from "@/helpers/useClock";
import { useWeatherPolling } from "@/hooks/useWeatherPolling";

export interface WeatherDashboardProps {
  /** Location to request weather for. Defaults to (0, 0) as a placeholder
   * until the host app wires up geolocation or a saved location. */
  latitude?: number;
  longitude?: number;
}

export const WeatherDashboard: FC<WeatherDashboardProps> = ({
  latitude = 0,
  longitude = 0,
}) => {
  const now = useClock();
  const dayPart = getDayPart(now.getHours());
  const request = useWeatherPolling(latitude, longitude);

  return (
    <div className={`${styles.dashboard} weatherDashboard`} data-daypart={dayPart}>

      <div className={styles.content}>
        <header className={styles.top}>
          <Clock now={now} />
          <div className={styles.currentColumn}>
            {request.status === "ready" && (
              <>
                <CurrentWeatherCard
                  current={request.data.current}
                  units={request.data.current_units}
                  min={request.data.daily.temperature_2m_min[0]}
                  max={request.data.daily.temperature_2m_max[0]}
                />
                <p className={styles.updatedAt}>
                  Atualizado às {formatClock(request.updatedAt)}
                </p>
              </>
            )}
            {request.status === "loading" && (
              <div className={styles.placeholderCard} aria-live="polite">
                Carregando previsão…
              </div>
            )}
            {request.status === "error" && (
              <div className={styles.placeholderCard} role="alert">
                Não foi possível carregar a previsão.
              </div>
            )}
          </div>
        </header>

        {request.status === "ready" && (
          <>
            <HourlyForecast
              hourly={request.data.hourly}
              units={request.data.hourly_units}
              now={now}
            />
            <DailyForecast
              daily={request.data.daily}
              units={request.data.daily_units}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default WeatherDashboard;