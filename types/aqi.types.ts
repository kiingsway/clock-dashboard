export type AQIScale = 'european' | 'us';

export interface IAQI {
  latitude: number
  longitude: number
  generationtime_ms: number
  utc_offset_seconds: number
  timezone: string
  timezone_abbreviation: string
  elevation: number
  current_units: {
    time: string
    interval: string
    european_aqi: string
    us_aqi: string
    pm10: string
    pm2_5: string
    ozone: string
    nitrogen_dioxide: string
    sulphur_dioxide: string
    carbon_monoxide: string
    dust: string
  }
  current: {
    time: string
    interval: number
    european_aqi: number
    us_aqi: number
    pm10: number
    pm2_5: number
    ozone: number
    nitrogen_dioxide: number
    sulphur_dioxide: number
    carbon_monoxide: number
    dust: number
  }
  hourly_units: {
    time: string
    european_aqi: string
    us_aqi: string
  }
  hourly: {
    time: string[]
    european_aqi: number[]
    us_aqi: number[]
  }
}

export interface AirQualityMetric {
  label: string; // Ex: "PM2.5" ou "O₃" ou "NO₂"
  value: string | number;
  value2?: string | number;
  unit?: string; // Ex: "μg/m³"
  unit2?: string; // Ex: "μg/m³"
  level?: string; // Ex: "Good", "Very Unhealthy", "Unhealthy for Sensitive Groups"
  color: string; // Cor accent
  desc?: string; // Mensagem sobre a situação da qualidade do ar/partícula
}