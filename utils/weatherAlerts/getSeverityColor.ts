import { NWSSeverity } from "@/types/WeatherAlerts/usa.types";

/**
 * Maps Environment Canada's `risk_colour_en` to an actual color. Falls back
 * to a neutral grey for anything unrecognized rather than guessing — an
 * alert with an odd/new colour name shouldn't silently render as red.
 */
export default function getSeverityColor(riskColourEn: string): string {
  switch (riskColourEn?.trim().toLowerCase()) {
    case "red":
      return "#e5484d";
    case "orange":
      return "#f2994a";
    case "yellow":
      return "#f2c94c";
    case "green":
      return "#4caf72";
    case "grey":
    case "gray":
      return "#8b93a6";
    default:
      return "#8892a4";
  }
}

export function getUSASeverityColor(severity?: NWSSeverity): string {
  switch (severity?.trim().toLowerCase()) {
    case "extreme":
      return 'red' // "#e5484d"; // Vermelho
    case "severe":
      return 'orange' //"#f2994a"; // Laranja
    case "moderate":
      return 'yellow' // "#f2c94c"; // Amarelo
    case "minor":
      return "green"// "#4caf72"; // Verde
    case "unknown":
      return "grey"// "#8b93a6"; // Cinza
    default:
      return "noColor" //"#8892a4"; // Neutro
  }
}