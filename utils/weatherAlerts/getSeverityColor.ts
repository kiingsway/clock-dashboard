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