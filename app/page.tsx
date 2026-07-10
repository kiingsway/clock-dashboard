"use client"
import { fetchWeather } from "@/helpers/fetchWeather";
import { WeatherClockApp } from "./WeatherClockApp";
import { useWeather } from "@/hooks2/useWeather";

export default function Home() {
  const { weather, isLoading, error } = useWeather();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl">Loading...</p>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl">Erro ao carregar o clima.</p>
        <small>{JSON.stringify(error, null, 2)}</small>
      </div>
    );
  }

  return <WeatherClockApp weather={weather} />;
}
