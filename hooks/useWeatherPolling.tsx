import { useCallback, useEffect, useRef, useState } from "react";
import type { WeatherData } from "../types/weather.types";
import { fetchWeather } from "@/helpers/fetchWeather";

/** How often to silently re-fetch in the background. */
const REFRESH_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

/** Avoid refetching again if the tab was only hidden for a moment. */
const MIN_REFRESH_GAP_MS = 5 * 60 * 1000; // 5 minutes

export type WeatherRequestState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: WeatherData; updatedAt: Date };

/**
 * Fetches weather for a location and keeps it current for as long as the
 * component stays mounted — meant for a dashboard left open for days:
 *
 * - Re-fetches on a timer (every REFRESH_INTERVAL_MS).
 * - Re-fetches when the tab/screen becomes visible again, if enough time
 *   has passed (covers a phone that was locked/asleep for a while).
 * - Re-fetches when the device regains a network connection.
 * - A background refetch that fails keeps showing the last good data
 *   instead of clearing the screen — only the *first* load can show the
 *   error state, since there's nothing to fall back to yet.
 */
export function useWeatherPolling(
  latitude: number,
  longitude: number
): WeatherRequestState {
  const [request, setRequest] = useState<WeatherRequestState>({
    status: "loading",
  });

  const lastFetchAtRef = useRef<number>(0);
  const isMountedRef = useRef(true);

  const load = useCallback(async () => {
    try {
      const data = await fetchWeather(latitude, longitude);
      if (!isMountedRef.current) return;
      lastFetchAtRef.current = Date.now();
      setRequest({ status: "ready", data, updatedAt: new Date() });
    } catch (error) {
      if (!isMountedRef.current) return;
      lastFetchAtRef.current = Date.now();
      setRequest((previous) =>
        previous.status === "ready"
          ? previous
          : { status: "error", message: (error as Error).message }
      );
    }
  }, [latitude, longitude]);

  useEffect(() => {
    isMountedRef.current = true;
    lastFetchAtRef.current = 0;
    setRequest({ status: "loading" });
    void load();

    const intervalId = window.setInterval(load, REFRESH_INTERVAL_MS);

    const refetchIfStaleEnough = () => {
      if (Date.now() - lastFetchAtRef.current > MIN_REFRESH_GAP_MS) {
        void load();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") refetchIfStaleEnough();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", refetchIfStaleEnough);
    window.addEventListener("online", refetchIfStaleEnough);

    return () => {
      isMountedRef.current = false;
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", refetchIfStaleEnough);
      window.removeEventListener("online", refetchIfStaleEnough);
    };
  }, [load]);

  return request;
}