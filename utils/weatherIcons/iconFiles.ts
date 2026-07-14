export const ICON_BASE_URI = "https://cdn.meteocons.com/3.0.0-next.10/svg/fill/";

const ICON_FILES = {
  clearDay: "clear-day",
  clearNight: "clear-night",

  cloudy: "cloudy",
  partlyCloudyDay: "partly-cloudy-day",
  partlyCloudyNight: "partly-cloudy-night",

  smokeDay: 'mostly-clear-day-smoke',
  smokeNight: 'mostly-clear-night-smoke',

  overcast: "overcast",

  hazeDay: 'haze-day',
  hazeNight: 'haze-night',

  fog: "fog",
  fogDay: "fog-day",
  fogNight: "fog-night",

  drizzle: "drizzle",

  rain: "rain",
  heavyRain: "extreme-rain",

  heavySnow: "extreme-snow",

  freezingDrizzle: "sleet",
  freezingRain: "extreme-sleet",

  sleetDay: "mostly-clear-day-sleet",
  sleetNight: "mostly-clear-night-sleet",

  heavySleetDay: "extreme-day-sleet",
  heavySleetNight: "extreme-night-sleet",

  snow: "snow",
  snowShowersDay: "partly-cloudy-day-snow",
  snowShowersNight: "partly-cloudy-night-snow",

  showers: "overcast-rain",

  thunderstorm: "thunderstorms",
  hail: "hail",
  moderateHail: "thunderstorms-overcast-hail",
  heavyHail: "thunderstorms-extreme-hail",

  sunrise: "sunrise",
  sunset: "moonrise",

  unknown: "code-black",
  unknownDay: "weather-alert-day",
  unknownNight: "weather-alert-night",
  error: "code-red",
  loading: "wind-spinner",
} as const;

export default ICON_FILES;