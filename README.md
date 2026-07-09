# WeatherDashboard

A responsive clock + weather dashboard built with React, TypeScript, and CSS Modules. No weather API is wired up — `helpers/fetchWeather.ts` is a typed placeholder ready to be filled in.

## Structure

```
weather-dashboard/
├── WeatherDashboard.tsx        entry component, owns clock tick + fetch state
├── WeatherDashboard.module.css
├── index.ts                    barrel export
├── components/
│   ├── Clock.tsx
│   ├── CurrentWeatherCard.tsx
│   ├── HourlyForecast.tsx
│   └── DailyForecast.tsx       (+ matching .module.css files)
├── helpers/
│   ├── fetchWeather.ts         placeholder network call — implement this
│   ├── weatherIcons.tsx        WMO code → category/glyph, swap for real icons
│   ├── dateTime.ts             clock/date formatting, day-part bucketing
│   └── useClock.ts             1-second ticking hook
├── types/
│   └── weather.types.ts        IWeather and friends
└── styles/
    └── tokens.css              design tokens (color, type, radius, motion)
```

## Design notes

- **Clock**: 24-hour, updates every second via `useClock`. Date is formatted with `Intl.DateTimeFormat` using `navigator.language`, weekday + day + month only (no year), so it reads correctly in whatever locale the browser is set to.
- **Ambient sky**: the background is four stacked gradients (dawn/day/dusk/night, see `helpers/dateTime.ts:getDayPart`) that crossfade as the clock's hour crosses a boundary. It's the one deliberately "alive" element — everything else stays quiet glass cards on top of it. Night mode also re-tints the card palette (see the `[data-daypart="night"]` overrides in `WeatherDashboard.module.css`) so text and glass surfaces stay legible.
- **Cards**: translucent, blurred, rounded (16–24px), soft shadow, subtle lift on hover (desktop only, via `@media (hover: hover)`).
- **Fonts**: display face is Space Grotesk (clock, temperatures), body is Inter. Add the Google Fonts `<link>` in `styles/tokens.css`'s header comment to your document, or swap for local/self-hosted fonts — the CSS already has system-font fallbacks so nothing breaks if they're missing.

## Wiring up a real API

1. Implement `fetchWeather(latitude, longitude)` in `helpers/fetchWeather.ts` — the return type (`WeatherData`) already matches every component's expectations, so no other file needs to change.
2. Pass real coordinates into `<WeatherDashboard latitude={...} longitude={...} />` (defaults to `0, 0` as a placeholder).
3. Swap the glyphs in `helpers/weatherIcons.tsx` for real icon components once you've picked an icon set.

## Note on CSS Modules types

`css-modules.d.ts` declares the `*.module.css` imports for TypeScript. If your project already has this (Vite's default `vite-env.d.ts` does), you can delete it — otherwise just make sure it's included by your `tsconfig.json`.

## Usage

```tsx
import { WeatherDashboard } from "./weather-dashboard";

function App() {
  return <WeatherDashboard latitude={-23.5505} longitude={-46.6333} />;
}
```
