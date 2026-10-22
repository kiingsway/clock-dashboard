# Clock Dashboard

A full-screen clock and weather dashboard, built as an installable PWA for a phone or tablet left on a desk or wall. It shows the time, current conditions, precipitation for the next hours, the sun's path, hourly and 14-day forecasts, air quality and, in the US and Canada, official weather alerts.

Built with Next.js 16 (App Router), React 19 and TypeScript.

## Features

- **Clock and date**: large monospaced clock, 12/24-hour, updated on the minute boundary.
- **Current weather**: animated icon, temperature, feels-like, min/max for the day.
- **Precipitation chart**: rain, showers and snow for the next 4–24 hours (configurable); hidden when no precipitation is expected.
- **Sun path**: sunrise → sunset (or sunset → sunrise) curve tinted by the forecast, with a marker for the current position.
- **Forecasts**: hourly list and a 14-day list; tapping a day opens a sheet with its full details (wind, UV, humidity, visibility, moon, etc.).
- **Air quality**: European or US AQI scale, with a pollutant breakdown and the conversion formulas.
- **Weather alerts**: active alerts from the NWS (US) and Environment Canada, within a configurable radius.
- **Settings**: location (search or device location), language, alert radius, 12/24-hour clock, AQI scale, modal or bottom-sheet overlays, and more. Saved in `localStorage` and synced across tabs.
- **Languages**: English, Português, Français, Español, 한국어.

## Getting started

Requires Node.js 20.9 or later.

```bash
npm install
npm run dev
```

Open http://localhost:3000. No API keys or environment variables are needed: every data source is public.

To open the dev server from another device on your network (e.g. the tablet that will run the dashboard):

```bash
npx next dev --webpack --hostname 0.0.0.0
```

Then add that device's IP to `allowedDevOrigins` in `next.config.ts`.

### Scripts

| Command         | What it does                                |
| --------------- | ------------------------------------------- |
| `npm run dev`   | Development server                          |
| `npm run build` | Production build                            |
| `npm run start` | Serves the production build                 |
| `npm run lint`  | ESLint                                      |
| `npx knip`      | Finds unused files, exports and dependencies |

## How it works

The page is a client component. Settings are read from `localStorage`, the active language's translations are loaded, and then the weather tab renders. Data is fetched with SWR from the app's own API routes, which proxy the public APIs, validate the responses and set cache headers. Everything refreshes every 5 minutes and when the tab regains focus.

### API routes

| Route                              | Upstream                                                   |
| ---------------------------------- | ---------------------------------------------------------- |
| `/api/weather`                     | [Open-Meteo Forecast](https://open-meteo.com/) + moon data computed with `suncalc` |
| `/api/air-quality`                 | [Open-Meteo Air Quality](https://open-meteo.com/en/docs/air-quality-api) |
| `/api/weather-alerts/usa`          | [NWS](https://www.weather.gov/documentation/services-web-api) (`api.weather.gov`) |
| `/api/weather-alerts/canada`       | [Environment Canada](https://api.weather.gc.ca/) (`api.weather.gc.ca`) |
| `/api/locations/cities`            | [countries.dev](https://countries.dev/): city search        |
| `/api/locations/near`              | countries.dev: cities near a coordinate                   |
| `/api/locations/countries`         | countries.dev: country name, translations and flag        |

### Project structure

```
app/
  page.tsx              entry: settings + translations, then the active tab
  layout.tsx            fonts (next/font), metadata, PWA manifest
  api/                  API routes listed above
components/
  tabs/                 one component per tab (currently: WeatherTab)
  layout/weather/       sections of the weather tab (Clock, CurrentWeather, forecasts, widgets…)
  overlays/             SettingsSheet, DailySheet, AQIModal, WeatherAlerts
  ui/                   reusable pieces (Modal, BottomSheet, Tooltip, Slider, charts, icons…)
contexts/
  AppSettingsContext/   settings state, validation and persistence
  NowContext/           current time and day, in the location's timezone
hooks/                  data fetching (useWeather, useAQI, useWeatherAlerts) and UI helpers
i18n/
  i18n.ts               i18next setup; loads one language at a time
  locales/<lang>.json   translations
constants/              settings defaults and limits, icon names, scales, alert providers
utils/                  formatters, weather/AQI/geo calculations, alert mappers
styles/tokens.css       design tokens (colors, type scale, spacing, radii, shadows)
public/icons/weather/   Meteocons SVGs
```

## Common changes

**Add or edit a translation**: edit `i18n/locales/<lang>.json`. To add a language, create the file, register it in `localeLoaders` and `SUPPORTED_LANGUAGES` in `i18n/i18n.ts`, and add it to `LANGUAGES` in `constants/settings.ts`.

**Add weather alerts for another country**: add an API route that fetches the country's alerts, a mapper in `utils/weatherAlerts/alertMapper.ts`, and an entry in `WEATHER_ALERT_PROVIDERS` (`constants/alerts.ts`), keyed by country code. The hook doesn't change.

**Change the look**: colors, font sizes, spacing, radii and shadows are CSS variables in `styles/tokens.css`. Component styles are CSS/SCSS modules that use these tokens. Font sizes are in `em`, so they follow the weather tab's scale.

**Use a weather icon**: refer to it by its Meteocons name (e.g. `getIconUrl("partly-cloudy-day")`). The SVG must exist in `public/icons/weather/`.

## Credits

- Weather icons: [Meteocons](https://github.com/basmilius/meteocons) by Bas Milius (v3.0.0-next.10, fill style), MIT License. The icons are bundled in `public/icons/weather/`, with the license in `public/icons/weather/LICENSE`.
- Weather and air-quality data: [Open-Meteo](https://open-meteo.com/).
- Weather alerts: [National Weather Service](https://www.weather.gov/) and [Environment and Climate Change Canada](https://weather.gc.ca/).
- Locations: [countries.dev](https://countries.dev/).
