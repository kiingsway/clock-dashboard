"use client"
import { fetchWeather } from "@/helpers/fetchWeather";
import { WeatherClockApp } from "./WeatherClockApp";
import WeatherDashboard from "./WeatherDashboard";
import { WeatherData } from "@/types/weather.types";
import React from "react";

export default function Home() {

  const [weatherData, setWeatherData] = React.useState<WeatherData | null>(null);

  React.useEffect(() => {
    fetchWeather()
      .then(data => {
        setWeatherData(data)
      })
  }, [])

  if (!weatherData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl">Loading...</p>
      </div>
    )
  }

  return (
    <WeatherClockApp weather={weatherData} />
  )
}
