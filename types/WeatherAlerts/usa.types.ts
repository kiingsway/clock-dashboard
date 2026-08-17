export type NWSSeverity =
  | "Extreme"
  | "Severe"
  | "Moderate"
  | "Minor"
  | "Unknown";

export interface IWeatherAlertUSAItemProps {
  id: string
  type: string
  properties: {
    "@id": string
    "@type": string
    id: string
    areaDesc: string
    affectedZones: string[]
    sent: string
    effective: string
    onset: string
    expires: string
    ends: string
    status: string
    messageType: string
    category: string
    severity: NWSSeverity
    certainty: string
    urgency: string
    event: string
    sender: string
    senderName: string
    headline: string
    description: string
    instruction: string
    response: string
    note: unknown
    scope: string
    code: string
    language: string
    web: string
  }
}

export interface IWeatherAlertUSA {
  type: string
  features: IWeatherAlertUSAItemProps[]
  title: string
  updated: string
}